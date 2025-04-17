import { useState, useRef, useEffect } from 'react';
import './ServiceHistory.css';
import serviceHistory from '../../service-history';
import { useParams, useNavigate } from 'react-router-dom';

function ServiceHistory() {
  // Get the regNo from URL parameters and setup navigation
  const { regNo } = useParams();
  const navigate = useNavigate();

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [equipmentData, setEquipmentData] = useState(null);

  // Create a ref for the table to print
  const tableRef = useRef(null);

  // Filter and sort service history data based on regNo and search term
  useEffect(() => {
    // Log the registration number to console
    console.log("Registration Number:", regNo);

    // Filter service history for this specific equipment
    let equipmentServiceHistory = serviceHistory.filter(item => 
      item.regNo.trim() === regNo?.trim() || 
      (item.equipmentId && item.equipmentId.trim() === regNo?.trim())
    );

    // Sort by date (newest first)
    equipmentServiceHistory.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    console.log("Filtered service history:", equipmentServiceHistory);

    // Apply search term filter if any
    const results = equipmentServiceHistory.filter(item => {
      if (!searchTerm) return true;
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredData(results);

    // Try to find equipment details from your equipments data
    if (regNo) {
      import('../../equipments').then(module => {
        const equipment = module.default.find(eq => eq.regNo.trim() === regNo.trim());
        setEquipmentData(equipment);
      }).catch(err => {
        console.error("Could not load equipment data:", err);
      });
    }
  }, [regNo, searchTerm]);

  // Navigate to add service form
  const handleAddService = () => {
    navigate(`/service-history-form/${regNo}`);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
  
    const style = `
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1, p { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; }
        .no-results { text-align: center; font-style: italic; }
      </style>
    `;
  
    const content = `
      <html>
        <head>
          <title>Service History</title>
          ${style}
        </head>
        <body>
          <h1>Service History</h1>
          <h2>${equipmentData ? `${equipmentData.machine} - ${regNo}` : `Equipment: ${regNo}`}</h2>
          ${searchTerm ? `<p>Search results for: "<strong>${searchTerm}</strong>"</p>` : ''}
          ${tableRef.current?.outerHTML}
          <div style="margin-top: 10px; text-align: center;">
            Showing ${filteredData.length} ${searchTerm ? 'matching entries' : 'entries'}
          </div>
        </body>
      </html>
    `;
  
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
  
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };
  

  return (
    <div className="container">
      <h1 className="title">Service History</h1>
      <h3 className="equipment">
        {equipmentData 
          ? `${equipmentData.machine} - ${regNo}`
          : `Equipment: ${regNo}`}
      </h3>

      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search service history..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={handleClearSearch} className="clear-button">
              ×
            </button>
          )}
        </div>
        <div className="action-buttons">
          <button onClick={handleAddService} className="add-button">
            Add Service
          </button>
          <button onClick={handlePrint} className="print-button">
            Print Table
          </button>
        </div>
      </div>
      <div className="table-info">
        {searchTerm ? (
          `Found ${filteredData.length} matching ${filteredData.length === 1 ? 'entry' : 'entries'}`
        ) : (
          `Showing ${filteredData.length} ${filteredData.length === 1 ? 'entry' : 'entries'} `
        )}
      </div>

      <div className="table-container">
        <table className="equipment-table" ref={tableRef}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Oil</th>
              <th>Oil Filter</th>
              <th>Fuel Filter</th>
              <th>Water Separator</th>
              <th>Air Filter</th>
              <th>Serviced Hrs</th>
              <th>Next Service Hrs</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.oil}</td>
                  <td>{item.oilFilter}</td>
                  <td>{item.fuelFilter}</td>
                  <td>{item.waterSeperator}</td>
                  <td>{item.airFilter}</td>
                  <td>{item.serviceHrs}</td>
                  <td>{item.nextServiceHrs}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">No service history records found for this equipment</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ServiceHistory;