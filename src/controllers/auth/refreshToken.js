import crypto from "crypto";
import prisma from "../../lib/prisma.js";
import { CustomAPIError } from "../../errors/index.js";
import signJwt from "../../utils/jwt-sign.js";
import generateRefreshToken from "../../utils/refresh-token.js";
import { StatusCodes } from "http-status-codes";

const validateRefreshToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new CustomAPIError("Invalid credentials");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const existingToken = await prisma.token.findFirst({
    where: { token: hashedToken },
  });

  if (!existingToken) {
    throw new CustomAPIError("Invalid credentials");
  }

  // Fix date comparison
  if (existingToken.expiresAt < new Date()) {
    throw new CustomAPIError("Expired Token");
  }

  // Fix findUnique syntax
  const user = await prisma.user.findUnique({
    where: { id: existingToken.userId }
  });

  if (!user) {
    throw new CustomAPIError("User not found");
  }

  const accessToken = signJwt(user.id, user.name, user.email, user.role);
  
  // Fix destructuring to match actual return values
  const { 
    refreshToken: newRefreshToken, 
    hashedToken: newHashedToken, 
    refreshTokenExpiry 
  } = generateRefreshToken();

  // Fix update syntax - use prisma.token.update
  await prisma.token.update({
    where: { id: existingToken.id },
    data: {
      token: newHashedToken,
      expiresAt: new Date(refreshTokenExpiry),
    },
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json({ message: "Tokens updated successfully" });
};

export default validateRefreshToken;