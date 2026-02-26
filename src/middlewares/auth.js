import jwt from "jsonwebtoken";
import { CustomAPIError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import prisma from "../lib/prisma.js";

const authenticate = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.accessToken ||
      (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
      return next(
        new CustomAPIError(
          "Authentication required. Please log in.",
          StatusCodes.UNAUTHORIZED,
        ),
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(
          new CustomAPIError(
            "Token expired. Please log in again.",
            StatusCodes.UNAUTHORIZED,
          ),
        );
      }
      return next(
        new CustomAPIError("Invalid token.", StatusCodes.UNAUTHORIZED),
      );
    }

    // Guard against malformed payload
    if (!decoded?.id) {
      return next(
        new CustomAPIError("Invalid token payload.", StatusCodes.UNAUTHORIZED),
      );
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
      },
    });

    if (!user) {
      return next(
        new CustomAPIError(
          "User not found. Please log in again.",
          StatusCodes.UNAUTHORIZED,
        ),
      );
    }

    if (!user.isVerified) {
      return next(
        new CustomAPIError(
          "Please verify your email before accessing this resource.",
          StatusCodes.FORBIDDEN,
        ),
      );
    }

    // Attach user to request and proceed
    req.user = user;
    next();
  } catch (error) {
    // Catch unexpected errors (e.g. Prisma failures) and forward to error middleware
    next(error);
  }
};

export default authenticate;
