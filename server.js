require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./src/middleware/logger");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/posts", require("./src/routes/postRoutes"));
app.use("/api", require("./src/routes/commentRoutes"));

// Error handling (always last)
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB, then start the server
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err.message);
    process.exit(1);
  });
