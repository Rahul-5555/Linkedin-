import uploadOnCloudinary from "../config/cloudinary.js";
import { io } from "../index.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

// notification helper
const sendNotification = async ({ receiver, type, relatedUser, relatedPost }) => {
  await Notification.create({ receiver, type, relatedUser, relatedPost });
};

// Create post
export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    let newPost;

    if (req.file) {
      const image = await uploadOnCloudinary(req.file.path);
      newPost = await Post.create({
        author: req.userId,
        description,
        image,
      });
    } else {
      newPost = await Post.create({
        author: req.userId,
        description,
      });
    }

    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(400).json({ message: `Create post error: ${error.message}` });
  }
};

// Get all posts
export const getPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "firstName lastName profileImage headline userName")
      .populate("comments.user", "firstName lastName profileImage headline")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: `Get posts error: ${error.message}` });
  }
};

// Like post
export const like = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found." });
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id != userId);
    } else {
      post.likes.push(userId);

      if (post.author.toString() !== userId) {
        await sendNotification({
          receiver: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });
      }
    }

    await post.save();
    io.emit("likeUpdated", { postId, likes: post.likes });

    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: `Like error: ${error.message}` });
  }
};

// Comment on post
export const comment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const { content } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { content, user: userId } } },
      { new: true }
    ).populate("comments.user", "firstName lastName profileImage headline");

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.author.toString() !== userId) {
      await sendNotification({
        receiver: post.author,
        type: "comment",
        relatedUser: userId,
        relatedPost: postId,
      });
    }

    io.emit("commentAdded", { postId, comm: post.comments });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: `Comment error: ${error.message}` });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not authorized to delete this post." });
    }

    await Post.findByIdAndDelete(postId);
    io.emit("postDeleted", { postId });

    return res.status(200).json({ message: "Post deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Delete post error: ${error.message}` });
  }
};
