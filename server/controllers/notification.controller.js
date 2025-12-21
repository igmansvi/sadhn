import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ 
      recipient: userId,
      expiryDate: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name email")
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
      expiryDate: { $gt: new Date() },
    });

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch notifications",
      error: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.params.id) {
      await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    } else {
      await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true }
      );
    }

    res.json({ success: true, message: "marked as read" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to update notification",
      error: error.message,
    });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { recipientId, content, type } = req.body;
    const senderId = req.user.id;

    const newNotification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      content,
      type: type || "message",
    });

    await newNotification.populate("sender", "name email");

    if (req.io) {
      req.io.to(recipientId).emit("receive_notification", newNotification);
    }

    res.json({ success: true, data: newNotification });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to send notification",
      error: error.message,
    });
  }
};
