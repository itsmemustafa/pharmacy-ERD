import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma.js";
import { CustomAPIError } from "../../errors/index.js";
import signJwt from "../../utils/jwt-sign.js";
import generateRefreshToken from "../../utils/refresh-token.js";
import { StatusCodes } from "http-status-codes";

const signUp = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new CustomAPIError("Missing required info");
    }

    console.log("Attempting to find user with email:", email);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    console.log("Existing user result:", existingUser);

    if (existingUser) {
      throw new CustomAPIError("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const accessToken = signJwt(user.id, user.name, user.email, user.role);
    const { refreshToken, hashedToken, refreshTokenExpiry } =
      generateRefreshToken();

    await prisma.token.create({
      data: {
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

    res.status(StatusCodes.CREATED).json({ message: "User created" });
  
};

export default signUp;
