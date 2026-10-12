// Create an error with a status code
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Sends errors from async functions to the error handler
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// For unknown routes
const notFound = (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

// One place that handles all errors
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message;

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors)[0].message;
  } else if (err.name === "CastError") {
    status = 404;
    message = "Resource not found";
  } else if (err.code === 11000) {
    status = 400;
    message = "Email already registered";
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    status = 401;
    message = "Invalid or expired token";
  } else if (!err.statusCode) {
    console.error(err); // log the real error on the server only
    message = "Something went wrong on the server";
  }

  res.status(status).json({ success: false, message });
};

module.exports = { createError, asyncHandler, notFound, errorHandler };
