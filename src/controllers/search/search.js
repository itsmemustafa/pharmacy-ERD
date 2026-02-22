import { StatusCodes } from "http-status-codes";
// import generateEmbedding from "../../lib/embedding_openAi.js";
import prisma from "../../lib/prisma.js";
import generateEmbedding from "../../lib/embedding_supbase.js";
const searchMedicine = async (req, res) => {
  const { query } = req.query;

  //my card got declined so i switched to sub base instead but openAi the is better option
  const queryEmbedding = await generateEmbedding(query);
  const embeddingStr = `[${queryEmbedding.join(",")}]`;

  const result = await prisma.$queryRaw`
    SELECT id, name, generic_name, price_sell, min_quantity, requires_prescription,
           embedding <=> ${embeddingStr}::vector AS distance
    FROM "Medicine"
    ORDER BY distance
    LIMIT 10
  `;
  res.status(StatusCodes.OK).json(result);
};
export default searchMedicine;
