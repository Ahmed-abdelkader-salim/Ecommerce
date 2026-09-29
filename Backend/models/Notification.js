import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    message: { type: String, required: true },
    user:{type:String, default:""},
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }
)

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification