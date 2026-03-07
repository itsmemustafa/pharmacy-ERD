import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
    errors: err.errors || [],
  };

  // Handle known Prisma errors (unique constraint, not found, etc.)
  if (err.code === "P2002" && err.meta?.target) {
    customError.msg = `Duplicate value for ${err.meta.target.join(
      ", ",
    )}. Please use another value.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code === "P2025") {
    customError.msg = "Requested resource not found";
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  // Only include errors array when it actually has validation messages
  const response = { msg: customError.msg };
  if (customError.errors?.length > 0) {
    response.errors = customError.errors;
  }

  return res.status(customError.statusCode).json(response);
};

export default errorHandlerMiddleware;
