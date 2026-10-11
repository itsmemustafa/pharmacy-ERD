import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import generateEmbedding from "../../lib/embedding_supbase.js";

const searchMedicine = async (req, res) => {
  const query = String(req.query.query ?? "").trim();

  if (!query) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "query is required" });
  }

  try {
    const queryEmbedding = await generateEmbedding(query);

    if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
      return res.status(StatusCodes.OK).json([]);
    }

    const embeddingStr = `[${queryEmbedding.map(Number).join(",")}]`;

    const result = await prisma.$queryRaw`
      SELECT id, name, generic_name, price_sell, min_quantity, requires_prescription,
             embedding <=> ${embeddingStr}::vector(384) AS distance
      FROM "Medicine"
      WHERE embedding IS NOT NULL
      ORDER BY distance ASC
      LIMIT 10
    `;

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    console.error("Medicine search failed:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Search failed",
      error: error.message,
    });
  }
};

export default searchMedicine;
