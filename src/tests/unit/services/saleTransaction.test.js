// src/tests/services/processSale.test.js
import processSale from "../../../services/saleTransaction.js";
import prisma from "../../../lib/prisma.js";
import fulfillFromBatches from "../../../utils/fulfillFromBatches.js";

jest.mock("../../lib/prisma.js", () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
  },
}));

jest.mock("../../utils/fulfillFromBatches.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("processSale()", () => {
  let mockTx;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTx = {
      medicine: { findMany: jest.fn() },
      sALE: { create: jest.fn() },
      sALE_ITEMS: { create: jest.fn() },
      mEDICINE_BATCHES: { aggregate: jest.fn() },
    };

    prisma.$transaction.mockImplementation(async (callback) =>
      callback(mockTx),
    );
  });

  it("should create a sale and sale items correctly", async () => {
    // Arrange
    mockTx.medicine.findMany.mockResolvedValue([
      { id: 1, name: "Paracetamol", price_sell: 50 },
    ]);
    mockTx.sALE.create.mockResolvedValue({ id: 10, total_amount: 100 });
    mockTx.mEDICINE_BATCHES.aggregate.mockResolvedValue({
      _sum: { quantity: 100 },
    });
    fulfillFromBatches.mockResolvedValue([{ batch_id: 1, quantity: 2 }]);
    mockTx.sALE_ITEMS.create.mockResolvedValue({});

    // Act
    const result = await processSale({
      userId: 1,
      payment_method: "cash",
      items: [{ medicine_id: 1, quantity: 2 }],
    });

    // Assert
    expect(result).toEqual({ id: 10, total_amount: 100 });
    expect(mockTx.sALE.create).toHaveBeenCalledWith({
      data: { user_id: 1, total_amount: 100, payment_method: "cash" },
    });
    expect(mockTx.sALE_ITEMS.create).toHaveBeenCalledTimes(1);
  });

  it("should throw when a medicine is not found", async () => {
    // Arrange — return empty array, medicine doesn't exist
    mockTx.medicine.findMany.mockResolvedValue([]);

    // Act + Assert
    await expect(
      processSale({
        userId: 1,
        payment_method: "cash",
        items: [{ medicine_id: 99, quantity: 2 }],
      }),
    ).rejects.toThrow("Medicine(s) with ID(s) 99 not found");
  });

  it("should throw when stock is insufficient", async () => {
    // Arrange
    mockTx.medicine.findMany.mockResolvedValue([
      { id: 1, name: "Paracetamol", price_sell: 50 },
    ]);
    mockTx.sALE.create.mockResolvedValue({ id: 10 });
    mockTx.mEDICINE_BATCHES.aggregate.mockResolvedValue({
      _sum: { quantity: 1 }, // only 1 in stock but 10 needed
    });

    // Act + Assert
    await expect(
      processSale({
        userId: 1,
        payment_method: "cash",
        items: [{ medicine_id: 1, quantity: 10 }],
      }),
    ).rejects.toThrow("Insufficient stock for medicine ID 1");
  });

  it("should calculate total_amount correctly from DB prices", async () => {
    // Arrange — price comes from DB not from client
    mockTx.medicine.findMany.mockResolvedValue([
      { id: 1, name: "Paracetamol", price_sell: 50 }, // DB price = 50
    ]);
    mockTx.sALE.create.mockResolvedValue({ id: 10 });
    mockTx.mEDICINE_BATCHES.aggregate.mockResolvedValue({
      _sum: { quantity: 100 },
    });
    fulfillFromBatches.mockResolvedValue([{ batch_id: 1, quantity: 2 }]);
    mockTx.sALE_ITEMS.create.mockResolvedValue({});

    // Act
    await processSale({
      userId: 1,
      payment_method: "cash",
      items: [{ medicine_id: 1, quantity: 2 }],
    });

    // Assert — total = 2 * 50 = 100
    expect(mockTx.sALE.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ total_amount: 100 }),
    });
  });
});
