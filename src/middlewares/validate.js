import { CustomAPIError } from "../errors/index.js";

const handleValidationError = (result, next) => {
  const errors = result.error.issues.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));
  return next(new CustomAPIError("Validation error", 400, errors));
};

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) return handleValidationError(result, next);
  req.body = result.data;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  if (!result.success) return handleValidationError(result, next);
  req.query = result.data;
  next();
};

export default validateBody;
