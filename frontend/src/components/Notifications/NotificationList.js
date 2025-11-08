import React, { useEffect, useState, useContext } from 'react';
import { getNotifications, markAsRead } from '../../api/notificationApi';
import { AuthContext } from '../../context/AuthContext';

export default function NotificationList() {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await getNotifications();
      setNotifications(data);
    };
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Notifications</h1>
          <p className="dashboard-subtitle">Stay updated with your job applications</p>
        </div>
        
        {notifications.length === 0 ? (
          <div className="text-center">
            <div className="card">
              <div className="card-body">
                <h3 className="mb-2">No Notifications</h3>
                <p className="text-secondary">You're all caught up! New notifications will appear here.</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {notifications.map(n => (
              <div key={n._id} className={`notification-item ${!n.isRead ? 'unread' : ''}`}>
                <div className="notification-message">{n.message}</div>
                <div className="flex justify-between items-center">
                  <div className="notification-time">
                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString()}
                  </div>
                  {!n.isRead && (
                    <button 
                      onClick={() => handleMarkRead(n._id)} 
                      className="btn btn-sm btn-secondary"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
