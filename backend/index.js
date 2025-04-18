import express from 'express'
import dotenv from 'dotenv'
import connectDb from './config/db.js'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import connectionRouter from './routes/connection.route.js'
import http from 'http'
import { Server } from 'socket.io'
import notificationRouter from './routes/notification.route.js'
dotenv.config()

let app = express()
let server = http.createServer(app)
export const io = new Server(server, {
  cors: ({
    origin: "https://linkedin-frontend-2lrq.onrender.com",
    credentials: true
  })
})

app.use(express.json())
let port = process.env.PORT || 5000
app.use(cookieParser())
app.use(cors({
  origin: "https://linkedin-frontend-2lrq.onrender.com",
  credentials: true
}))

// https://linkedin-frontend-2lrq.onrender.com
// middlewares  
// http://localhost:8000/api/auth
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/connection", connectionRouter)
app.use("/api/notification", notificationRouter)
// for user connection/request
export const userSocketMap = new Map()

// app.get("/", (req, res) => {
//   res.send("Hello")
// })

io.on("connection", (socket) => {
  console.log("user connected", socket.id)
  // for user connection/request
  socket.on("register", (userId) => {
    userSocketMap.set(userId, socket.id)
    console.log(userSocketMap)
  })

  socket.on("disconnect", (socket) => {
    // console.log("user disconnected", socket.id)
  })
})

server.listen(port, () => {
  connectDb()
  console.log("Server started.")
})

