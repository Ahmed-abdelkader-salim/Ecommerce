import Notification from "../models/Notification.js";



export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNotification = await Notification.findByIdAndDelete(id);
        if (!deletedNotification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.status(200).json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Delete Notification Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const clearNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.status(200).json({ success: true, message: 'All notifications cleared successfully' });
    } catch (error) {
        console.error('Clear Notifications Error:', error);
        res.status(500).json({ success: false, message: error.message });
    } 
}

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNotification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!updatedNotification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }       
        res.status(200).json({ success: true, message: 'Notification marked as read successfully', data: updatedNotification });
    }       
    catch (error) {
        console.error('Mark As Read Error:', error);
        res.status(500).json({ success: false, message: error.message });
    } 
}


export const createNotification = async (orderData) => {
    try {
        const { _id,userId } = orderData;
        await Notification.create({
            orderId: _id,
            message: `تم إنشاء طلب جديد برقم ${_id}`,   
        user: userId ||"UNKNOWN",
        });
    }catch (error) {
        console.error('Create Notification Error:', error);
    }
}