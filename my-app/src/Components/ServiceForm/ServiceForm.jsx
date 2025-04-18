'use client';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './ServiceForm.css';
import equipments from '../../equipments';
import { ServiceReportContext } from '../../App';

const ServiceForm = ({ initialData = {} }) => {
  const navigate = useNavigate();
  const { setServiceReportData } = useContext(ServiceReportContext);
  
  // Form data state
  const [formData, setFormData] = useState({
    serviceHrs: initialData.serviceHrs || '',
    equipmentNo: initialData.equipmentNo || '',
    nextServiceHrs: initialData.nextServiceHrs || '',
    machine: initialData.machine || '',
    mechanics: initialData.mechanics || '',
    location: initialData.location || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    operatorName: initialData.operatorName || '',
    remarks: initialData.remarks || '',
  });

  // Create checklist items array with their status
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, description: 'Change Engine oil & Filter', status: '✓' },
    { id: 2, description: 'Change Fuel Filter', status: '✓' },
    { id: 3, description: 'Clean/Change Air Filter', status: '✓' },
    { id: 4, description: 'Check Transmission Filter', status: '✓' },
    { id: 5, description: 'Check Power Steering Oil', status: '✓' },
    { id: 6, description: 'Check Hydraulic Oil', status: '✓' },
    { id: 7, description: 'Check Brake', status: '✓' },
    { id: 8, description: 'Check Tyre Air Pressure', status: '✓' },
    { id: 9, description: 'Check Oil Leak', status: '✓' },
    { id: 10, description: 'Check Battery Condition', status: '✓' },
    { id: 11, description: 'Check Wiper & Water', status: '✓' },
    { id: 12, description: 'Check All Lights', status: '✓' },
    { id: 13, description: 'Check All Horns', status: '✓' },
    { id: 14, description: 'Check Parking Brake', status: '✓' },
    { id: 15, description: 'Check Differential Oil', status: '✓' },
    { id: 16, description: 'Check Rod Water & Hoses', status: '✓' },
    { id: 17, description: 'Lubricants All Points', status: '✓' },
    { id: 18, description: 'Check Gear Shift System', status: '✓' },
    { id: 19, description: 'Check Clutch System', status: '✓' },
    { id: 20, description: 'Check Wheel Nut', status: '✓' },
    { id: 21, description: 'Check Starter & Alternator', status: '✓' },
    { id: 22, description: 'Check Number Plate both', status: '✓' },
    { id: 23, description: 'Check Paint', status: '✓' },
    { id: 24, description: 'Check Tires', status: '✓' },
    { id: 25, description: 'Check Silencer', status: '' },
    { id: 26, description: 'Replace Hydraulic Oil- Filter', status: '' },
    { id: 27, description: 'Replace Transmission Oil', status: '' },
    { id: 28, description: 'Replace Differential Oil', status: '' },
    { id: 29, description: 'Replace Steering Box Oil', status: '' },
    { id: 30, description: 'Check Engine Valve Clearence', status: '' },
    { id: 31, description: 'Replace clutch fluid', status: '' },
    { id: 32, description: 'Check Brake Lining', status: '' },
    { id: 33, description: 'Change Drive Belt', status: '' },
  ]);

  // Service history items with their status
  const [serviceHistoryItems, setServiceHistoryItems] = useState([
    { id: 1, description: 'Oil', status: '' },
    { id: 2, description: 'Oil Filter', status: '' },
    { id: 3, description: 'Fuel Filter', status: '' },
    { id: 4, description: 'Water Seperator', status: '' },
    { id: 5, description: 'Air Filter', status: '' },
  ]);

  // Log formData whenever it changes
  useEffect(() => {
    console.log('Form Data Updated:', formData);
  }, [formData]);
  
  // Log checklistItems whenever they change
  useEffect(() => {
    console.log('Checklist Items Updated:', checklistItems);
  }, [checklistItems]);

  // Log serviceHistoryItems whenever they change
  useEffect(() => {
    console.log('Service History Items Updated:', serviceHistoryItems);
  }, [serviceHistoryItems]);

  // Auto-fill fields when equipment number changes
  useEffect(() => {
    if (formData.equipmentNo) {
      const equipmentNo = formData.equipmentNo.trim();
      
      // Find the equipment with matching regNo
      const foundEquipment = equipments.find(
        (equipment) => equipment.regNo === equipmentNo
      );
      
      if (foundEquipment) {
        // Update machine and operator name (certificationBody)
        setFormData({
          ...formData,
          machine: foundEquipment.machine || '',
          operatorName: foundEquipment.certificationBody || '',
        });
        
        // Log the found equipment
        console.log('Equipment Found:', foundEquipment);
      } else {
        console.log('No matching equipment found for:', equipmentNo);
      }
    }
  }, [formData.equipmentNo]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle status change for individual checklist item
  const handleStatusChange = (id, status) => {
    setChecklistItems(
      checklistItems.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
  };

  // Handle status change for individual service history item
  const handleServiceHistoryStatusChange = (id, status) => {
    setServiceHistoryItems(
      serviceHistoryItems.map(item => 
        item.id === id ? { ...item, status } : item
      )
    );
  };

  // Handle "Check All" functions for specific range
  const checkAllInRange = (startId, endId, status) => {
    setChecklistItems(
      checklistItems.map(item => 
        (item.id >= startId && item.id <= endId) ? { ...item, status } : item
      )
    );
  };

  // Handle "Check All" for service history items
  const checkAllServiceHistory = (status) => {
    setServiceHistoryItems(
      serviceHistoryItems.map(item => ({ ...item, status }))
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create complete data object
    const completeData = { 
      ...formData, 
      checklistItems,
      serviceHistoryItems 
    };
    
    // Log the complete data being submitted
    console.log('Form Submitted with Data:', completeData);
    
    // Update the context with the service report data
    setServiceReportData(completeData);
    
    // Navigate to the ServiceDoc page
    navigate('/service-doc');
  };

  // Format text function
  const formatText = (text) => {
    return text
      .toLowerCase()
      .replace(/(^\w|\.\s*\w|\bi\b)/g, (match) => match.toUpperCase());
  };

  return (
    <div className="service-form-container">
      <h2>Service Report Form</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <div className="form-logo">
            <span>AI Ansari Transport & Enterprises W.L.L</span>
          </div>
          <h3>PERIODIC SERVICE REPORT</h3>
        </div>

        <div className="form-section">
          <h4>Service Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="serviceHrs">Service Hours</label>
              <input
                type="text"
                id="serviceHrs"
                name="serviceHrs"
                value={formData.serviceHrs}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="equipmentNo">Equipment No</label>
              <input
                type="text"
                id="equipmentNo"
                name="equipmentNo"
                value={formData.equipmentNo}
                onChange={handleInputChange}
                required
                placeholder="Enter equipment registration number"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nextServiceHrs">Next Service Hours</label>
              <input
                type="text"
                id="nextServiceHrs"
                name="nextServiceHrs"
                value={formData.nextServiceHrs}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="machine">Machine</label>
              <input
                type="text"
                id="machine"
                name="machine"
                value={formData.machine}
                onChange={handleInputChange}
                required
                readOnly={formData.equipmentNo.trim() !== ''}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="mechanics">Mechanics</label>
              <input
                type="text"
                id="mechanics"
                name="mechanics"
                value={formData.mechanics}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="operatorName">Operator Name</label>
              <input
                type="text"
                id="operatorName"
                name="operatorName"
                value={formData.operatorName}
                onChange={handleInputChange}
                required
                readOnly={formData.equipmentNo.trim() !== ''}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Checklist Items</h4>
          
          <div className="checklist-container">
            <div className="checklist-column">
              <div className="section-header">
                <h5>Items 1-24</h5>
                <div className="check-all-controls">
                  <button 
                    type="button" 
                    className="check-all-button check-yes"
                    onClick={() => checkAllInRange(1, 24, '✓')}
                  >
                    Check All ✓
                  </button>
                  <button 
                    type="button" 
                    className="check-all-button check-no"
                    onClick={() => checkAllInRange(1, 24, '✗')}
                  >
                    Check All ✗
                  </button>
                  <button 
                    type="button" 
                    className="check-all-button check-na"
                    onClick={() => checkAllInRange(1, 24, '--')}
                  >
                    Check All --
                  </button>
                </div>
              </div>
              
              <table className="checklist-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Description</th>
                    <th colSpan="3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {checklistItems.slice(0, 24).map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.description}</td>
                      <td className="status-cell">
                        <label className="status-label">
                          <input
                            type="radio"
                            name={`status-${item.id}`}
                            checked={item.status === '✓'}
                            onChange={() => handleStatusChange(item.id, '✓')}
                          />
                          <span className="status-mark status-yes">✓</span>
                        </label>
                      </td>
                      <td className="status-cell">
                        <label className="status-label">
                          <input
                            type="radio"
                            name={`status-${item.id}`}
                            checked={item.status === '✗'}
                            onChange={() => handleStatusChange(item.id, '✗')}
                          />
                          <span className="status-mark status-no">✗</span>
                        </label>
                      </td>
                      <td className="status-cell">
                        <label className="status-label">
                          <input
                            type="radio"
                            name={`status-${item.id}`}
                            checked={item.status === '--'}
                            onChange={() => handleStatusChange(item.id, '--')}
                          />
                          <span className="status-mark status-na">--</span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="checklist-column">
              <div className="section-header">
                <h5>Items 25-33</h5>
                <div className="check-all-controls">
                  <button 
                    type="button" 
                    className="check-all-button check-yes"
                    onClick={() => checkAllInRange(25, 33, '✓')}
                  >
                    Check All ✓
                  </button>
                  <button 
                    type="button" 
                    className="check-all-button check-no"
                    onClick={() => checkAllInRange(25, 33, '✗')}
                  >
                    Check All ✗
                  </button>
                  <button 
                    type="button" 
                    className="check-all-button check-na"
                    onClick={() => checkAllInRange(25, 33, '--')}
                  >
                    Check All --
                  </button>
                </div>
              </div>
              
              <table className="checklist-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Description</th>
                    <th colSpan="3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {checklistItems.slice(24).map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.description}</td>
                      <td className="status-cell">
                        <label className="status-label">
                          <input
                            type="radio"
                            name={`status-${item.id}`}
                            checked={item.status === '✓'}
                            onChange={() => handleStatusChange(item.id, '✓')}
                          />
                          <span className="status-mark status-yes">✓</span>
                        </label>
                      </td>
                      <td className="status-cell">
                        <label className="status-label">
                          <input
                            type="radio"
                            name={`status-${item.id}`}
                            checked={item.status === '✗'}
                            onChange={() => handleStatusChange(item.id, '✗')}
                          />
                          <span className="status-mark status-no">✗</span>
                        </label>
                      </td>
                      <td className="status-cell">
                        <label className="status-label">
                          <input
                            type="radio"
                            name={`status-${item.id}`}
                            checked={item.status === '--'}
                            onChange={() => handleStatusChange(item.id, '--')}
                          />
                          <span className="status-mark status-na">--</span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group full-width">
            <label htmlFor="remarks">Remarks</label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>
        </div>

        <div className="form-section">
          <h4>Service History</h4>
          <div className="checklist-container">
            <div className="checklist-column">
              <div className="section-header">
                <h5>Replaced Items</h5>
                <div className="check-all-controls">
                  <button 
                    type="button" 
                    className="check-all-button check-yes"
                    onClick={() => checkAllServiceHistory('✓')}
                  >
                    Check All ✓
                  </button>
                  <button 
                    type="button" 
                    className="check-all-button check-no"
                    onClick={() => checkAllServiceHistory('✗')}
                  >
                    Check All ✗
                  </button>
                  <button 
                    type="button" 
                    className="check-all-button check-na"
                    onClick={() => checkAllServiceHistory('--')}
                  >
                    Check All --
                  </button>
                </div>
              </div>
              
              <table className="checklist-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Description</th>
                    <th colSpan="3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceHistoryItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.description}</td>
                      <td className="status-cell">
                        <label className="status-label">
                          <input
                            type="radio"
                            name={`service-history-${item.id}`}
                            checked={item.status === '✓'}
                            onChange={() => handleServiceHistoryStatusChange(item.id, '✓')}
                          />
                          <span className="status-mark status-yes">✓</span>
                        </label>
                      </td>
                      <td className="status-cell">
                        <label className="status-label">
                          <input
                            type="radio"
                            name={`service-history-${item.id}`}
                            checked={item.status === '✗'}
                            onChange={() => handleServiceHistoryStatusChange(item.id, '✗')}
                          />
                          <span className="status-mark status-no">✗</span>
                        </label>
                      </td>
                      <td className="status-cell">
                        <label className="status-label">
                          <input
                            type="radio"
                            name={`service-history-${item.id}`}
                            checked={item.status === '--'}
                            onChange={() => handleServiceHistoryStatusChange(item.id, '--')}
                          />
                          <span className="status-mark status-na">--</span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Save Report</button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;