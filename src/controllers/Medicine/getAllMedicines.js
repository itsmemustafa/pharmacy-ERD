import prisma from "../../lib/prisma.js";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../../errors/index.js";

const getAllMedicines = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Validate pagination values
  if (page < 1 || limit < 1 || limit > 100) {
    throw new CustomAPIError(
      "Invalid pagination parameters",
      StatusCodes.BAD_REQUEST
    );
  }

  const filters = {};

  // Text search filters
  if (req.query.name) {
    filters.name = {
      contains: req.query.name,
      mode: "insensitive",
    };
  }

  if (req.query.generic_name) {
    filters.generic_name = {
      contains: req.query.generic_name,
      mode: "insensitive",
    };
  }

  // Price filters (numeric)
  if (req.query.price_sell) {
    filters.price_sell = parseFloat(req.query.price_sell);
  }

  if (req.query.minPrice) {
    filters.price_sell = {
      ...filters.price_sell,
      gte: parseFloat(req.query.minPrice),
    };
  }

  if (req.query.maxPrice) {
    filters.price_sell = {
      ...filters.price_sell,
      lte: parseFloat(req.query.maxPrice),
    };
  }

  // Min quantity filters
  if (req.query.min_quantity) {
    filters.min_quantity = parseInt(req.query.min_quantity);
  }

  if (req.query.minQuantity) {
    filters.min_quantity = {
      ...filters.min_quantity,
      gte: parseInt(req.query.minQuantity),
    };
  }

  if (req.query.maxQuantity) {
    filters.min_quantity = {
      ...filters.min_quantity,
      lte: parseInt(req.query.maxQuantity),
    };
  }

  // Boolean filter for prescription requirement
  if (req.query.requires_prescription !== undefined) {
    filters.requires_prescription = req.query.requires_prescription === "true";
  }

  const [medicines, total] = await Promise.all([
    prisma.medicine.findMany({
      where: filters,
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        name: true,
        generic_name: true,
        price_sell: true,
        min_quantity: true,
        requires_prescription: true,
       
      },
    }),

    prisma.medicine.count({
      where: filters,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.status(StatusCodes.OK).json({
    success: true,
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    medicines,
  });
};

export default getAllMedicines; 