import {getNotifications, markAsRead, clearNotifications, deleteNotification} from "../controllers/notificationController.js";
import express from "express";

const notificationRouter = express.Router();


notificationRouter.get("/list", getNotifications);
notificationRouter.delete("/clear", clearNotifications);
notificationRouter.delete("/delete/:id", deleteNotification);
notificationRouter.put("/read/:id", markAsRead);

export default notificationRouter;


