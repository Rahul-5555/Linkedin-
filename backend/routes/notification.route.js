import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { clearAllNotification, deleteNotification, getNotification } from "../controllers/notification.controller.js"

let notificationRouter = express.Router()

notificationRouter.get("/get", isAuth, getNotification)
notificationRouter.delete("/deleteone/:id", isAuth, isAuth, deleteNotification)
notificationRouter.delete("/", isAuth, isAuth, clearAllNotification)

export default notificationRouter