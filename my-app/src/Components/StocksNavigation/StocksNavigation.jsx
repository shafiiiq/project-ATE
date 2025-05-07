import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../StocksNavigation/StocksNavigation.css';

const StocksNavigation = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="stocks-navigation-container">
      <div className="background-overlay"></div>
      
      <div className="navigation-content">
        <h1 className="navigation-title">Inventory Management</h1>
        
        <div className="navigation-boxes">
          <div 
            className="navigation-box equipment-box"
            onClick={() => handleNavigation('/stocks/eqipment-stocks')}
          >
            <div className="box-content">
              <div className="box-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12" y2="18"></line>
                  <line x1="9" y1="6" x2="15" y2="6"></line>
                  <line x1="9" y1="10" x2="15" y2="10"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
              </div>
              <h2>Equipment</h2>
              <p>Manage all equipment inventory</p>
            </div>
          </div>
          
          <div 
            className="navigation-box spare-parts-box"
            onClick={() => handleNavigation('/stocks/spare-parts')}
          >
            <div className="box-content">
              <div className="box-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M14.31 8l5.74 9.94"></path>
                  <path d="M9.69 8h11.48"></path>
                  <path d="M7.38 12l5.74-9.94"></path>
                  <path d="M7.38 12l5.74 9.94"></path>
                  <path d="M3.95 17.94l5.74-9.94"></path>
                  <path d="M2.83 8h11.48"></path>
                </svg>
              </div>
              <h2>Spare Parts</h2>
              <p>Browse and manage spare parts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StocksNavigation;