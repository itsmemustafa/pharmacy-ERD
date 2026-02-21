import prisma from "../../lib/prisma.js";

const lowQuantity = async (req, res) => {
  const low_quantity_medicines = await prisma.$queryRaw`
  SELECT m.id as medicine_id, mb.id as batch_id, m.min_quantity, mb.quantity 
  FROM "MEDICINE_BATCHES" mb
  LEFT JOIN "Medicine" m ON mb.medicine_id = m.id 
  WHERE m.min_quantity > mb.quantity
`;

  res.status(200).json(low_quantity_medicines);
};
export default lowQuantity;
