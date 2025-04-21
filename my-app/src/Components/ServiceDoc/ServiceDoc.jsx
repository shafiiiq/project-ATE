'use client';
import React from 'react';
import './ServiceDoc.css';
import logoImage from '../../assets/images/al-ansari.png';
import sign from '../../assets/images/sign.jpg';

const ServiceDoc = ({ serviceData }) => {
  // Extract data from props or use default values if not available
  const {
    regNo = '',
    date = '',
    serviceHrs = '',
    nextServiceHrs = '',
    airFilter = '',
    serviceReport = []
  } = serviceData || {};

  // Get the first service report (assuming there's at least one)
  const report = serviceReport && serviceReport.length > 0 ? serviceReport[0] : {};
  
  // Extract data from the report
  const {
    machine = '',
    mechanics = '',
    location = '',
    operatorName = '',
    remarks = '',
    checklistItems = []
  } = report;

  // Format date from YYYY-MM-DD to DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Check if dateString is in YYYY-MM-DD format
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString; // Return original if format doesn't match
  };

  const formattedDate = formatDate(date);

  // Determine if air filter was cleaned or changed
  const ifClean = airFilter === 'Clean';

  const handlePrint = () => {
    window.print();
  };

  // Create an object to lookup checklist items by ID
  const checklistLookup = {};
  if (checklistItems && checklistItems.length > 0) {
    checklistItems.forEach(item => {
      checklistLookup[item.id] = item.status;
    });
  }

  return (
    <>
      <div className="print-button-wrapper no-print">
        <button onClick={handlePrint}>🖨️ Print Report</button>
      </div>
      <div className="report-container">
        <div className="header">
          <div className="logo-placeholder">
            <img src={logoImage} alt="Company Logo" />
          </div>
          <div className="company-details-s">
            <div className="company-name-s">AI Ansari Transport & Enterprises W.L.L</div>
            <div>Office No.2 Floor No.1 Gate No.3 Town Centre</div>
            <div>Bin Omran, Doha, Qatar, P.O BOX-1265</div>
            <div className="contract-wrap-s">
              <div className="phone-s">
                <span>Tel: +974 44505 700/800</span>
                <span>Fax: +974 44505 900</span>
              </div>
              <div className="email-s">
                <span>info@ansarigroup.co</span>
                <span>www.ansarigroup.co</span>
              </div>
            </div>
          </div>
        </div>

        <table className="checklist-table-s">
          <thead>
            <tr>
              <th colSpan="6" className="heading">PERIODIC SERVICE REPORT</th>
            </tr>
            <tr>
              <th>SL.NO</th>
              <th>DESCRIPTION</th>
              <th>CHECKED</th>
              <th>SL.NO</th>
              <th>DESCRIPTION</th>
              <th>CHECKED</th>
            </tr>
          </thead>
          <tbody>
            {/* First 24 checklist items - 24 rows with left and right columns */}
            <tr>
              <td>1</td>
              <td>Change Engine oil & Filter</td>
              <td>{checklistLookup[1] || ''}</td>
              <td>25</td>
              <td>Check Silencer</td>
              <td>{checklistLookup[25] || ''}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Change Fuel Filter</td>
              <td>{checklistLookup[2] || ''}</td>
              <td>26</td>
              <td>Replace Hydraulic Oil- Filter</td>
              <td>{checklistLookup[26] || ''}</td>
            </tr>
            <tr>
              <td>3</td>
              <td>{ifClean ? "Check/Clean Air Filter" : "Check/Change Air Filter"}</td>
              <td>{checklistLookup[3] || ''}</td>
              <td>27</td>
              <td>Replace Transmission Oil</td>
              <td>{checklistLookup[27] || ''}</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Check Transmission Filter</td>
              <td>{checklistLookup[4] || ''}</td>
              <td>28</td>
              <td>Replace Differential Oil</td>
              <td>{checklistLookup[28] || ''}</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Check Power Steering Oil</td>
              <td>{checklistLookup[5] || ''}</td>
              <td>29</td>
              <td>Replace Steering Box Oil</td>
              <td>{checklistLookup[29] || ''}</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Check Hydraulic Oil</td>
              <td>{checklistLookup[6] || ''}</td>
              <td>30</td>
              <td>Check Engine Valve Clearence</td>
              <td>{checklistLookup[30] || ''}</td>
            </tr>
            <tr>
              <td>7</td>
              <td>Check Brake</td>
              <td>{checklistLookup[7] || ''}</td>
              <td>31</td>
              <td>Replace clutch fluid</td>
              <td>{checklistLookup[31] || ''}</td>
            </tr>
            <tr>
              <td>8</td>
              <td>Check Tyre Air Pressure</td>
              <td>{checklistLookup[8] || ''}</td>
              <td>32</td>
              <td>Check Brake Lining</td>
              <td>{checklistLookup[32] || ''}</td>
            </tr>
            <tr>
              <td>9</td>
              <td>Check Oil Leak</td>
              <td>{checklistLookup[9] || ''}</td>
              <td>33</td>
              <td>Change Drive Belt</td>
              <td>{checklistLookup[33] || ''}</td>
            </tr>
            <tr>
              <td>10</td>
              <td>Check Battery Condition</td>
              <td>{checklistLookup[10] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>11</td>
              <td>Check Wiper & Water</td>
              <td>{checklistLookup[11] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>12</td>
              <td>Check All Lights</td>
              <td>{checklistLookup[12] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>13</td>
              <td>Check All Horns</td>
              <td>{checklistLookup[13] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>14</td>
              <td>Check Parking Brake</td>
              <td>{checklistLookup[14] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>15</td>
              <td>Check Differential Oil</td>
              <td>{checklistLookup[15] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>16</td>
              <td>Check Rod Water & Hoses</td>
              <td>{checklistLookup[16] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>17</td>
              <td>Lubricants All Points</td>
              <td>{checklistLookup[17] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>18</td>
              <td>Check Gear Shift System</td>
              <td>{checklistLookup[18] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>19</td>
              <td>Check Clutch System</td>
              <td>{checklistLookup[19] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>20</td>
              <td>Check Wheel Nut</td>
              <td>{checklistLookup[20] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>21</td>
              <td>Check Starter & Alternator</td>
              <td>{checklistLookup[21] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>22</td>
              <td>Check Number Plate both</td>
              <td>{checklistLookup[22] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>23</td>
              <td>Check Paint</td>
              <td>{checklistLookup[23] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>24</td>
              <td>Check Tires</td>
              <td>{checklistLookup[24] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            {/* Remarks Row */}
            <tr className="remarks-row">
              <td colSpan="6">
                <div className="remarks-box">
                  <div className="remarks-text">
                    <strong>REMARKS : </strong>
                    {remarks}
                  </div>
                </div>
                <span className="equipment-fit-to-work">
                  Equipment fit to work
                </span>
              </td>
            </tr>

            {/* Footer Section */}
            <tr>
              <td colSpan="3"><strong>SERVICE HRS:</strong> {serviceHrs}</td>
              <td colSpan="3"><strong>EQUIPMENT NO:</strong> {regNo}</td>
            </tr>
            <tr>
              <td colSpan="3"><strong>NEXT SERVICE HRS:</strong> {nextServiceHrs}</td>
              <td colSpan="3"><strong>MACHINE:</strong> {machine}</td>
            </tr>
            <tr>
              <td colSpan="3"><strong>MECHANICS:</strong> {mechanics}</td>
              <td colSpan="3"><strong>LOCATION:</strong> {location}</td>
            </tr>
            <tr>
              <td colSpan="3"><strong>DATE:</strong> {formattedDate}</td>
              <td colSpan="3"><strong>OPERATOR NAME:</strong> {operatorName}</td>
            </tr>
            <tr className='sign-table'>
              <td colSpan="3"><strong>MECHANIC SIGN:</strong></td>
              <td colSpan="3"><strong>SUPERVISOR SIGN:</strong>
                <img className='sign' src={sign} alt="" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ServiceDoc;