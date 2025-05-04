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
    waterSeparator: '✓',
    airFilter: 'Clean',
    serviceHrs: '',
    nextServiceHrs: '',
    fullService: false
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

  // Calculate next service hours automatically (400 hours after current)
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

    fetch(`http://localhost:3001/service-history/get-latest-full-service/${regNo}`, {
      method: "GET",
      headers: {
        "Accept": "*/*",
        'Content-Type': 'application/json'
      }
    }).then((result) => result.json())
      .then((data) => {        
        console.log(data);
        if (data && data.ok == true && data.data.fullService === true  && data.data.serviceHrs + 3000 <= formData.nextServiceHrs) {          
          fetch(`http://localhost:3001/service-history/add-full-service-notification/${regNo}`, {
            method: "POST",
            headers: {
              "Accept": "*/*",
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              regNo: regNo,
              mechine: equipmentData.machine,
              lastServiceHrs: formData.serviceHrs,
              nextFullServiceHrs: formData.nextServiceHrs
            }) // Send only the form data, not the entire history
          })
            .then((result) => result.json())
            .then((data) => {
              console.log("Service record added successfully:", data);
            })
            .catch(error => {
              console.error("Error adding service record:", error);
              alert("Failed to add service record. Please try again.");
            });
        }
      })


    fetch('http://localhost:3001/service-history/add-service-history', {
      method: "POST",
      headers: {
        "Accept": "*/*",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData) 
    })
      .then((result) => result.json())
      .then((data) => {
        console.log("Service record added successfully:", data);
        alert("Service record added successfully!");
      })
      .catch(error => {
        console.error("Error adding service record:", error);
        alert("Failed to add service record. Please try again.");
      });
  };

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
              <option value="X">X</option>
              <option value="--">--</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="oilFilter">Oil Filter</label>
            <select id="oilFilter" name="oilFilter" value={formData.oilFilter} onChange={handleInputChange}>
              <option value="✓">✓</option>
              <option value="X">X</option>
              <option value="--">--</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fuelFilter">Fuel Filter</label>
            <select id="fuelFilter" name="fuelFilter" value={formData.fuelFilter} onChange={handleInputChange}>
              <option value="✓">✓</option>
              <option value="X">X</option>
              <option value="--">--</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="waterSeperator">Water Separator</label>
            <select id="waterSeperator" name="waterSeparator" value={formData.waterSeparator} onChange={handleInputChange}>
              <option value="✓">✓</option>
              <option value="X">X</option>
              <option value="--">--</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="airFilter">Air Filter</label>
            <select id="airFilter" name="airFilter" value={formData.airFilter} onChange={handleInputChange}>
              <option value="Clean">Clean</option>
              <option value="Change">Change</option>
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

        {/* full service starts */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fullService">Full Service</label>
            <select id="fullService" name="fullService" value={formData.fullService} onChange={handleInputChange}>
              <option value="false">X</option>
              <option value="true">✓</option>
            </select>
          </div>
        </div>
        {/* full service ends  */}

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