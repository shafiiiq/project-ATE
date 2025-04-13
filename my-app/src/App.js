import { useState, useRef, useEffect } from 'react';
import './App.css';
import equipments from './equipments';
import ServiceDoc from './Components/ServiceDoc/ServiceDoc';

function App() {
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(equipments);
  
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
  
  // Handle print function
  const handlePrint = () => {
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <h1 style="text-align: center; margin-bottom: 20px;">Equipment Inventory</h1>
      ${searchTerm ? `<p style="text-align: center; margin-bottom: 15px;">Search results for: "${searchTerm}"</p>` : ''}
      ${tableRef.current.outerHTML}
      <div style="text-align: center; margin-top: 10px;">
        Showing ${filteredData.length} ${searchTerm ? 'matching entries' : 'entries'}
      </div>
    `;
    
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    
    window.print();
    
    document.body.innerHTML = originalContents;
  };

  return (
    <div className="container">

      <ServiceDoc/>
      
      {/* <h1 className="title">Equipment Inventory</h1>
      
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
      
      <div className="table-container">
        <table className="equipment-table" ref={tableRef}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Machine</th>
              <th>Reg No</th>
              <th>COC</th>
              <th>Brand</th>
              <th>Year</th>
              <th>Istimara Expiry</th>
              <th>Insurance Expiry</th>
              <th>TPC Expiry</th>
              <th>Operators</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.machine}</td>
                  <td>{item.regNo}</td>
                  <td>{item.coc}</td>
                  <td>{item.brand}</td>
                  <td>{item.year}</td>
                  <td>{item.istimaraExpiry}</td>
                  <td>{item.insuranceExpiry}</td>
                  <td>{item.tpcExpiry}</td>
                  <td>{item.certificationBody}</td>
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
      
      <div className="table-info">
        {searchTerm ? (
          `Found ${filteredData.length} matching ${filteredData.length === 1 ? 'entry' : 'entries'}`
        ) : (
          `Showing all ${filteredData.length} entries`
        )}
      </div> */}
    </div>
  );
}

export default App;