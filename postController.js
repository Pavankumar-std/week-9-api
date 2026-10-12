const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { createError, asyncHandler } = require("../middleware/errorHandler");

// GET /api/posts?page=1&limit=10
exports.getPosts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "name");
  const total = await Post.countDocuments();

  res.json({ success: true, message: "Posts fetched", page, limit, total, data: posts });
});

// GET /api/posts/:id
exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name");
  if (!post) throw createError("Post not found", 404);

  res.json({ success: true, message: "Post fetched", data: post });
});

// POST /api/posts
exports.createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.create({ title, content, author: req.user._id });

  res.status(201).json({ success: true, message: "Post created successfully", data: post });
});

// PUT /api/posts/:id  (only the author)
exports.updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw createError("Post not found", 404);
  if (!post.author.equals(req.user._id)) throw createError("You can only edit your own posts", 403);

  if (req.body.title) post.title = req.body.title;
  if (req.body.content) post.content = req.body.content;
  await post.save();

  res.json({ success: true, message: "Post updated successfully", data: post });
});

// DELETE /api/posts/:id  (only the author)
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw createError("Post not found", 404);
  if (!post.author.equals(req.user._id)) throw createError("You can only delete your own posts", 403);

  await Comment.deleteMany({ post: post._id }); // remove its comments too
  await post.deleteOne();

  res.json({ success: true, message: "Post deleted successfully", data: {} });
});
