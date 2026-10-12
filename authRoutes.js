const router = require("express").Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { requireFields, checkEmailAndPassword } = require("../middleware/validate");

router.post("/register", requireFields(["name", "email", "password"]), checkEmailAndPassword, register);
router.post("/login", requireFields(["email", "password"]), login);
router.get("/me", protect, getMe);

module.exports = router;
