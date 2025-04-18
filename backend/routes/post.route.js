import express from "express"
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"
import { comment, createPost, deletePost, getPost, like } from "../controllers/post.controller.js"

const postRouter = express.Router()

postRouter.post("/create", isAuth, upload.single("image"), createPost)
postRouter.get("/getpost", isAuth, getPost)
postRouter.get("/like/:id", isAuth, like)
postRouter.post("/comment/:id", isAuth, comment)
postRouter.delete("/post/:postId", isAuth, deletePost)

export default postRouter;