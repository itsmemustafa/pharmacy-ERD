import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";

const getAllUsers = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const filters = {};

  if (req.query.role) {
    filters.role = req.query.role;
  }

  if (req.query.email) {
    filters.email = {
      contains: req.query.email,
      mode: "insensitive",
    };
  }

  if (req.query.name) {
    filters.name = {
      contains: req.query.name,
      mode: "insensitive",
    };
  }

  if (typeof req.query.isActive === "boolean") {
    filters.isActive = req.query.isActive;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
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
        role: true,
        isVerified: true,
        isActive: true,
        created_at: true,
      },
    }),

    prisma.user.count({
      where: filters,
    }),
  ]);

  res.status(StatusCodes.OK).json({
    success: true,
    page,
    limit,
    total,
    data: users,
  });
};

export default getAllUsers;

