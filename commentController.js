const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { createError, asyncHandler } = require("../middleware/errorHandler");

// GET /api/posts/:postId/comments
exports.getComments = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw createError("Post not found", 404);

  const comments = await Comment.find({ post: post._id })
    .sort({ createdAt: -1 })
    .populate("author", "name");
  res.json({ success: true, message: "Comments fetched", data: comments });
});

// POST /api/posts/:postId/comments
exports.addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) throw createError("Post not found", 404);

  const comment = await Comment.create({ text: req.body.text, post: post._id, author: req.user._id });
  res.status(201).json({ success: true, message: "Comment added successfully", data: comment });
});

// DELETE /api/comments/:id  (only the author)
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw createError("Comment not found", 404);
  if (!comment.author.equals(req.user._id)) {
    throw createError("You can only delete your own comments", 403);
  }

  await comment.deleteOne();
  res.json({ success: true, message: "Comment deleted successfully", data: {} });
});
