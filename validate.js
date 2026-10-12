const { createError } = require("./errorHandler");

// Checks that the required fields are in req.body
const requireFields = (fields) => (req, res, next) => {
  for (const field of fields) {
    if (!req.body[field]) {
      const name = field.charAt(0).toUpperCase() + field.slice(1);
      return next(createError(`${name} is required`, 400));
    }
  }
  next();
};

// Checks email format and password length
const checkEmailAndPassword = (req, res, next) => {
  if (!/^\S+@\S+\.\S+$/.test(req.body.email)) return next(createError("Email is not valid", 400));
  if (String(req.body.password).length < 6) {
    return next(createError("Password must be at least 6 characters", 400));
  }
  next();
};

module.exports = { requireFields, checkEmailAndPassword };
