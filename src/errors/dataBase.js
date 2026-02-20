import { extname } from "path";
import CustomAPIError from "./custom-api";
import { StatusCodes } from "http-status-codes";

class DatabaseError extends CustomAPIError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
