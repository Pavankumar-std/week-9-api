const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createError, asyncHandler } = require("./errorHandler");

// Protects routes: user must send "Authorization: Bearer <token>"
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw createError("Authentication required", 401);
  }

  const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw createError("User no longer exists", 401);

  req.user = user;
  next();
});

module.exports = { protect };
