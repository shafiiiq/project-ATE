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
  
  // New states for outside equipment functionality
  const [showOutsideEquipmentModal, setShowOutsideEquipmentModal] = useState(false);
  const [notFoundSearchTerm, setNotFoundSearchTerm] = useState('');
  const [outsideEquipmentForm, setOutsideEquipmentForm] = useState({
    machine: '',
    regNo: '',
    brand: '',
    operator: '',
    company: 'OUTSIDE',
    outside: true
  });
  
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

  // Modified search submit functionality
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Check if we have any matches for the search term focusing on regNo
    const foundEquipment = equipments.find(item => 
      item.regNo.toLowerCase() === searchTerm.toLowerCase()
    );
    
    // If not found, show the add outside equipment modal
    if (!foundEquipment && searchTerm.trim()) {
      setNotFoundSearchTerm(searchTerm);
      // Pre-populate the form with the searched regNo
      setOutsideEquipmentForm({
        ...outsideEquipmentForm,
        regNo: searchTerm
      });
      setShowOutsideEquipmentModal(true);
    }
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEquipment, setEditEquipment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    machine: '',
    regNo: '',
    brand: '',
    year: '',
    company: '',
    operator: ''
  });

  const handleEdit = (e, equipment) => {
    e.stopPropagation(); // Prevent row click event
    setEditEquipment(equipment);
    setEditFormData({
      machine: equipment.machine,
      regNo: equipment.regNo,
      brand: equipment.brand,
      year: equipment.year,
      company: equipment.company,
      operator: equipment.certificationBody[equipment.certificationBody.length - 1] || ''
    });
    setShowEditModal(true);
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

  // Handle form input changes for edit modal
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Handle form submission for updating equipment
  const handleUpdateEquipment = (e) => {
    e.preventDefault();
    
    if (!editEquipment) return;

    // Create updated equipment object
    const updatedEquipment = {
      ...editEquipment,
      machine: editFormData.machine,
      regNo: editFormData.regNo,
      brand: editFormData.brand,
      year: editFormData.year, 
      company: editFormData.company
    };

    // Only update certificationBody array if operator is different from the last one
    if (editFormData.operator !== editEquipment.certificationBody[editEquipment.certificationBody.length - 1]) {
      updatedEquipment.certificationBody = [...editEquipment.certificationBody, editFormData.operator];
    }
    
    // Send update request to the server
    fetch(`http://localhost:3001/equipments/update-equipment/${editEquipment.regNo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedEquipment)
    })
    .then(response => response.json())
    .then(data => {
      setShowEditModal(false);
      if (data.ok) {
        setDeleteStatus({
          message: `Equipment ${editEquipment.regNo} successfully updated.`,
          isError: false
        });
        // Refresh the equipment list
        fetchEquipments();
      } else {
        setDeleteStatus({
          message: data.message || 'Failed to update equipment.',
          isError: true
        });
      }
      setShowStatusModal(true);
    })
    .catch(error => {
      setShowEditModal(false);
      setDeleteStatus({
        message: 'Error updating equipment: ' + error.message,
        isError: true
      });
      setShowStatusModal(true);
      console.error('Error updating equipment:', error);
    });
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditEquipment(null);
  };

  // Handle showing all operators in the certificationBody array
  const handleViewAllOperators = (e, operators) => {
    e.stopPropagation(); // Prevent row click event
    setOperatorsData(operators);
    setShowOperatorsModal(true);
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

  // Handle Outside Equipment form input changes
  const handleOutsideEquipmentInputChange = (e) => {
    const { name, value } = e.target;
    setOutsideEquipmentForm({
      ...outsideEquipmentForm,
      [name]: value
    });
  };

  // Handle Outside Equipment form submission
  const handleAddOutsideEquipment = (e) => {
    e.preventDefault();
    
    // Create the outside equipment object with certificationBody as an array
    const newOutsideEquipment = {
      ...outsideEquipmentForm,
      certificationBody: [outsideEquipmentForm.operator]
    };
    
    // Remove the single operator property as it's now in the array
    delete newOutsideEquipment.operator;
    
    // Send request to add the outside equipment
    fetch('http://localhost:3001/equipments/add-equipment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newOutsideEquipment)
    })
    .then(response => response.json())
    .then(data => {
      setShowOutsideEquipmentModal(false);
      if (data.ok) {
        setDeleteStatus({
          message: `Outside equipment ${outsideEquipmentForm.regNo} successfully added.`,
          isError: false
        });
        // Reset form
        setOutsideEquipmentForm({
          machine: '',
          regNo: '',
          brand: '',
          operator: '',
          company: 'OUTSIDE',
          outside: true
        });
        // Refresh the equipment list
        fetchEquipments();
      } else {
        setDeleteStatus({
          message: data.message || 'Failed to add outside equipment.',
          isError: true
        });
      }
      setShowStatusModal(true);
    })
    .catch(error => {
      setShowOutsideEquipmentModal(false);
      setDeleteStatus({
        message: 'Error adding outside equipment: ' + error.message,
        isError: true
      });
      setShowStatusModal(true);
      console.error('Error adding outside equipment:', error);
    });
  };

  // Close outside equipment modal
  const closeOutsideEquipmentModal = () => {
    setShowOutsideEquipmentModal(false);
    setNotFoundSearchTerm('');
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
                    {item.certificationBody && item.certificationBody.length > 0 
                      ? item.certificationBody[item.certificationBody.length - 1]
                      : ''}
                    {item.certificationBody && item.certificationBody.length >= 1 && hoveredOperator === item.id && (
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
                  {equipments.length > 0 ? (
                    searchTerm ? (
                      <>
                        No matching records found for <span className='not-found-outside-equip'>{searchTerm}</span>. 
                        <button 
                          className="add-outside-button"
                          onClick={() => {
                            setOutsideEquipmentForm({
                              ...outsideEquipmentForm,
                              regNo: searchTerm
                            });
                            setShowOutsideEquipmentModal(true);
                          }}
                        >
                          Add as Outside Equipment
                        </button>
                      </>
                    ) : 'No matching records found'
                  ) : 'Loading equipment data...'}
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
      
      {/* Edit Equipment Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content edit-modal">
            <div className="modal-header">
              <h2>Update Equipment</h2>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateEquipment} className="edit-form">
                <div className="form-group">
                  <label htmlFor="machine">Machine:</label>
                  <input
                    type="text"
                    id="machine"
                    name="machine"
                    value={editFormData.machine}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="regNo">Registration No:</label>
                  <input
                    type="text"
                    id="regNo"
                    name="regNo"
                    value={editFormData.regNo}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="brand">Brand:</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={editFormData.brand}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="year">Year:</label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    value={editFormData.year}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="company">Company:</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={editFormData.company}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="operator">Operator:</label>
                  <input
                    type="text"
                    id="operator"
                    name="operator"
                    value={editFormData.operator}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={closeEditModal}>Cancel</button>
              <button className="save-button" onClick={handleUpdateEquipment}>Save Changes</button>
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

      {/* Add Outside Equipment Modal */}
      {showOutsideEquipmentModal && (
        <div className="modal-overlay">
          <div className="modal-content outside-equipment-modal">
            <div className="modal-header">
              <h2>Add Outside Equipment</h2>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddOutsideEquipment} className="edit-form">
                <div className="form-group">
                  <label htmlFor="machine">Machine:</label>
                  <input
                    type="text"
                    id="machine"
                    name="machine"
                    value={outsideEquipmentForm.machine}
                    onChange={handleOutsideEquipmentInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="regNo">Registration No:</label>
                  <input
                    type="text"
                    id="regNo"
                    name="regNo"
                    value={outsideEquipmentForm.regNo}
                    onChange={handleOutsideEquipmentInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="brand">Brand:</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={outsideEquipmentForm.brand}
                    onChange={handleOutsideEquipmentInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="operator">Operator:</label>
                  <input
                    type="text"
                    id="operator"
                    name="operator"
                    value={outsideEquipmentForm.operator}
                    onChange={handleOutsideEquipmentInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <p className="outside-note">
                    <strong>Note:</strong> This equipment will be marked as an outside equipment with company "OUTSIDE".
                  </p>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={closeOutsideEquipmentModal}>Cancel</button>
              <button className="save-button" onClick={handleAddOutsideEquipment}>Add Equipment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Equipments;