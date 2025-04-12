import uploadOnCloudinary from "../config/cloudinary.js"
import { io } from "../index.js";
import Post from "../models/post.model.js"

export const createPost = async (req, res) => {
  try {
    let { description } = req.body
    let newPost;
    if (req.file) {
      let image = await uploadOnCloudinary(req.file.path)
      newPost = await Post.create({
        author: req.userId,
        description,
        image
      })
    } else {
      newPost = await Post.create({
        author: req.userId,
        description,
      })
    }
    return res.status(201).json(newPost)
  } catch (error) {
    return res.status(400).json(`create post error ${error}`)
  }
}


// controller for post control
export const getPost = async (req, res) => {
  try {
    const post = await Post.find().populate("author", "firstName lastName profileImage headline")
      .populate("comments.user", "firstName lastName profileImage headline")
      .sort({ createdAt: -1 })
    return res.status(200).json(post)
  } catch (error) {
    return res.status(500).json({
      message: "Getpost error"
    })
  }
}

export const like = async (req, res) => {
  try {
    let postId = req.params.id
    let userId = req.userId
    let post = await Post.findById(postId)
    if (!post) {
      return res.status(400).json({
        message: "post not found"
      })
    }
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id != userId)
    } else {
      post.likes.push(userId)
    }
    await post.save()
    // real time like update
    io.emit("likeUpdated",{postId,likes:post.likes})

    res.status(200).json(post)
  } catch (error) {
    return res.status(500).json({
      message: `like error ${error}`
    })
  }
}


export const comment = async (req, res) => {
  try {
    let postId = req.params.id
    let userId = req.userId
    let { content } = req.body

    let post = await Post.findByIdAndUpdate(postId, {
      $push: { comments: { content, user: userId } }
    }, { new: true })
      .populate("comments.user", "firstName lastName profileImage headline")
    // real time like update
    io.emit("commentAdded", { postId, comm: post.comments })

    return res.status(200).json(post)
  } catch (error) {
    return res.status(500).json({ message: `comment error ${error}` })
  }
}