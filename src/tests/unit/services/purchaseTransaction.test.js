import purchaseTransaction from "../../../services/purchaseTransaction.js";
import prisma from "../../../lib/prisma.js";

jest.mock("../../lib/prisma.js", () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
  },
}));

describe("purchaseTransaction Unit Test", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should calculate totals and call prisma transaction correctly", async () => {
    const mockTx = {
      pURCHASES: {
        create: jest.fn().mockResolvedValue({ id: 1 }),
      },
      mEDICINE_BATCHES: {
        create: jest.fn().mockResolvedValue({ id: 10 }),
      },
      pURCHASE_ITEMS: {
        create: jest.fn().mockResolvedValue({ id: 100 }),
      },
    };

    prisma.$transaction.mockImplementation(async (callback) => {
      return callback(mockTx);
    });

    const items = [
      {
        medicine_id: 1,
        quantity: 2,
        unit_price: 50,
        batch_number: "B1",
        expiry_Date: "2026-01-01",
      },
    ];

    const result = await purchaseTransaction(items, 5, 9);

    expect(result.id).toBe(1);
    expect(mockTx.pURCHASES.create).toHaveBeenCalled();
    expect(mockTx.mEDICINE_BATCHES.create).toHaveBeenCalled();
    expect(mockTx.pURCHASE_ITEMS.create).toHaveBeenCalled();
  });
});
