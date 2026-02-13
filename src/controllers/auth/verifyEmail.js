import crypto from "crypto";
import prisma from "../../lib/prisma.js";
import { CustomAPIError } from "../../errors/index.js";
import { StatusCodes } from "http-status-codes";

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    throw new CustomAPIError("Verification token is required");
  }

  // Hash the token to compare with database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with this token
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: hashedToken,
      verificationExpires: {
        gt: new Date(), // Token not expired
      },
    },
  });

  if (!user) {
    throw new CustomAPIError("Invalid or expired verification token");
  }

  // Update user as verified
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationExpires: null,
    },
  });

  res.status(StatusCodes.OK).json({
    message: "Email verified successfully. You can now login.",
  });
};

export default verifyEmail;