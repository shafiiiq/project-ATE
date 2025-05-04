import React, { useState } from 'react';
import '../TyreHistoryForm/TyreHistoryForm.css';

const TyreHistoryForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    tyreModel: '',
    tyreNumber: '',
    equipment: '',
    equipmentNo: '',
    location: '',
    operator: '',
    runningHours: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://localhost:3001/service-history/add-tyre-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      const result = await response.json();
      setMessage({ text: 'Tyre history record added successfully!', type: 'success' });
      
      // Reset form after successful submission
      setFormData({
        date: '',
        tyreModel: '',
        tyreNumber: '',
        equipment: '',
        equipmentNo: '',
        location: '',
        operator: '',
        runningHours: ''
      });
      
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tyre-history-container">
      <h1>Add Tyre History Record</h1>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="tyre-history-form">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tyreModel">Tyre Model</label>
          <input
            type="text"
            id="tyreModel"
            name="tyreModel"
            value={formData.tyreModel}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tyreNumber">Tyre Number</label>
          <input
            type="text"
            id="tyreNumber"
            name="tyreNumber"
            value={formData.tyreNumber}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="equipment">Equipment</label>
          <input
            type="text"
            id="equipment"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="operator">Operator</label>
          <input
            type="text"
            id="operator"
            name="operator"
            value={formData.operator}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="runningHours">Running Hrs / Km</label>
          <input
            type="text"
            id="runningHours"
            name="runningHours"
            value={formData.runningHours}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
          <button 
            type="button" 
            onClick={() => {
              setFormData({
                date: '',
                tyreModel: '',
                tyreNumber: '',
                equipment: '',
                equipmentNo: '',
                location: '',
                operator: '',
                runningHours: ''
              });
              setMessage({ text: '', type: '' });
            }}
            className="reset-button"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default TyreHistoryForm;