import { CustomAPIError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

const fulfillFromBatches = async (tx, medicine_id, quantityNeeded) => {
  // Only get non-expired batches with available quantity, ordered by expiry (FIFO)
  const batches = await tx.mEDICINE_BATCHES.findMany({
    where: {
      medicine_id,
      quantity: { gt: 0 },
      expiry_Date: { gt: new Date() }, // Only non-expired batches
    },
    orderBy: { expiry_Date: "asc" }, // FIFO - First In First Out
  });

  if (batches.length === 0) {
    throw new CustomAPIError(
      `No available stock for medicine ID ${medicine_id}`,
      StatusCodes.BAD_REQUEST
    );
  }

  let remaining = quantityNeeded;
  const usedBatches = [];

  for (const batch of batches) {
    if (remaining <= 0) break;

    // Re-check quantity in case it was modified by another transaction
    const currentBatch = await tx.mEDICINE_BATCHES.findUnique({
      where: { id: batch.id },
      select: { quantity: true, expiry_Date: true },
    });

    // Skip if batch is now empty or expired
    if (!currentBatch || currentBatch.quantity <= 0 || currentBatch.expiry_Date <= new Date()) {
      continue;
    }

    const take = Math.min(currentBatch.quantity, remaining);

    await tx.mEDICINE_BATCHES.update({
      where: { id: batch.id },
      data: { quantity: { decrement: take } },
    });

    usedBatches.push({ batch_id: batch.id, quantity: take });
    remaining -= take;
  }

  if (remaining > 0) {
    throw new CustomAPIError(
      `Insufficient stock available for medicine ID ${medicine_id}. Could only fulfill ${quantityNeeded - remaining} out of ${quantityNeeded} units`,
      StatusCodes.BAD_REQUEST
    );
  }

  return usedBatches;
};

export default fulfillFromBatches;