import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../../errors/index.js";
import prisma from "../../lib/prisma.js";
import generateEmbedding from "../../lib/embedding_supbase.js";
const addMedicine = async (req, res) => {
  const {
    name,
    generic_name,
    price_sell,
    min_quantity,
    requires_prescription,
  } = req.body;

  if (!name || !generic_name || !price_sell || !min_quantity) {
    throw new CustomAPIError("Missing information", StatusCodes.BAD_REQUEST);
  }
  const embedding = await generateEmbedding(`${name} ${generic_name}`);
  const embeddingStr = `[${embedding.join(",")}]`;

  await prisma.$executeRaw`
    INSERT INTO "Medicine" (name, generic_name, price_sell, min_quantity, requires_prescription, embedding)
    VALUES (${name}, ${generic_name}, ${Number(price_sell)}, ${Number(min_quantity)}, ${requires_prescription ?? false}, ${embeddingStr}::vector)
  `;
  // get the added medicine
  const Medicine = await prisma.medicine.findFirst({
    where: { name },
    orderBy: { id: "desc" }, // gets the latest one
    select: {
      id: true,
      name: true,
      generic_name: true,
      price_sell: true,
      min_quantity: true,
      requires_prescription: true,
    },
  });
  res.status(StatusCodes.CREATED).json({ data: Medicine });
};
export default addMedicine;
