import React, { useState, useEffect } from 'react';
import '../Notification/Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Get current date in DD-MM-YY format and time in AM/PM format
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format date as DD-MM-YY
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = String(now.getFullYear()).slice(-2);
      const dateString = `${day}-${month}-${year}`;
      
      // Format time in AM/PM
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      const timeString = `${hours}:${minutes} ${ampm}`;
      
      setCurrentDateTime(`${dateString}   |   ${timeString}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications data
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // In a real implementation, uncomment the following:
        // const response = await fetch('http://localhost:3001/service-history/get-full-service-notification');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch notifications');
        // }
        // const result = await response.json();
        // setNotifications(Array.isArray(result.data) ? result.data : [result.data]);

        // For now, use sample data
        setTimeout(() => {
          setNotifications([
            {
              "_id": "1",
              "regNo": "78862",
              "mechine": "80 Ton Mobile Crane",
              "brand": "ZOOMLION",
              "lastServiceHrs": 950,
              "nextFullServiceHrs": 1000,
              "urgency": "urgent"
            },
            {
              "_id": "2",
              "regNo": "78863",
              "mechine": "80 Ton Mobile Crane",
              "brand": "ZOOMLION",
              "lastServiceHrs": 890,
              "nextFullServiceHrs": 1000,
              "urgency": "medium"
            },
            {
              "_id": "3",
              "regNo": "281998",
              "mechine": "Dumptruck",
              "brand": "SINOTRUK",
              "lastServiceHrs": 850,
              "nextFullServiceHrs": 1000,
              "urgency": "normal"
            },
            {
              "_id": "4",
              "regNo": "72870",
              "mechine": "3 Ton Forklift",
              "brand": "LONKING",
              "lastServiceHrs": 980,
              "nextFullServiceHrs": 1000,
              "urgency": "urgent"
            },
            {
              "_id": "5",
              "regNo": "43097",
              "mechine": "3 Ton Forklift",
              "brand": "HELI",
              "lastServiceHrs": 970,
              "nextFullServiceHrs": 1000,
              "urgency": "urgent"
            },
            {
              "_id": "6",
              "regNo": "70579",
              "mechine": "3 Ton Forklift",
              "brand": "HELI",
              "lastServiceHrs": 920,
              "nextFullServiceHrs": 1000,
              "urgency": "medium"
            },
          ]);
          setLoading(false);
        }, 500); // Simulate network delay
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, []);

  // Count notifications by urgency
  const urgencyCounts = {
    all: notifications.length,
    urgent: notifications.filter(item => item.urgency === 'urgent').length,
    medium: notifications.filter(item => item.urgency === 'medium').length,
    normal: notifications.filter(item => item.urgency === 'normal').length
  };

  // Filter notifications based on selected filter
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(item => item.urgency === filter);

  // Show notification details
  const showDetails = (notification) => {
    setSelectedNotification(notification);
  };

  // Mark notification as seen or take an action
  const handleNotificationAction = (notificationId, action) => {
    try {
      // In a real implementation, uncomment the following:
      // const response = await fetch('http://localhost:3001/service-history/update-notification', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ id: notificationId, action: action }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      
      // For now, just show an alert
      alert(`Notification ID ${notificationId} marked as ${action}`);
      setSelectedNotification(null); // Close details panel after action
    } catch (err) {
      console.error('Error updating notification:', err);
      alert('Failed to update notification');
    }
  };

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h1 className='notification-title'>Service Notifications</h1>
        <div className="date-time">{currentDateTime}</div>
      </div>
      
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
          onClick={() => setFilter('all')}
        >
          All ({urgencyCounts.all})
        </button>
        <button 
          className={`filter-btn urgent ${filter === 'urgent' ? 'active' : ''}`} 
          onClick={() => setFilter('urgent')}
        >
          Urgent ({urgencyCounts.urgent})
        </button>
        <button 
          className={`filter-btn medium ${filter === 'medium' ? 'active' : ''}`} 
          onClick={() => setFilter('medium')}
        >
          Medium ({urgencyCounts.medium})
        </button>
        <button 
          className={`filter-btn normal ${filter === 'normal' ? 'active' : ''}`} 
          onClick={() => setFilter('normal')}
        >
          Normal ({urgencyCounts.normal})
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading service notifications...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="notification-table-container">
          <table className="notification-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Machine</th>
                <th>Brand</th>
                <th>Reg No</th>
                <th>Last Service</th>
                <th>Next Service</th>
                <th>Hours Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((item) => {
                // Calculate hours remaining until next service
                const hoursRemaining = item.nextFullServiceHrs - item.lastServiceHrs;
                
                return (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.mechine}</td>
                    <td>{item.brand}</td>
                    <td>{item.regNo}</td>
                    <td>{item.lastServiceHrs} hrs</td>
                    <td>{item.nextFullServiceHrs} hrs</td>
                    <td>{hoursRemaining} hrs</td>
                    <td>
                      <span className={`status-badge ${item.urgency}`}>
                        {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="action-btn details" 
                        onClick={() => showDetails(item)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedNotification && (
        <div className="notification-details">
          <div className="details-header">
            <h2>Service Notification Details</h2>
            <button className="close-btn" onClick={() => setSelectedNotification(null)}>×</button>
          </div>
          <div className="details-content">
            <div className="detail-item">
              <span className="label">Machine:</span>
              <span className="value">{selectedNotification.mechine}</span>
            </div>
            <div className="detail-item">
              <span className="label">Brand:</span>
              <span className="value">{selectedNotification.brand}</span>
            </div>
            <div className="detail-item">
              <span className="label">Registration Number:</span>
              <span className="value">{selectedNotification.regNo}</span>
            </div>
            <div className="detail-item">
              <span className="label">Last Service:</span>
              <span className="value">{selectedNotification.lastServiceHrs} hrs</span>
            </div>
            <div className="detail-item">
              <span className="label">Next Full Service:</span>
              <span className="value">{selectedNotification.nextFullServiceHrs} hrs</span>
            </div>
            <div className="detail-item">
              <span className="label">Hours Remaining:</span>
              <span className="value">{selectedNotification.nextFullServiceHrs - selectedNotification.lastServiceHrs} hrs</span>
            </div>
            <div className="detail-item">
              <span className="label">Urgency Level:</span>
              <span className={`value status-badge ${selectedNotification.urgency}`}>
                {selectedNotification.urgency.charAt(0).toUpperCase() + selectedNotification.urgency.slice(1)}
              </span>
            </div>
            
            {/* Progress bar for service completion */}
            <div className="service-progress">
              <h3>Service Progress</h3>
              <div className="progress-container">
                <div 
                  className={`progress-bar ${selectedNotification.urgency}`}
                  style={{ width: `${Math.min(100, (selectedNotification.lastServiceHrs / selectedNotification.nextFullServiceHrs) * 100)}%` }}
                >
                  <span className="progress-text">{Math.round((selectedNotification.lastServiceHrs / selectedNotification.nextFullServiceHrs) * 100)}%</span>
                </div>
              </div>
              <div className="progress-labels">
                <span>0 hrs</span>
                <span>{selectedNotification.nextFullServiceHrs} hrs</span>
              </div>
            </div>
            
            <div className="notification-actions">
              <h3>Actions</h3>
              <div className="action-btn-group">
                <button 
                  className="action-btn seen" 
                  onClick={() => handleNotificationAction(selectedNotification._id, 'seen')}
                >
                  Mark as Seen
                </button>
                <button 
                  className="action-btn schedule" 
                  onClick={() => handleNotificationAction(selectedNotification._id, 'schedule')}
                >
                  Schedule Service
                </button>
                <button 
                  className="action-btn complete" 
                  onClick={() => handleNotificationAction(selectedNotification._id, 'complete')}
                >
                  Mark Service Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;