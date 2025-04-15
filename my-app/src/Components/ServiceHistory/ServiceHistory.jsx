import { useState, useRef, useEffect } from 'react';
import './ServiceHistory.css';
import serviceHistory from '../../service-history';

function ServiceHistory() {
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(serviceHistory);

  // Create a ref for the table to print
  const tableRef = useRef(null);

  // Filter data when search term changes
  useEffect(() => {
    const results = serviceHistory.filter(item => {
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

      <h1 className="title">Service History</h1>
      <h3 className="equipment">Boom Truck - 534534</h3>
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
              <th>Date</th>
              <th>Oil</th>
              <th>Oil Filter</th>
              <th>Fuel Filter</th>
              <th>Water Seperator</th>
              <th>Air Filter</th>
              <th>Serviced Hrs</th>
              <th>Next Service Hrs</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id}>
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
                <td colSpan="10" className="no-results">No matching records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     
    </div>
  );
}

export default ServiceHistory;