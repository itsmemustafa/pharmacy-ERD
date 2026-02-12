import prisma from "../../lib/prisma.js";
import {CustomAPIError, UnauthenticatedError} from "../../errors/index.js";
import bcrypt from "bcryptjs";
import token from "../../utils/jwt-sign.js";
import generateRefreshToken from "../../utils/refresh-token.js";
import { StatusCodes } from "http-status-codes";

const login = async(req, res) => {
  const {email, password} = req.body;

  if(!email || !password) {
    throw new CustomAPIError("Please provide email and password");
  }

  const user = await prisma.user.findUnique({where:{email}});
  if(!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if(!isPasswordValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const accessToken = token(user.name, email);
  const { refreshToken, hashedToken, refreshTokenExpiry } = generateRefreshToken();

  // Update or create refresh token
  await prisma.token.upsert({
    where: { userId: user.id },
    update: {
      token: hashedToken,
      expiresAt: new Date(refreshTokenExpiry),
    },
    create: {
      token: hashedToken,
      userId: user.id,
      expiresAt: new Date(refreshTokenExpiry),
    },
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json({
    user: {name: user.name, role: user.role,refreshToken}
  });
}

export default login;