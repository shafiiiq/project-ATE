import { useState, useRef, useEffect } from 'react';
import './Equipments.css';
import { useNavigate } from 'react-router-dom';

function Equipments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ message: '', isError: false });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showOperatorsModal, setShowOperatorsModal] = useState(false);
  const [operatorsData, setOperatorsData] = useState([]);
  const [hoveredOperator, setHoveredOperator] = useState(null);
  
  const navigate = useNavigate();
  const tableRef = useRef(null);

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
        console.log(data.data[0].certificationBody[data.data[0].certificationBody.length-1]);
        
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
          ${tableRef.current?.outerHTML || ''}
          <div style="margin-top: 10px; text-align: center;">
            Showing ${filteredData?.length || 0} ${searchTerm ? 'matching entries' : 'entries'}
          </div>
        </body>
      </html>
    `;
  
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
  
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  // Navigation handlers for action buttons
  const handleEdit = (e, equipment) => {
    e.stopPropagation(); // Prevent row click event
    navigate(`/update-equipment/${equipment.regNo}`, { state: { equipment } });
  };

  const handleDeleteClick = (e, equipment) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedEquipment(equipment);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedEquipment) return;
    
    fetch(`http://localhost:3001/equipments/delete-equipment/${selectedEquipment.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setShowDeleteModal(false);
      if (data.ok) {
        setDeleteStatus({
          message: `Equipment ${selectedEquipment.regNo} successfully deleted.`,
          isError: false
        });
        // Refresh the equipment list
        fetchEquipments();
      } else {
        setDeleteStatus({
          message: data.message || 'Failed to delete equipment.',
          isError: true
        });
      }
      setShowStatusModal(true);
    })
    .catch(error => {
      setShowDeleteModal(false);
      setDeleteStatus({
        message: 'Error deleting equipment: ' + error.message,
        isError: true
      });
      setShowStatusModal(true);
      console.error('Error deleting equipment:', error);
    });
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedEquipment(null);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setDeleteStatus({ message: '', isError: false });
  };

  const handleAdd = () => {
    navigate('/add-equipment');
  };

  // Handle showing all operators in the certificationBody array
  const handleViewAllOperators = (e, operators) => {
    e.stopPropagation(); // Prevent row click event
    setOperatorsData(operators);
    setShowOperatorsModal(true);
    console.log("this e", e , "event");
    
  };

  const closeOperatorsModal = () => {
    setShowOperatorsModal(false);
    setOperatorsData([]);
  };

  // Handle hover state for operator cells
  const handleOperatorMouseEnter = (equipmentId) => {    
    setHoveredOperator(equipmentId);
  };

  const handleOperatorMouseLeave = () => {
    setHoveredOperator(null);
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
        <div className="buttons-container">
          <button onClick={handleAdd} className="add-button">
            Add Equipment
          </button>
          <button onClick={handlePrint} className="print-button">
            Print Table
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
              <th>Operator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData && filteredData.length > 0 ? (
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
                  <td 
                    className="operator-cell"
                    onMouseEnter={() => handleOperatorMouseEnter(item.id)}
                    onMouseLeave={handleOperatorMouseLeave}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.certificationBody[item.certificationBody.length - 1]}
                    {item.certificationBody.length >= 1 && hoveredOperator === item.id && (
                      <div className="view-all-overlay">
                        <button 
                          className="view-all-button"
                          onClick={(e) => handleViewAllOperators(e, item.certificationBody)}
                        >
                          View All
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="edit-button" 
                      onClick={(e) => handleEdit(e, item)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button" 
                      onClick={(e) => handleDeleteClick(e, item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  {equipments.length > 0 ? 'No matching records found' : 'Loading equipment data...'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the equipment with registration number <strong>{selectedEquipment?.regNo}</strong>?</p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={cancelDelete}>Cancel</button>
              <button className="confirm-delete-button" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${deleteStatus.isError ? 'error-modal' : 'success-modal'}`}>
            <div className="modal-header">
              <h2>{deleteStatus.isError ? 'Error' : 'Success'}</h2>
            </div>
            <div className="modal-body">
              <p>{deleteStatus.message}</p>
            </div>
            <div className="modal-footer">
              <button className="ok-button" onClick={closeStatusModal}>OK</button>
            </div>
          </div>
        </div>
      )}

      {/* Operators Modal */}
      {showOperatorsModal && (
        <div className="modal-overlay">
          <div className="modal-content operators-modal">
            <div className="modal-header">
              <h2>All Operators</h2>
            </div>
            <div className="modal-body">
              {operatorsData.length > 0 ? (
                <div className="operators-list">
                  <table className="operators-table">
                    <thead>
                      <tr>
                        <th>SL No</th>
                        <th>Operator Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {operatorsData.map((operator, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{operator}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No operator data available.</p>
              )}
            </div>
            <div className="modal-footer">
              <button className="ok-button" onClick={closeOperatorsModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Equipments;