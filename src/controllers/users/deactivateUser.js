import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import { CustomAPIError } from "../../errors/index.js";

const deactivateUser = async (req, res) => {
  const { id } = req.params;
  const targetUserId = Number(id);

  if (Number.isNaN(targetUserId)) {
    throw new CustomAPIError("Invalid user id", StatusCodes.BAD_REQUEST);
  }

  if (req.user.id === targetUserId) {
    throw new CustomAPIError(
      "You cannot deactivate your own account.",
      StatusCodes.BAD_REQUEST,
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!existingUser) {
    throw new CustomAPIError(
      "Can't find user with this id",
      StatusCodes.NOT_FOUND,
    );
  }

  await prisma.user.update({
    where: { id: targetUserId },
    data: { isActive: false },
  });

  await prisma.token.deleteMany({
    where: { userId: targetUserId },
  });

  res.status(StatusCodes.OK).json({
    message: "User deactivated successfully",
  });
};

export default deactivateUser;

