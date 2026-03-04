import { StatusCodes } from "http-status-codes";
import prisma from "../../lib/prisma.js";
import { CustomAPIError } from "../../errors/index.js";

const updateUser = async (req, res) => {
  const { id } = req.params;
  const targetUserId = Number(id);

  if (Number.isNaN(targetUserId)) {
    throw new CustomAPIError("Invalid user id", StatusCodes.BAD_REQUEST);
  }

  // Prevent admins from locking themselves out :)
  if (
    req.user.id === targetUserId &&
    (req.body.role && req.body.role !== req.user.role ||
      req.body.isActive === false)
  ) {
    throw new CustomAPIError(
      "You cannot change your own role or deactivate your own account.",
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

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: req.body,
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

  res.status(StatusCodes.OK).json({
    message: "User updated successfully",
    data: updatedUser,
  });
};

export default updateUser;

