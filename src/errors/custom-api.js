import { error } from "console";
import { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default CustomAPIError;
