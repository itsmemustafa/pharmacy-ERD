import request from "supertest";
import createTestApp from "./testApp.js";
import purchaseRouter from "../../routes/purchase.js";
import prisma from "../../lib/prisma.js";
import purchaseTransaction from "../../services/purchaseTransaction.js";
import jwt from "jsonwebtoken";

// --- Mocks ---
jest.mock("../../lib/prisma.js", () => ({
    __esModule: true,
    default: {
        user: { findUnique: jest.fn() },
    },
}));

jest.mock("../../services/purchaseTransaction.js", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({ verify: jest.fn() }));

// Build test app with only the purchase router
const app = createTestApp([{ path: "/api/v1/purchase", router: purchaseRouter }]);

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────
const mockAuthUser = (role = "admin") => {
    const fakeUser = { id: 1, name: "Test User", email: "t@t.com", role, isVerified: true };
    jwt.verify.mockReturnValue({ id: fakeUser.id });
    prisma.user.findUnique.mockResolvedValue(fakeUser);
};

const validPurchaseBody = {
    supplier_id: 1,
    items: [
        {
            medicine_id: 1,
            batch_number: "BATCH-001",
            quantity: 100,
            unit_price: 10.5,
            expiry_Date: "2027-01-01",
        },
    ],
};

// ──────────────────────────────────────────
// Test Suites
// ──────────────────────────────────────────
describe("Purchase Integration Tests", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("POST /api/v1/purchase", () => {
        it("returns 201 on successful purchase creation", async () => {
            mockAuthUser("admin");
            const fakePurchase = { id: 10, total_amount: 1050 };
            purchaseTransaction.mockResolvedValue(fakePurchase);

            const res = await request(app)
                .post("/api/v1/purchase")
                .set("Authorization", "Bearer valid-token")
                .send(validPurchaseBody);

            expect(res.status).toBe(201);
            expect(res.body.id).toBe(10);
            expect(purchaseTransaction).toHaveBeenCalledWith(
                validPurchaseBody.items,
                1,    // user_id from mocked auth
                validPurchaseBody.supplier_id
            );
        });

        it("returns 401 without an auth token", async () => {
            const res = await request(app).post("/api/v1/purchase").send(validPurchaseBody);
            expect(res.status).toBe(401);
        });

        it("returns 400 from Zod when supplier_id is missing", async () => {
            mockAuthUser("admin");

            const res = await request(app)
                .post("/api/v1/purchase")
                .set("Authorization", "Bearer valid-token")
                .send({ items: validPurchaseBody.items }); // no supplier_id

            expect(res.status).toBe(400);
            expect(res.body.msg).toBe("Validation error");
        });

        it("returns 400 from Zod when items array is empty", async () => {
            mockAuthUser("admin");

            const res = await request(app)
                .post("/api/v1/purchase")
                .set("Authorization", "Bearer valid-token")
                .send({ supplier_id: 1, items: [] });

            expect(res.status).toBe(400);
            expect(res.body.msg).toBe("Validation error");
        });
    });
});
