import { StatusCodes } from "http-status-codes";
import { CustomAPIError, UnauthenticatedError } from "../../errors/index.js";
import prisma from "../../lib/prisma.js";
import crypto from "crypto";

const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new CustomAPIError("pleas provide refreshToken");
  }
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");
  const existingToken = await prisma.token.findFirst({
    where: { token: hashedToken },
  });
  if (existingToken) {
    await prisma.token.delete({
      where: { id: existingToken.id },
    });
  }

  // Clear both cookies
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(StatusCodes.OK).json({ msg: "User logged out successfully" });
};

export default logout;
