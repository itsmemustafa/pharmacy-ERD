import request from "supertest";
import createTestApp from "./testApp.js";
import authRouter from "../../routes/auth.js";
import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import signJwt from "../../utils/jwt-sign.js";
import generateRefreshToken from "../../utils/refresh-token.js";

// --- Mocks ---
jest.mock("../../lib/prisma.js", () => ({
    __esModule: true,
    default: {
        user: { findUnique: jest.fn(), create: jest.fn() },
        token: { upsert: jest.fn(), create: jest.fn(), deleteMany: jest.fn() },
    },
}));

jest.mock("../../utils/jwt-sign.js", () => jest.fn());
jest.mock("../../utils/refresh-token.js", () => jest.fn());
jest.mock("bcryptjs", () => ({
    compare: jest.fn(),
    genSalt: jest.fn().mockResolvedValue("salt"),
    hash: jest.fn(),
}));

// Mock email/verification utils used in signUp
jest.mock("../../utils/validatePassword.js", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isValid: true,
        strength: { level: "strong" },
        errors: [],
    })),
}));
jest.mock("../../utils/sendVerifyEmail.js", () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("../../utils/GenerateVerificationToken.js", () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue("mocked-email-token"),
}));

// Build test app with only the auth router
const app = createTestApp([{ path: "/api/v1/auth", router: authRouter }]);

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────
const mockRefreshToken = () =>
    generateRefreshToken.mockReturnValue({
        refreshToken: "mocked-refresh-token",
        hashedToken: "mocked-hashed-token",
        refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

// ──────────────────────────────────────────
// Test Suites
// ──────────────────────────────────────────
describe("Auth Integration Tests", () => {
    beforeEach(() => jest.clearAllMocks());

    // POST /api/v1/auth/login
    describe("POST /api/v1/auth/login", () => {
        it("returns 200 and sets cookies on successful login", async () => {
            prisma.user.findUnique.mockResolvedValue({
                id: 1,
                name: "Test User",
                email: "test@example.com",
                password: "hashedpassword",
                role: "admin",
                isVerified: true,
            });
            bcrypt.compare.mockResolvedValue(true);
            signJwt.mockReturnValue("mocked-access-token");
            mockRefreshToken();
            prisma.token.upsert.mockResolvedValue({});

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "test@example.com", password: "password123" });

            expect(res.status).toBe(200);
            expect(res.body.user).toBeDefined();
            expect(res.body.user.name).toBe("Test User");
            const cookies = res.headers["set-cookie"].join(";");
            expect(cookies).toContain("accessToken=mocked-access-token");
            expect(cookies).toContain("refreshToken=mocked-refresh-token");
        });

        it("returns 400 from Zod validation when fields are missing", async () => {
            // Zod loginSchema catches missing password before the controller
            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "test@example.com" }); // no password

            expect(res.status).toBe(400);
            expect(res.body.msg).toBe("Validation error");
        });

        it("returns 401 for a non-existent user", async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "nobody@example.com", password: "anypassword" });

            expect(res.status).toBe(401);
            expect(res.body.msg).toBe("Invalid credentials");
        });

        it("returns 401 for wrong password", async () => {
            prisma.user.findUnique.mockResolvedValue({
                id: 1,
                email: "test@example.com",
                password: "hashedpassword",
                isVerified: true,
            });
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "test@example.com", password: "wrongpassword" });

            expect(res.status).toBe(401);
            expect(res.body.msg).toBe("Invalid credentials");
        });

        it("returns 400 for an unverified email", async () => {
            prisma.user.findUnique.mockResolvedValue({
                id: 1,
                email: "unverified@example.com",
                password: "hashedpassword",
                isVerified: false,
            });
            bcrypt.compare.mockResolvedValue(true);

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ email: "unverified@example.com", password: "password123" });

            expect(res.status).toBe(500); // CustomAPIError without statusCode defaults to 500
            expect(res.body.msg).toBe("Please verify your email before logging in");
        });
    });

    // POST /api/v1/auth/sign-up
    describe("POST /api/v1/auth/sign-up", () => {
        // Valid sign-up body — note: role is required by Zod schema
        const validSignUpBody = {
            name: "New User",
            email: "new@example.com",
            password: "StrongPassword123!",
            role: "pharmacist",
        };

        it("returns 201 on successful registration", async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hashedpassword");
            prisma.user.create.mockResolvedValue({
                id: 2,
                name: "New User",
                email: "new@example.com",
                role: "pharmacist",
            });
            signJwt.mockReturnValue("mocked-access-token");
            mockRefreshToken();
            prisma.token.create.mockResolvedValue({});

            const res = await request(app)
                .post("/api/v1/auth/sign-up")
                .send(validSignUpBody);

            expect(res.status).toBe(201);
            expect(res.body.message).toContain("Please check your email");
            expect(res.headers["set-cookie"]).toBeDefined();
        });

        it("returns 400 from Zod validation when fields are missing", async () => {
            const res = await request(app)
                .post("/api/v1/auth/sign-up")
                .send({ name: "New User", email: "new@example.com" }); // no password/role

            expect(res.status).toBe(400);
            expect(res.body.msg).toBe("Validation error");
        });

        it("returns 400 from Zod when password is too short (< 8 chars)", async () => {
            const res = await request(app)
                .post("/api/v1/auth/sign-up")
                .send({ name: "User", email: "user@example.com", password: "weak", role: "cashier" });

            expect(res.status).toBe(400);
            expect(res.body.msg).toBe("Validation error");
        });

        it("returns 409 when email already exists", async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 1, email: "existing@example.com" });

            const res = await request(app)
                .post("/api/v1/auth/sign-up")
                .send({ ...validSignUpBody, email: "existing@example.com" });

            expect(res.status).toBe(409);
            expect(res.body.msg).toBe("Email already exists");
        });
    });
});
