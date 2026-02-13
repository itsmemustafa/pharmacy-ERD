import { CustomAPIError, UnauthenticatedError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
   
    if (!req.user) {
      throw new UnauthenticatedError();
    }

    // Check if user has one of the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      throw new CustomAPIError(
        `Access denied. Required role: ${allowedRoles.join(" or ")}`,
        StatusCodes.FORBIDDEN
      );
    }

 
    next();
  };
};

export default authorizeRoles;