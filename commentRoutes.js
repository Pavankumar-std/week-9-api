const router = require("express").Router();
const { getComments, addComment, deleteComment } = require("../controllers/commentController");
const { protect } = require("../middleware/auth");
const { requireFields } = require("../middleware/validate");

router.get("/posts/:postId/comments", getComments);
router.post("/posts/:postId/comments", protect, requireFields(["text"]), addComment);
router.delete("/comments/:id", protect, deleteComment);

module.exports = router;
