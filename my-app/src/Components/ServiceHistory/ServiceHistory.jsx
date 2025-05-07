import { useState, useRef, useEffect } from 'react';
import './ServiceHistory.css';
import { useParams, useNavigate } from 'react-router-dom';

function ServiceHistory(props) {
  // Get the regNo from URL parameters and setup navigation
  const { regNo } = useParams();
  const navigate = useNavigate();
  
  // Determine if this is maintenance view or regular service history
  const isMaintenance = props.maintanance === true;

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [equipmentData, setEquipmentData] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);

  // Create a ref for the table to print
  const tableRef = useRef(null);

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
    // Define endpoint based on the view type
    const endpoint = isMaintenance 
      ? `http://localhost:3001/service-history/get-maintanance-history/${regNo}`
      : `http://localhost:3001/service-history/get-service-history/${regNo}`;

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
      })
      .catch(error => {
        console.error(`Error fetching ${isMaintenance ? 'maintenance' : 'service'} records:`, error);
        alert(`Failed to fetch ${isMaintenance ? 'maintenance' : 'service'} records. Please try again.`);
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
  }, [regNo, isMaintenance]); // Re-run this effect if regNo or isMaintenance changes

  // Second useEffect to filter data once serviceHistory is updated
  useEffect(() => {
    // Filter service history for this specific equipment
    let equipmentServiceHistory = serviceHistory.filter(item =>
      item.regNo?.toString().trim() === regNo?.toString().trim() ||
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
    if (isMaintenance) {
      navigate(`/maintenance-history-form/${regNo}`);
    } else {
      navigate(`/service-history-form/${regNo}`);
    }
  };

  const handleToggleView = () => {
    if (isMaintenance) {
      navigate(`/service-history/${regNo}`);
    } else {
      navigate(`/maintanance-history/${regNo}`);
    }
  };  

  const showTyreService = () => {
      navigate(`/tyre-history/${regNo}`);
  };

  const handleRowClick = (date) => {
    const path = isMaintenance ? `/maintenance-doc/${regNo}/${date}` : `/service-doc/${regNo}/${date}`;
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
        .full-service-row { background-color: #ffd3a5 !important; } /* Orange background for full service rows */
      </style>
    `;

    const content = `
      <html>
        <head>
          <title>${isMaintenance ? 'Maintenance' : 'Service'} History</title>
          ${style}
        </head>
        <body>
          <h1>${isMaintenance ? 'Maintenance' : 'Periodic Service'} History</h1>
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
      <h1 className="title">
        {isMaintenance ? 'Maintanance Service History' : 'Periodic Service History'}
      </h1>
      <h3 className="equipment">
        {equipmentData
          ? `${equipmentData.machine} - ${regNo}`
          : `Equipment: ${regNo}`}
      </h3>

      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder={isMaintenance ? "Search maintanance history..." : "Search service history..."}
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
            Add {isMaintenance ? 'Maintanance' : 'Service'}
          </button>
          <button onClick={handleToggleView} className="maintance-history">
            Show {isMaintenance ? 'Periodic History' : 'Maintanance History'}
          </button>
          <button onClick={showTyreService} className="maintance-history-tyre">
            Show Tyre Sevice
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
              {isMaintenance ? (
                <>
                  <th>Date</th>
                  <th>Equipment No</th>
                  <th style={{ width: '80%' }}>Work Remarks</th>
                </>
              ) : (
                <>
                  <th className='date-th'>Date</th>
                  <th>Oil</th>
                  <th>Oil Filter</th>
                  <th>Fuel Filter</th>
                  <th>Water Separator</th>
                  <th>Air Filter</th>
                  <th className='service-th'>Serviced Hrs</th>
                  <th className='date-th'>Next Service Hrs</th>
                  <th className='next-f-th'>Next Full Service Hrs</th>
                  <th>Work Remarks</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr 
                  key={index}
                  onClick={() => handleRowClick(formatDate(item.date))}
                  className={`doc-click ${item.fullService ? 'full-service-row' : ''}`}
                >
                  <td>{formatDate(item.date)}</td>
                  { isMaintenance ?   <td style={{ textAlign: 'left' }}>{item.regNo}</td> : ""}
                  {isMaintenance ? (
                    <td style={{ textAlign: 'left' }}>{item.workRemarks}</td>
                  ) : (
                    <>
                      <td>{item.oil}</td>
                      <td>{item.oilFilter}</td>
                      <td>{item.fuelFilter}</td>
                      <td>{item.waterSeparator}</td>
                      <td>{item.airFilter}</td>
                      <td>{item.serviceHrs}</td>
                      {item.nextServiceHrs === 0 ? ' ' : <td>{item.nextServiceHrs}</td> }
                     { item.fullService ?  <td>{item.serviceHrs + 3000}</td> :  <td></td>}
                     { item.fullService ?  <td>{item.remarks}</td> :  <td></td>}
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isMaintenance ? "3" : "10"} className="no-results">
                  No {isMaintenance ? 'maintenance' : 'service history'} records found for this equipment
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ServiceHistory;