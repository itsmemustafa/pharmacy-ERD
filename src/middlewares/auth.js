import jwt from "jsonwebtoken";
import { CustomAPIError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import prisma from "../lib/prisma.js";
 const authenticate = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new CustomAPIError(
        "Authentication required. Please log in.",
        StatusCodes.UNAUTHORIZED
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        // Don't select password
      },
    });

    if (!user) {
      throw new CustomAPIError(
        "User not found. Please log in again.",
        StatusCodes.UNAUTHORIZED
      );
    }

    // Check if email is verified (optional - depends on your requirements)
    if (!user.isVerified) {
      throw new CustomAPIError(
        "Please verify your email before accessing this resource.",
        StatusCodes.FORBIDDEN
      );
    }

    // Attach user to request object
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new CustomAPIError("Invalid token", StatusCodes.UNAUTHORIZED);
    }
    if (error.name === "TokenExpiredError") {
      throw new CustomAPIError(
        "Token expired. Please log in again.",
        StatusCodes.UNAUTHORIZED
      );
    }
    throw error;
  }
};

export default authenticate;