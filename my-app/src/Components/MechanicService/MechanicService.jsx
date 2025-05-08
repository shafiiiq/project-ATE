import React, { useState, useRef, useEffect } from 'react';
import './MechanicService.css';
import { useParams, useNavigate } from 'react-router-dom';

const MechanicService = (props) => {
  // Get the regNo from URL parameters and setup navigation
  const { regNo } = useParams();
  const navigate = useNavigate();
  
  // Determine if this is tyre view or battery service history
  const isTyre = props.tyre === true;

  // State for search functionality and data
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [equipmentData, setEquipmentData] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Create a ref for the table to print
  const tableRef = useRef(null);

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

  // Function to format date from YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // First useEffect to fetch data
  useEffect(() => {
    setLoading(true);
    // Define endpoint based on the view type
    const endpoint = isTyre 
      ? `http://localhost:3001/service-history/get-tyre-history/${regNo}`
      : `http://localhost:3001/service-history/get-battery-history/${regNo}`;

    fetch(endpoint, {
      method: "GET",
      headers: {
        "Accept": "*/*",
        'Content-Type': 'application/json'
      },
    })
      .then((result) => result.json())
      .then((data) => {
        setServiceHistory(data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(`Error fetching ${isTyre ? 'tyre' : 'battery'} records:`, error);
        setError(`Failed to fetch ${isTyre ? 'tyre' : 'battery'} records. Please try again.`);
        setLoading(false);
      });

    // Try to find equipment details from your equipments data
    if (regNo) {
      import('../../equipments').then(module => {
        const equipment = module.default.find(eq => eq.regNo.toString().trim() === regNo.toString().trim());
        setEquipmentData(equipment);
      }).catch(err => {
        console.error("Could not load equipment data:", err);
      });
    }
  }, [regNo, isTyre]); // Re-run this effect if regNo or isTyre changes

  // Second useEffect to filter data once serviceHistory is updated
  useEffect(() => {
    // Filter service history for this specific equipment
    let equipmentServiceHistory = serviceHistory.filter(item =>
      item.equipmentNo?.toString().trim() === regNo?.toString().trim() ||
      (item.equipmentId && item.equipmentId.toString().trim() === regNo?.toString().trim())
    );

    // Sort by date (newest first)
    equipmentServiceHistory.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    // Apply search term filter if any
    const results = equipmentServiceHistory.filter(item => {
      if (!searchTerm) return true;
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredData(results);
  }, [serviceHistory, regNo, searchTerm]); // Re-run when any of these change

  // Navigate to add service form
  const handleAddService = () => {
    if (isTyre) {
      navigate(`/tyre-history-form/${regNo}`);
    } else {
      navigate(`/battery-history-form/${regNo}`);
    }
  };

  const handleToggleView = () => {
    if (isTyre) {
      navigate(`/battery-history/${regNo}`);
    } else {
      navigate(`/tyre-history/${regNo}`);
    }
  };  

  const showServiceHistory = () => {
    navigate(`/service-history/${regNo}`);
  };

  const handleRowClick = (date) => {
    const path = isTyre ? `/tyre-doc/${regNo}/${date}` : `/battery-doc/${regNo}/${date}`;
    navigate(path);
  }

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
        .replacement-row { background-color: #ffd3a5 !important; } /* Orange background for replacement rows */
      </style>
    `;

    const content = `
      <html>
        <head>
          <title>${isTyre ? 'Tyre' : 'Battery'} Service History</title>
          ${style}
        </head>
        <body>
          <h1>${isTyre ? 'Tyre' : 'Battery'} Service History</h1>
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

  // Count records by type
  const recordCounts = {
    all: filteredData.length,
    replacement: filteredData.filter(item => item.replaced === true).length,
    regular: filteredData.filter(item => item.replaced !== true).length
  };

  return (
    <div className="service-history-container">
      <div className="service-header">
        <h1 className="service-title">
          {isTyre ? 'Tyre Service History' : 'Battery Service History'}
        </h1>
        <div className="date-time">{currentDateTime}</div>
      </div>

      <div className="equipment-info">
        {equipmentData ? (
          <h2>{equipmentData.machine} - {regNo}</h2>
        ) : (
          <h2>Equipment: {regNo}</h2>
        )}
      </div>

      <div className="filter-buttons">
        <button 
          className={`filter-btn ${searchTerm === '' ? 'active' : ''}`} 
          onClick={handleClearSearch}
        >
          All ({recordCounts.all})
        </button>
        <button 
          className={`filter-btn replacement ${searchTerm === 'replaced' ? 'active' : ''}`} 
          onClick={() => setSearchTerm('replaced')}
        >
          Replacements ({recordCounts.replacement})
        </button>
        <button 
          className={`filter-btn regular ${searchTerm === 'regular' ? 'active' : ''}`} 
          onClick={() => setSearchTerm('regular')}
        >
          Regular Service ({recordCounts.regular})
        </button>
      </div>

      <div className="controls-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder={isTyre ? "Search tyre history..." : "Search battery history..."}
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={handleClearSearch} className="clear-btn">×</button>
          )}
        </div>
        <div className="action-buttons">
          <button onClick={handleAddService} className="action-btn add">
            Add {isTyre ? 'Tyre' : 'Battery'} Service
          </button>
          <button onClick={handleToggleView} className="action-btn toggle">
            {isTyre ? 'Battery' : 'Tyre'} History
          </button>
          <button onClick={showServiceHistory} className="action-btn service">
            Service / Maintanance History
          </button>
          <button onClick={handlePrint} className="action-btn print">
            Print
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading {isTyre ? 'tyre' : 'battery'} service data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="service-table-container">
          <table className="service-table" ref={tableRef}>
            <thead>
              <tr>
                {isTyre ? (
                  <>
                    <th>Date</th>
                    <th>Tyre Model</th>
                    <th>Tyre Number</th>
                    <th>Equipment</th>
                    <th>Equipment No</th>
                    <th>Location</th>
                    <th>Operator</th>
                    <th>Running Hrs / Km</th>
                    <th>Document</th>
                  </>
                ) : (
                  <>
                    <th>Date</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Serial Number</th>
                    <th>Voltage</th>
                    <th>Amp Hours</th>
                    <th>Service KM</th>
                    <th>Next Service KM</th>
                    <th>Replaced</th>
                    <th>Work Remarks</th>
                    <th>Document</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr 
                    key={index}
                    className={`${item.replaced ? 'replacement-row' : ''}`}
                  >
                    <td>{formatDate(item.date)}</td>
                    {isTyre ? (
                      <>
                        <td>{item.tyreModel}</td>
                        <td>{item.tyreNumber}</td>
                        <td>{item.equipment}</td>
                        <td>{item.equipmentNo}</td>
                        <td>{item.location}</td>
                        <td>{item.operator}</td>
                        <td>{item.runningHours}</td>
                      </>
                    ) : (
                      <>
                        <td>{item.brand}</td>
                        <td>{item.model}</td>
                        <td>{item.serialNumber}</td>
                        <td>{item.voltage}</td>
                        <td>{item.ampHours}</td>
                        <td>{item.serviceKm}</td>
                        <td>{item.nextServiceKm}</td>
                        <td>{item.replaced ? 'Yes' : 'No'}</td>
                        <td style={{ textAlign: 'left' }}>{item.workRemarks || ''}</td>
                      </>
                    )}
                    <td>
                      <button 
                        className="action-btn details" 
                        onClick={() => handleRowClick(formatDate(item.date))}
                      >
                        View Document
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isTyre ? "9" : "11"} className="no-results">
                    No {isTyre ? 'tyre' : 'battery'} service records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MechanicService;