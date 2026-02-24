import crypto from "crypto";
import prisma from "../lib/prisma.js";
const GenerateResetToken = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  // Save to database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: resetPasswordExpires,
    },
  });
  return token;
};

export default GenerateResetToken;
