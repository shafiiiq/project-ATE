import { useState, useRef, useEffect } from 'react';
import './Equipments.css';
import equipments from '../../equipments';
import { useNavigate } from 'react-router-dom';

function Equipments() {
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(equipments);
  const navigate = useNavigate();

  // Create a ref for the table to print
  const tableRef = useRef(null);

  // Filter data when search term changes
  useEffect(() => {
    const results = equipments.filter(item => {
      // Convert all values to strings and search in every field
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredData(results);
  }, [searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Handle row click to navigate to service history
  const handleRowClick = (regNo) => {
    navigate(`/service-history/${regNo}`);
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
          <title>Equipment Inventory</title>
          ${style}
        </head>
        <body>
          <h1>Equipment Inventory</h1>
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
        <button onClick={handlePrint} className="print-button">
          Print Table
        </button>
      </div>
      <div className="table-info">
        {searchTerm ? (
          `Found ${filteredData.length} matching ${filteredData.length === 1 ? 'entry' : 'entries'}`
        ) : (
          `Showing all ${filteredData.length} entries`
        )}
      </div>

      <div className="table-container">
        <table className="equipment-table" ref={tableRef}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Machine</th>
              <th>Reg No</th>
              {/* <th>COC</th> */}
              <th>Brand</th>
              <th>Year</th>
              {/* <th>Istimara Expiry</th>
              <th>Insurance Expiry</th>
              <th>TPC Expiry</th>
              <th>Operators</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => handleRowClick(item.regNo)}
                  className="equipment-row"
                >
                  <td>{item.id}</td>
                  <td>{item.machine}</td>
                  <td>{item.regNo}</td>
                  {/* <td>{item.coc}</td> */}
                  <td>{item.brand}</td>
                  <td>{item.year}</td>
                  {/* <td>{item.istimaraExpiry}</td>
                  <td>{item.insuranceExpiry}</td>
                  <td>{item.tpcExpiry}</td>
                  <td>{item.certificationBody}</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-results">No matching records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Equipments;