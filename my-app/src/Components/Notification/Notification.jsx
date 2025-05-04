import React, { useState, useEffect } from 'react';
import '../Notification/Notification.css';

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/service-history/get-full-service-notification');
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        
        const result = await response.json();
        setNotifications(Array.isArray(result.data) ? result.data : [result.data]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="alert-icon">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>Error loading notifications: {error}</span>
        </div>
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="empty-container">
        <div className="empty-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bell-icon">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span>No service notifications available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bell-icon">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <h2>Next Full Service Notifications</h2>
      </div>
      
      <div className="notifications-list">
        {notifications.map((notification, index) => {
          // Calculate hours remaining until next service
          const hoursRemaining = notification.nextFullServiceHrs - notification.lastServiceHrs;
          const isUrgent = true
          
          return (
            <div key={notification._id || index} className="notification-item">
              <div className="notification-content">
                <div className="notification-header">
                  <div className={`icon-container ${isUrgent ? 'urgent' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="clock-icon">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <p className="vehicle-subtitle">
                      Registration Number - Type
                    </p>
                    <h3 className="vehicle-title">
                    {notification.regNo} - {notification.mechine}
                    </h3>
                  </div>
                </div>
                
                <div className="notification-details">
                  <div className="detail-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="calendar-icon">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <div className="detail-text">
                      <span className="detail-label">Last Service: </span>
                      <span className="detail-value">{notification.lastServiceHrs} hrs</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="calendar-icon">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <div className="detail-text">
                      <span className="detail-label">Next Full Service in: </span>
                      <span className="detail-value">{notification.nextFullServiceHrs} hrs</span>
                    </div>
                  </div>
                  
                  <div className={`alert-item ${isUrgent ? 'urgent' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="alert-icon">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    {isUrgent ? (
                      <span className="alert-text">Urgent: Full Service required in {hoursRemaining} hours</span>
                    ) : (
                      <span className="alert-text">Due in {hoursRemaining} hours</span>
                    )}
                  </div>
                  
                  {/* Progress bar */}
                  <div className="progress-container">
                    <div 
                      className={`progress-bar ${isUrgent ? 'urgent' : ''}`}
                      style={{ width: `${Math.min(100, (notification.lastServiceHrs / notification.nextFullServiceHrs) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="notification-action">
                <button className="action-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="notifications-footer">
        <button className="view-all-button">
          View All Notifications
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Notification;