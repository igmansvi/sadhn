import Notification from "../models/notification.model.js";
import News from "../models/news.model.js";
import Contact from "../models/contact.model.js";

export const cleanupExpiredData = async () => {
  try {
    const now = new Date();

    const notificationsDeleted = await Notification.deleteMany({
      expiryDate: { $lt: now },
    });

    const newsUpdated = await News.updateMany(
      { expiryDate: { $lt: now }, isActive: true },
      { isActive: false }
    );

    const contactsArchived = await Contact.updateMany(
      { expiryDate: { $lt: now }, status: { $ne: "archived" } },
      { status: "archived" }
    );

    console.log(
      `Cleanup completed - Notifications deleted: ${notificationsDeleted.deletedCount}, News deactivated: ${newsUpdated.modifiedCount}, Contacts archived: ${contactsArchived.modifiedCount}`
    );
  } catch (error) {
    console.error("Cleanup error:", error);
  }
};

export const startCleanupScheduler = () => {
  cleanupExpiredData();

  setInterval(cleanupExpiredData, 24 * 60 * 60 * 1000);

  console.log("Cleanup scheduler started");
};
