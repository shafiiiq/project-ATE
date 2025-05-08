import { useState, useRef, useEffect } from 'react';
import './EquipmentStocks.css';
import { useNavigate } from 'react-router-dom';

function EquipmentStocks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState('');
  
  const navigate = useNavigate();
  const tableRef = useRef(null);

  // Get current date and time
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
      hours = hours ? hours : 12;
      const timeString = `${hours}:${minutes} ${ampm}`;
      
      setCurrentDateTime(`${dateString}   |   ${timeString}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = () => {
    fetch('http://localhost:3001/equipments/get-equipments', {
      method: "GET",
      headers: {
        "Accept": "*/*",
        'Content-Type': 'application/json'
      },
    })
      .then((result) => result.json())
      .then((data) => {
        setEquipments(data.data);
        setFilteredData(data.data);        
      })
      .catch(error => {
        console.error(`Error fetching equipment records:`, error);
      });
  };

  useEffect(() => {
    if (equipments && equipments.length > 0) {
      const results = equipments.filter(item => {
        return Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredData(results);
    }
  }, [searchTerm, equipments]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    const foundEquipment = equipments.find(item => 
      item.regNo.toLowerCase() === searchTerm.toLowerCase()
    );
    
  };

  const handleRowClick = (regNo) => {
    navigate(`/service-history/${regNo}`);
  };

  return (
    <div className="equipment-container">
      <div className="equipment-header">
        <h1 className='equip-title'>Equipment Inventory</h1>
        <div className="date-time">{currentDateTime}</div>
      </div>
      
      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={handleClearSearch} className="clear-button">
              ×
            </button>
          )}
          <button onClick={handleSearchSubmit} className="search-button">
            Search
          </button>
        </div>
      </div>

      <div className="table-info">
        {searchTerm ? (
          `Found ${filteredData?.length || 0} matching ${filteredData?.length === 1 ? 'entry' : 'entries'}`
        ) : (
          `Showing all ${filteredData?.length || 0} entries`
        )}
      </div>

      <div className="equipment-table-container">
        <table className="equipment-table" ref={tableRef}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Machine</th>
              <th>Reg No</th>
              <th>Brand</th>
              <th>Year</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredData.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => handleRowClick(item.regNo)}
                  className="equipment-row"
                >
                  <td>{item.id}</td>
                  <td>{item.machine}</td>
                  <td>{item.regNo}</td>
                  <td>{item.brand}</td>
                  <td>{item.year}</td>
                  <td>{item.company}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EquipmentStocks;