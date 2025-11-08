const Notification = require('../models/Notification');

/**
 * Send notification to a user
 * @param {String} userId - MongoDB ID of the user
 * @param {String} message - Notification message
 */
const sendNotification = async (userId, message) => {
  try {
    const notification = await Notification.create({ user: userId, message });
    return notification;
  } catch (err) {
    console.error('Error sending notification:', err.message);
  }
};

module.exports = sendNotification;
