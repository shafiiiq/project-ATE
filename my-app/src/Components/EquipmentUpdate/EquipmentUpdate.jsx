import React, { useState, useEffect } from 'react';
import './EquipmentUpdate.css';

const EquipmentUpdate = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format date as DD-MM-YYYY
  const formattedDate = `${currentDateTime.getDate().toString().padStart(2, '0')}-${
    (currentDateTime.getMonth() + 1).toString().padStart(2, '0')}-${
    currentDateTime.getFullYear()}`;
    
  // Format time as HH:MM:SS AM/PM
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: true 
  });
  
  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Equipment data from the PDF
  const equipmentData = [
    { sl: 1, machine: "80 Ton Mobile Crane", brand: "ZOOMLION", regNo: "78862", status: "Committed to Samsung (Ras Laffan)" },
    { sl: 2, machine: "80 Ton Mobile Crane", brand: "ZOOMLION", regNo: "78863", status: "Committed to Samsung (Ras Laffan)" },
    { sl: 3, machine: "Dumptruck", brand: "SINOTRUK", regNo: "281998", status: "Committed to QCON" },
    { sl: 1, machine: "3 Ton Boom Truck", brand: "MISTUBISHI", regNo: "239500", status: "Idle/ Ready for work" },
    { sl: 2, machine: "Mini Dumptruck", brand: "ISUZU", regNo: "198331", status: "Idle/ Ready for work" },
    { sl: 3, machine: "3 Ton Roller", brand: "BOMAG", regNo: "70770", status: "Idle/ Need to check" },
    { sl: 4, machine: "3 Ton Roller", brand: "BOMAG", regNo: "70760", status: "Idle/ Need to check" },
    { sl: 5, machine: "3 Ton Forklift", brand: "LONKING", regNo: "72870", status: "Idle/ Ready for work" },
    { sl: 6, machine: "3 Ton Forklift", brand: "LONKING", regNo: "72871", status: "Idle/ Ready for work" },
    { sl: 7, machine: "3 Ton Forklift", brand: "HELI", regNo: "43097", status: "Idle/ Need to check" },
    { sl: 8, machine: "3 Ton Forklift", brand: "HELI", regNo: "70579", status: "Idle/ Need to check" },
    { sl: 9, machine: "5 Ton Forklift", brand: "ZOOMLION", regNo: "72484", status: "Idle/ Need to check" },
    { sl: 10, machine: "5 Ton Forklift", brand: "TCM", regNo: "15050", status: "Idle/ Ready for work" },
    { sl: 11, machine: "7 Ton Forklift", brand: "HELI", regNo: "36707", status: "Idle/ Ready for work" },
    { sl: 12, machine: "Skid Loader", brand: "JCB", regNo: "54470", status: "Idle/ Ready for work" },
    { sl: 13, machine: "Backhoe Loader", brand: "CASE", regNo: "67823", status: "Idle/ Ready for work" },
    { sl: 14, machine: "Wheel Loader", brand: "LUIGONG", regNo: "71056", status: "Idle/ Need to check" },
    { sl: 15, machine: "Wheel Loader", brand: "LUIGONG", regNo: "70126", status: "Idle/ Ready for work" },
    { sl: 16, machine: "20 Ton Wheel Excavator", brand: "HYUNDAI", regNo: "68978", status: "Idle/ Need to check" },
    { sl: 17, machine: "20 Ton Wheel Excavator", brand: "HYUNDAI", regNo: "46941", status: "Idle/ Ready for work" },
    { sl: 18, machine: "30 Ton Mobile Crane", brand: "SANY", regNo: "68154", status: "Idle/ Ready for work" },
    { sl: 19, machine: "10 Ton Roller", brand: "BOMAG", regNo: "43711", status: "Idle/ Ready for work" },
  ];

  // Separate committed and idle equipment
  const committedEquipment = equipmentData.filter(item => 
    item.status.startsWith("Committed")
  );
  
  const idleEquipment = equipmentData.filter(item => 
    item.status.startsWith("Idle")
  );

  // Filter equipment based on search term
  const filteredEquipmentData = equipmentData.filter(item =>
    Object.values(item).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  // Re-separate filtered data
  const filteredCommittedEquipment = filteredEquipmentData.filter(item => 
    item.status.startsWith("Committed")
  );
  
  const filteredIdleEquipment = filteredEquipmentData.filter(item => 
    item.status.startsWith("Idle")
  );

  return (
    <div className="equipment-update" data-print-date={`${formattedDate} ${formattedTime}`}>
      <div className="header-section">
        <h1>EQUIPMENTS LIST</h1>
        <div className="datetime-container">
          <div className="date">{formattedDate}</div>
          <div className="animated-time">{formattedTime}</div>
        </div>
      </div>
      
      <div className="controls-section">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search equipment..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        <button onClick={handlePrint} className="print-button">
          Print Equipment List
        </button>
      </div>
      
      <div className="section">
        <h3 className='committed'>COMMITTED EQUIPMENTS</h3>
        <table>
          <thead>
            <tr>
              <th>SL</th>
              <th>MACHINE</th>
              <th>BRAND</th>
              <th>REG NO</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommittedEquipment.length > 0 ? (
              filteredCommittedEquipment.map((item, index) => (
                <tr key={`committed-${index}`}>
                  <td>{item.sl}</td>
                  <td>{item.machine}</td>
                  <td>{item.brand}</td>
                  <td>{item.regNo}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No matching committed equipment found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h3 className='idle'>IDLE EQUIPMENTS</h3>
        <table>
          <thead>
            <tr>
              <th>SL</th>
              <th>MACHINE</th>
              <th>BRAND</th>
              <th>REG NO</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredIdleEquipment.length > 0 ? (
              filteredIdleEquipment.map((item, index) => (
                <tr key={`idle-${index}`}>
                  <td>{item.sl}</td>
                  <td>{item.machine}</td>
                  <td>{item.brand}</td>
                  <td>{item.regNo}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No matching idle equipment found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentUpdate;