export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  console.error(err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

export class AppError extends Error {
  statusCode;
  isOperational;
  status;
  constructor(message, statusCode = 400, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = statusCode < 500 ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}
export class NotFoundError extends AppError {
  constructor(message, statusCode = 404, isOperational = true) {
    super(message, statusCode, isOperational);
  }
}
export class ConflictError extends AppError {
  constructor(message, statusCode = 409, isOperational = true) {
    super(message, statusCode, isOperational);
  }
}
export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400, true);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, true);
  }
}
