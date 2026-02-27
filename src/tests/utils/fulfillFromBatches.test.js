import fulfillFromBatches from "../../utils/fulfillFromBatches.js";

const mockTx = {
  mEDICINE_BATCHES: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe("fulfillFromBatches()", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should fulfill from a single batch", async () => {
    mockTx.mEDICINE_BATCHES.findMany.mockResolvedValue([
      { id: 1, quantity: 100, expiry_Date: new Date("2099-01-01") },
    ]);
    mockTx.mEDICINE_BATCHES.findUnique.mockResolvedValue({
      quantity: 100, expiry_Date: new Date("2099-01-01"),
    });
    mockTx.mEDICINE_BATCHES.update.mockResolvedValue({});

    const result = await fulfillFromBatches(mockTx, 1, 10);

    expect(result).toEqual([{ batch_id: 1, quantity: 10 }]);
  });

  it("should fulfill across multiple batches", async () => {
    mockTx.mEDICINE_BATCHES.findMany.mockResolvedValue([
      { id: 1, quantity: 5,  expiry_Date: new Date("2099-01-01") },
      { id: 2, quantity: 10, expiry_Date: new Date("2099-06-01") },
    ]);
    mockTx.mEDICINE_BATCHES.findUnique
      .mockResolvedValueOnce({ quantity: 5,  expiry_Date: new Date("2099-01-01") })
      .mockResolvedValueOnce({ quantity: 10, expiry_Date: new Date("2099-06-01") });
    mockTx.mEDICINE_BATCHES.update.mockResolvedValue({});

    const result = await fulfillFromBatches(mockTx, 1, 12);

    expect(result).toEqual([
      { batch_id: 1, quantity: 5 },
      { batch_id: 2, quantity: 7 },
    ]);
  });

  it("should throw when no stock available", async () => {
    mockTx.mEDICINE_BATCHES.findMany.mockResolvedValue([]);

    await expect(fulfillFromBatches(mockTx, 1, 10)).rejects.toThrow(
      "No available stock for medicine ID 1"
    );
  });

  it("should throw when stock is insufficient", async () => {
    mockTx.mEDICINE_BATCHES.findMany.mockResolvedValue([
      { id: 1, quantity: 5, expiry_Date: new Date("2099-01-01") },
    ]);
    mockTx.mEDICINE_BATCHES.findUnique.mockResolvedValue({
      quantity: 5, expiry_Date: new Date("2099-01-01"),
    });
    mockTx.mEDICINE_BATCHES.update.mockResolvedValue({});

    await expect(fulfillFromBatches(mockTx, 1, 20)).rejects.toThrow(
      "Insufficient stock available for medicine ID 1"
    );
  });
});