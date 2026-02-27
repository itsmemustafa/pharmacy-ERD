import request from "supertest";
import createTestApp from "./testApp.js";
import saleRouter from "../../routes/sale.js";
import prisma from "../../lib/prisma.js";
import processSale from "../../services/saleTransaction.js";
import jwt from "jsonwebtoken";

// Mocks
jest.mock("../../lib/prisma.js", () => ({
    __esModule: true,
    default: {
        user: { findUnique: jest.fn() },
    },
}));

jest.mock("../../services/saleTransaction.js", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({ verify: jest.fn() }));

// Build test app with only the sale router
const app = createTestApp([{ path: "/api/v1/sale", router: saleRouter }]);


// Helpers
const mockAuthUser = (role = "cashier") => {
    const fakeUser = { id: 1, name: "Test User", email: "t@t.com", role, isVerified: true };
    jwt.verify.mockReturnValue({ id: fakeUser.id });
    prisma.user.findUnique.mockResolvedValue(fakeUser);
};

const validSaleBody = {
    payment_method: "cash",
    items: [
        { medicine_id: 1, quantity: 5, unit_price: 15.0 },
    ],
};


// Test Suites
describe("Sale Integration Tests", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("POST /api/v1/sale", () => {
        it("returns 201 on successful sale", async () => {
            mockAuthUser("cashier");
            const fakeSale = { id: 5, total_amount: 75.0, payment_method: "cash" };
            processSale.mockResolvedValue(fakeSale);

            const res = await request(app)
                .post("/api/v1/sale")
                .set("Authorization", "Bearer valid-token")
                .send(validSaleBody);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.id).toBe(5);
            expect(processSale).toHaveBeenCalledWith(
                expect.objectContaining({
                    payment_method: "cash",
                    items: validSaleBody.items,
                })
            );
        });

        it("returns 401 without an auth token", async () => {
            const res = await request(app).post("/api/v1/sale").send(validSaleBody);
            expect(res.status).toBe(401);
        });

        it("returns 400 from Zod when items array is missing", async () => {
            mockAuthUser("cashier");

            const res = await request(app)
                .post("/api/v1/sale")
                .set("Authorization", "Bearer valid-token")
                .send({ payment_method: "cash" }); // no items

            expect(res.status).toBe(400);
            expect(res.body.msg).toBe("Validation error");
        });

        it("returns 400 from Zod when items array is empty", async () => {
            mockAuthUser("cashier");

            const res = await request(app)
                .post("/api/v1/sale")
                .set("Authorization", "Bearer valid-token")
                .send({ payment_method: "cash", items: [] });

            expect(res.status).toBe(400);
            expect(res.body.msg).toBe("Validation error");
        });

        it("returns 400 when payment_method is invalid", async () => {
            mockAuthUser("cashier");

            const res = await request(app)
                .post("/api/v1/sale")
                .set("Authorization", "Bearer valid-token")
                .send({ payment_method: "bitcoin", items: validSaleBody.items });

            expect(res.status).toBe(400);
            expect(res.body.msg).toBe("Validation error");
        });
    });
});
