import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../../errors/index.js";
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    throw new CustomAPIError("Token and password are required");
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });
  if (!user) {
    throw new CustomAPIError("Invalid or expired reset password token");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });
  res.status(StatusCodes.OK).json({ message: "Password reset successfully" });
};
export default resetPassword;
