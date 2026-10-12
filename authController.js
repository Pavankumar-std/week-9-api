const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createError, asyncHandler } = require("../middleware/errorHandler");

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    data: { token: makeToken(user._id), user: { id: user._id, name: user.name, email: user.email } },
  });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw createError("Invalid email or password", 401);
  }

  res.json({
    success: true,
    message: "Login successful",
    data: { token: makeToken(user._id), user: { id: user._id, name: user.name, email: user.email } },
  });
});

// GET /api/auth/me
exports.getMe = (req, res) => {
  res.json({ success: true, message: "Current user", data: req.user });
};
