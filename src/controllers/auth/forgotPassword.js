import prisma from "../../lib/prisma.js";
import GenerateResetToken from "../../utils/GenerateResetToken.js";
import sendResetPasswordEmail from "../../utils/sendResetEmail.js";
import { StatusCodes } from "http-status-codes";

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  // (learned) don't reveal if email exists or not
  if (!user) {
    return res.status(StatusCodes.OK).json({ message: "If this email exists, a reset link has been sent" });
  }

  const resetToken = await GenerateResetToken(user);
  await sendResetPasswordEmail(user.email, resetToken, user.name);

  res.status(StatusCodes.OK).json({ message: "If this email exists, a reset link has been sent" });
};

export default forgotPassword;