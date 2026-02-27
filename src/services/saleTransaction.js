import prisma from "../lib/prisma.js";
import { CustomAPIError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import fulfillFromBatches from "../utils/fulfillFromBatches.js";

const processSale = async ({ userId, payment_method, items }) => {
  return prisma.$transaction(
    async (tx) => {
      // Verify all medicines exist and get their prices
      const medicineIds = [...new Set(items.map((item) => item.medicine_id))];
      const medicines = await tx.medicine.findMany({
        where: { id: { in: medicineIds } },
        select: { id: true, name: true, price_sell: true },
      });

      if (medicines.length !== medicineIds.length) {
        const foundIds = new Set(medicines.map((m) => m.id));
        const missingIds = medicineIds.filter((id) => !foundIds.has(id));
        throw new CustomAPIError(
          `Medicine(s) with ID(s) ${missingIds.join(", ")} not found`,
          StatusCodes.NOT_FOUND,
        );
      }

      // Build a price map from DB { medicine_id: price_sell }
      const priceMap = Object.fromEntries(
        medicines.map((m) => [m.id, Number(m.price_sell)]),
      );

      // Calculate totals using DB prices, not client prices
      let total_amount = 0;
      const itemsWithSubtotal = items.map((item) => {
        const unit_price = priceMap[item.medicine_id];
        const subtotal = item.quantity * unit_price;
        total_amount += subtotal;
        return { ...item, unit_price, subtotal };
      });

      const sale = await tx.sALE.create({
        data: { user_id: userId, total_amount, payment_method },
      });

      for (const item of itemsWithSubtotal) {
        const stock = await tx.mEDICINE_BATCHES.aggregate({
          where: {
            medicine_id: item.medicine_id,
            quantity: { gt: 0 },
            expiry_Date: { gt: new Date() },
          },
          _sum: { quantity: true },
        });

        if ((stock._sum.quantity ?? 0) < item.quantity) {
          throw new CustomAPIError(
            `Insufficient stock for medicine ID ${item.medicine_id}. Available: ${stock._sum.quantity ?? 0}, Required: ${item.quantity}`,
            StatusCodes.BAD_REQUEST,
          );
        }

        const usedBatches = await fulfillFromBatches(
          tx,
          item.medicine_id,
          item.quantity,
        );

        for (const { batch_id, quantity } of usedBatches) {
          await tx.sALE_ITEMS.create({
            data: {
              sale_id: sale.id,
              medicine_id: item.medicine_id,
              batch_id,
              quantity,
              unit_price: item.unit_price,
              subtotal: quantity * item.unit_price,
            },
          });
        }
      }

      return sale;
    },
    {
      timeout: 15000,
      maxWait: 10000,
    },
  );
};

export default processSale;
