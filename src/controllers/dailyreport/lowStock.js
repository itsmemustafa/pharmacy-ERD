import prisma from "../../lib/prisma.js";

const lowQuantity = async (req, res) => {
  const medicines = await prisma.medicine.findMany({
    select: {
      id: true,
      name: true,
      min_quantity: true,
      medicineBatches: {
        where: {
          quantity: { gt: 0 },
          expiry_Date: { gt: new Date() },
        },
        select: { quantity: true },
      },
    },
  });

  const low_quantity_medicines = medicines
    .map((medicine) => {
      const total_quantity = medicine.medicineBatches.reduce(
        (sum, batch) => sum + batch.quantity,
        0,
      );
      return {
        medicine_id: medicine.id,
        name: medicine.name,
        min_quantity: medicine.min_quantity,
        total_quantity,
      };
    })
    .filter((row) => row.total_quantity < row.min_quantity);

  res.status(200).json(low_quantity_medicines);
};
export default lowQuantity;
