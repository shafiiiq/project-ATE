import { useState, useRef, useEffect } from 'react';
import '../EquipmentStocks/EquipmentStocks.css';
import { useNavigate } from 'react-router-dom';

function EquipmentStocks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();
  const tableRef = useRef(null);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = () => {
    fetch('http://localhost:3001/equipments/get-equipments', {
      method: 'GET',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    })
      .then((result) => result.json())
      .then((data) => {
        setEquipments(data.data);
        setFilteredData(data.data);
      })
      .catch((error) => {
        console.error('Error fetching equipment records:', error);
      });
  };

  useEffect(() => {
    if (equipments && equipments.length > 0) {
      const results = equipments.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(results);
    }
  }, [searchTerm, equipments]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleRowClick = (regNo) => {
    navigate(`/stocks/eqipment-stocks/${regNo}`);
  };

  return (
    <div className="container">
      <h1 className="title">Equipment Inventory</h1>
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
        </div>
      </div>
      <div className="table-info">
        {searchTerm
          ? `Found ${filteredData?.length || 0} matching ${
              filteredData?.length === 1 ? 'entry' : 'entries'
            }`
          : `Showing all ${filteredData?.length || 0} entries`}
      </div>

      <div className="table-container">
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
            {filteredData.map((item) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EquipmentStocks;
