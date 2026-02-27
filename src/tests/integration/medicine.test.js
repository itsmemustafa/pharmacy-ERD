import request from "supertest";
import createTestApp from "./testApp.js";
import medicineRouter from "../../routes/Medicine.js";
import prisma from "../../lib/prisma.js";
import jwt from "jsonwebtoken";

jest.mock("../../lib/embedding_supbase.js", () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue(new Array(1536).fill(0)),
}));

jest.mock("../../lib/prisma.js", () => ({
    __esModule: true,
    default: {
        user: { findUnique: jest.fn() },
        medicine: { findMany: jest.fn(), count: jest.fn(), findFirst: jest.fn() },
        $executeRaw: jest.fn(),
    },
}));

jest.mock("jsonwebtoken", () => ({ verify: jest.fn() }));

// Build test app with only the Medicine router
const app = createTestApp([{ path: "/api/v1/medicine", router: medicineRouter }]);

// Helpers
const mockAuthUser = (role = "admin") => {
    const fakeUser = { id: 1, name: "Test User", email: "t@t.com", role, isVerified: true };
    jwt.verify.mockReturnValue({ id: fakeUser.id });
    prisma.user.findUnique.mockResolvedValue(fakeUser);
};

// Test Suites
describe("Medicine Integration Tests", () => {
    beforeEach(() => jest.clearAllMocks());

    // GET /api/v1/medicine
    describe("GET /api/v1/medicine", () => {
        it("returns 200 with a paginated list of medicines", async () => {
            mockAuthUser();
            const fakeMedicines = [
                { id: 1, name: "Paracetamol", generic_name: "Acetaminophen", price_sell: 5.0, min_quantity: 10, requires_prescription: false },
                { id: 2, name: "Amoxicillin", generic_name: "Amoxicillin", price_sell: 12.0, min_quantity: 20, requires_prescription: true },
            ];
            prisma.medicine.findMany.mockResolvedValue(fakeMedicines);
            prisma.medicine.count.mockResolvedValue(2);

            const res = await request(app)
                .get("/api/v1/medicine")
                .set("Authorization", "Bearer valid-token");

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.medicines).toHaveLength(2);
            expect(res.body.total).toBe(2);
            expect(res.body.page).toBe(1);
        });

        it("returns 401 without an auth token", async () => {
            const res = await request(app).get("/api/v1/medicine");
            expect(res.status).toBe(401);
        });

        it("returns 400 for invalid pagination params (limit > 100)", async () => {
            mockAuthUser();
            prisma.medicine.findMany.mockResolvedValue([]);
            prisma.medicine.count.mockResolvedValue(0);

            const res = await request(app)
                .get("/api/v1/medicine?limit=200")
                .set("Authorization", "Bearer valid-token");

            expect(res.status).toBe(400);
        });
    });

    // POST /api/v1/medicine
    describe("POST /api/v1/medicine", () => {
        const validMedicineBody = {
            name: "Ibuprofen",
            generic_name: "Ibuprofen",
            price_sell: 8.5,
            min_quantity: 15,
            requires_prescription: false,
        };

        it("returns 201 when a medicine is created successfully", async () => {
            mockAuthUser("admin");
            prisma.$executeRaw.mockResolvedValue(1);
            prisma.medicine.findFirst.mockResolvedValue({
                id: 3,
                name: "Ibuprofen",
                generic_name: "Ibuprofen",
                price_sell: 8.5,
                min_quantity: 15,
                requires_prescription: false,
            });

            const res = await request(app)
                .post("/api/v1/medicine")
                .set("Authorization", "Bearer valid-token")
                .send(validMedicineBody);

            expect(res.status).toBe(201);
            expect(res.body.data).toBeDefined();
            expect(res.body.data.name).toBe("Ibuprofen");
        });

        it("returns 401 without an auth token", async () => {
            const res = await request(app).post("/api/v1/medicine").send(validMedicineBody);
            expect(res.status).toBe(401);
        });

        it("returns 400 from Zod validation when required fields are missing", async () => {
            mockAuthUser("admin");

            const res = await request(app)
                .post("/api/v1/medicine")
                .set("Authorization", "Bearer valid-token")
                .send({ name: "Ibuprofen" }); // missing generic_name, price_sell, min_quantity

            expect(res.status).toBe(400);
            expect(res.body.msg).toBe("Validation error");
        });
    });
});
