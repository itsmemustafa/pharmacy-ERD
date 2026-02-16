import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import {CustomAPIError} from "../../errors/index.js";
const getAllSuppliers = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {};

    if (req.query.name) {
      filters.name = {
        contains: req.query.name,
        mode: "insensitive",
      };
    }

    if (req.query.email) {
      filters.email = {
        contains: req.query.email,
        mode: "insensitive",
      };
    }

    if (req.query.phone) {
      filters.phone = req.query.phone;
    }

    if (req.query.address) {
      filters.address = {
        contains: req.query.address,
        mode: "insensitive",
      };
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          created_at: true,
        },
      }),

      prisma.supplier.count({
        where: filters,
      }),
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      page,
      limit,
      total,
      data: suppliers,
    });

  
};

export default getAllSuppliers;
