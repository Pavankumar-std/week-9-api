const router = require("express").Router();
const { getPosts, getPost, createPost, updatePost, deletePost } = require("../controllers/postController");
const { protect } = require("../middleware/auth");
const { requireFields } = require("../middleware/validate");

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", protect, requireFields(["title", "content"]), createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
