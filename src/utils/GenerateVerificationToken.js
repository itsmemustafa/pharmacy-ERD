import crypto from "crypto";
import prisma from "../lib/prisma.js"; // Add this import

const GenerateVerificationToken = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const verificationExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  // Save to database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken: hashedToken,
      verificationExpires: verificationExpires,
    },
  });

  return token;
};

export default GenerateVerificationToken;
