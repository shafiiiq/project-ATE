import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ServiceHistoryForm.css';

function ServiceHistoryForm() {
  const { regNo } = useParams();
  const navigate = useNavigate();
  const [equipmentData, setEquipmentData] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    regNo: regNo || '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    oil: '✓',
    oilFilter: '✓',
    fuelFilter: '✓',
    waterSeperator: 'Clean', // Default to Clean
    airFilter: '✓',
    serviceHrs: '',
    nextServiceHrs: ''
  });

  // Load equipment details if available
  useEffect(() => {
    if (regNo) {
      import('../../equipments').then(module => {
        const equipment = module.default.find(eq => eq.regNo.trim() === regNo.trim());
        setEquipmentData(equipment);
      }).catch(err => {
        console.error("Could not load equipment data:", err);
      });
    }
  }, [regNo]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate next service hours automatically (300 hours after current)
  const calculateNextService = (currentHrs) => {
    if (!currentHrs) return '';
    return parseInt(currentHrs) + 400;
  };

  // Update next service hours when service hours change
  useEffect(() => {
    if (formData.serviceHrs) {
      setFormData(prev => ({
        ...prev,
        nextServiceHrs: calculateNextService(prev.serviceHrs)
      }));
    }
  }, [formData.serviceHrs]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get existing service history
    import('../../service-history').then(module => {
      const currentHistory = [...module.default];
      
      // Add new entry
      currentHistory.unshift(formData); // Add to beginning for newest first
      
      // Here you would typically save this to your database
      // For now, just log the new data
      console.log("New service history data to save:", currentHistory);
      
      // Navigate back to service history page
      navigate(`/service-history/${regNo}`);
      
      // Note: In a real application, you would use an API call to save this data
      alert("Service record added successfully!");
    });
  };

  // Cancel and go back to service history
  const handleCancel = () => {
    navigate(`/service-history/${regNo}`);
  };

  return (
    <div className="form-container">
      <h1>Add Service Record</h1>
      {equipmentData && (
        <h3>{equipmentData.machine} - {regNo}</h3>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Service Date</label>
          <input 
            type="date" 
            id="date" 
            name="date" 
            value={formData.date} 
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="oil">Oil</label>
            <select id="oil" name="oil" value={formData.oil} onChange={handleInputChange}>
              <option value="✓">✓</option>
              <option value="×">×</option>
              <option value="--">--</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="oilFilter">Oil Filter</label>
            <select id="oilFilter" name="oilFilter" value={formData.oilFilter} onChange={handleInputChange}>
              <option value="✓">✓</option>
              <option value="×">×</option>
              <option value="--">--</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fuelFilter">Fuel Filter</label>
            <select id="fuelFilter" name="fuelFilter" value={formData.fuelFilter} onChange={handleInputChange}>
              <option value="✓">✓</option>
              <option value="×">×</option>
              <option value="--">--</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="waterSeperator">Water Separator</label>
            <select id="waterSeperator" name="waterSeperator" value={formData.waterSeperator} onChange={handleInputChange}>
              <option value="Clean">Clean</option>
              <option value="Change">Change</option>
              <option value="--">--</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="airFilter">Air Filter</label>
            <select id="airFilter" name="airFilter" value={formData.airFilter} onChange={handleInputChange}>
              <option value="✓">✓</option>
              <option value="×">×</option>
              <option value="--">--</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="serviceHrs">Service Hours</label>
            <input 
              type="number" 
              id="serviceHrs" 
              name="serviceHrs" 
              value={formData.serviceHrs} 
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="nextServiceHrs">Next Service Hours</label>
            <input 
              type="number" 
              id="nextServiceHrs" 
              name="nextServiceHrs" 
              value={formData.nextServiceHrs} 
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Save Service Record
          </button>
        </div>
      </form>
    </div>
  );
}

export default ServiceHistoryForm;