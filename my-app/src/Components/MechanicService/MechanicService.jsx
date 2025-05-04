import { useState, useRef, useEffect } from 'react';
import './MechanicService.css';
import { useParams, useNavigate } from 'react-router-dom';

function MechanicService(props) {
  // Get the regNo from URL parameters and setup navigation
  const { regNo } = useParams();
  const navigate = useNavigate();
  
  // Determine if this is tyre view or battery service history
  const isTyre = props.tyre === true;

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
        console.log(data.data);
        setServiceHistory(data.data);
      })
      .catch(error => {
        console.error(`Error fetching ${isTyre ? 'tyre' : 'battery'} records:`, error);
        alert(`Failed to fetch ${isTyre ? 'tyre' : 'battery'} records. Please try again.`);
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

  return (
    <div className="container">
      <h1 className="title">
        {isTyre ? 'Tyre Service History' : 'Battery Service History'}
      </h1>
      <h3 className="equipment">
        {equipmentData
          ? `${equipmentData.machine} - ${regNo}`
          : `Equipment: ${regNo}`}
      </h3>

      <div className="controls-container-m">
        <div className="search-container">
          <input
            type="text"
            placeholder={isTyre ? "Search tyre history..." : "Search battery history..."}
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
            Add {isTyre ? 'Tyre' : 'Battery'} Service
          </button>
          <button onClick={handleToggleView} className="maintance-history">
            Show {isTyre ? 'Battery History' : 'Tyre History'}
          </button>
          <button onClick={handlePrint} className="print-button">
            Print Table
          </button>
        </div>
      </div>
      <div className="table-info-m">
        {searchTerm ? (
          `Found ${filteredData.length} matching ${filteredData.length === 1 ? 'entry' : 'entries'}`
        ) : (
          `Showing ${filteredData.length} ${filteredData.length === 1 ? 'entry' : 'entries'} `
        )}
      </div>

      <div className="table-container-m">
        <table className="equipment-table" ref={tableRef}>
          <thead>
            <tr>
              {isTyre ? (
                <>
                  <th className='date-th'>Date</th>
                  <th>Tyre Model</th>
                  <th>Tyre Number</th>
                  <th>Equipment</th>
                  <th>Equipment No</th>
                  <th>Location</th>
                  <th className='service-th-m'>Operator</th>
                  <th className='date-th'>Running Hrs / Km</th>
                </>
              ) : (
                <>
                  <th className='date-th'>Date</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Serial Number</th>
                  <th>Voltage</th>
                  <th>Amp Hours</th>
                  <th className='service-th'>Service KM</th>
                  <th className='date-th'>Next Service KM</th>
                  <th>Replaced</th>
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
                  className={`doc-click ${item.replaced ? 'replacement-row' : ''}`}
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
                      <td style={{ textAlign: 'left' }}>{item.workRemarks}</td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isTyre ? "10" : "10"} className="no-results">
                  No {isTyre ? 'tyre' : 'battery'} service records found for this equipment
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MechanicService;