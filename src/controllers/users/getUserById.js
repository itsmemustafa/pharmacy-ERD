import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import { CustomAPIError } from "../../errors/index.js";

const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      isActive: true,
      created_at: true,
    },
  });

  if (!user) {
    throw new CustomAPIError(
      "Can't find user with this id",
      StatusCodes.NOT_FOUND,
    );
  }

  res.status(StatusCodes.OK).json({ data: user });
};

export default getUserById;

