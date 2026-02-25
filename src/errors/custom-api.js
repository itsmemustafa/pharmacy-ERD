import { error } from "console";
import { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export default CustomAPIError;
