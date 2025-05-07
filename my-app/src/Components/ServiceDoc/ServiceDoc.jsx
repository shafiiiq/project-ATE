'use client';
import React, { useEffect, useState } from 'react';
import './ServiceDoc.css';
import logoImage from '../../assets/images/al-ansari.png';
import alAnsariText from '../../assets/images/al-ansari-text.png';
import sign from '../../assets/images/sign.jpg';
import { useParams, useNavigate } from 'react-router-dom';

const ServiceDoc = () => {
  const { regNo, date } = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3001/service-report/get-service-report/${regNo}/${date}`, {
      method: "GET",
      headers: {
        "Accept": "*/*",
        'Content-Type': 'application/json'
      },
    })
      .then((result) => result.json())
      .then((data) => {
        console.log("this is the data ", data.data[0]);
        setReportData(data.data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching report data:", error);
        setLoading(false);
      });
  }, [regNo, date]);

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[0]}-${parts[1]}-${parts[2]}`;
    }
    return dateString;
  };

  const formattedDate = formatDate(date);
  const ifClean = true;

  const handlePrint = () => {
    window.print();
  };

  const handleAddReport = () => {
    navigate('/service-form');
  };

  // If loading, show a loading state
  if (loading) {
    return <div className="loading-container">Loading report data...</div>;
  }

  // If no data is found after loading
  if (!reportData) {
    return (
      <div className="no-data-container">
        <h2>No report data available for this equipment and date</h2>
        <button className="add-report-button" onClick={handleAddReport}>
          Add Report Data
        </button>
      </div>
    );
  }

  const checklistLookup = {};
  if (reportData.checklistItems && reportData.checklistItems.length > 0) {
    reportData.checklistItems.forEach(item => {
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
            <img src={alAnsariText} alt="AL Ansari Transport & Enterprises W.L.L" />
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
              <td className='tick'>{checklistLookup[1] || ''}</td>
              <td>25</td>
              <td>Check Silencer</td>
              <td>{checklistLookup[25] || ''}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Change Fuel Filter</td>
              <td className='tick'>{checklistLookup[2] || ''}</td>
              <td>26</td>
              <td>Replace Hydraulic Oil- Filter</td>
              <td>{checklistLookup[26] || ''}</td>
            </tr>
            <tr>
              <td>3</td>
              <td>{ifClean ? "Check/Clean Air Filter" : "Check/Change Air Filter"}</td>
              <td className='tick'>{checklistLookup[3] || ''}</td>
              <td>27</td>
              <td>Replace Transmission Oil</td>
              <td>{checklistLookup[27] || ''}</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Check Transmission Filter</td>
              <td className='tick'>{checklistLookup[4] || ''}</td>
              <td>28</td>
              <td>Replace Differential Oil</td>
              <td>{checklistLookup[28] || ''}</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Check Power Steering Oil</td>
              <td className='tick'>{checklistLookup[5] || ''}</td>
              <td>29</td>
              <td>Replace Steering Box Oil</td>
              <td>{checklistLookup[29] || ''}</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Check Hydraulic Oil</td>
              <td className='tick'>{checklistLookup[6] || ''}</td>
              <td>30</td>
              <td>Check Engine Valve Clearence</td>
              <td>{checklistLookup[30] || ''}</td>
            </tr>
            <tr>
              <td>7</td>
              <td>Check Brake</td>
              <td className='tick'>{checklistLookup[7] || ''}</td>
              <td>31</td>
              <td>Replace clutch fluid</td>
              <td>{checklistLookup[31] || ''}</td>
            </tr>
            <tr>
              <td>8</td>
              <td>Check Tyre Air Pressure</td>
              <td className='tick'>{checklistLookup[8] || ''}</td>
              <td>32</td>
              <td>Check Brake Lining</td>
              <td>{checklistLookup[32] || ''}</td>
            </tr>
            <tr>
              <td>9</td>
              <td>Check Oil Leak</td>
              <td className='tick'>{checklistLookup[9] || ''}</td>
              <td>33</td>
              <td>Change Drive Belt</td>
              <td>{checklistLookup[33] || ''}</td>
            </tr>
            <tr>
              <td>10</td>
              <td>Check Battery Condition</td>
              <td className='tick'>{checklistLookup[10] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>11</td>
              <td>Check Wiper & Water</td>
              <td className='tick'>{checklistLookup[11] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>12</td>
              <td>Check All Lights</td>
              <td className='tick'>{checklistLookup[12] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>13</td>
              <td>Check All Horns</td>
              <td className='tick'>{checklistLookup[13] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>14</td>
              <td>Check Parking Brake</td>
              <td className='tick'>{checklistLookup[14] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>15</td>
              <td>Check Differential Oil</td>
              <td className='tick'>{checklistLookup[15] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>16</td>
              <td>Check Rod Water & Hoses</td>
              <td className='tick'>{checklistLookup[16] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>17</td>
              <td>Lubricants All Points</td>
              <td className='tick'>{checklistLookup[17] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>18</td>
              <td>Check Gear Shift System</td>
              <td className='tick'>{checklistLookup[18] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>19</td>
              <td>Check Clutch System</td>
              <td className='tick'>{checklistLookup[19] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>20</td>
              <td>Check Wheel Nut</td>
              <td className='tick'>{checklistLookup[20] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>21</td>
              <td>Check Starter & Alternator</td>
              <td className='tick'>{checklistLookup[21] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>22</td>
              <td>Check Number Plate both</td>
              <td className='tick'>{checklistLookup[22] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>23</td>
              <td>Check Paint</td>
              <td className='tick'>{checklistLookup[23] || ''}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>24</td>
              <td>Check Tires</td>
              <td className='tick'>{checklistLookup[24] || ''}</td>
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
                    {reportData.remarks}
                  </div>
                </div>
                <span className="equipment-fit-to-work">
                  Equipment fit to work
                </span>
              </td>
            </tr>

            {/* Footer Section */}
            <tr>
              <td colSpan="3"><strong>SERVICE HRS:</strong> {reportData.serviceHrs}</td>
              <td colSpan="3"><strong>EQUIPMENT NO:</strong> {regNo}</td>
            </tr>
            <tr>
              <td colSpan="3"><strong>NEXT SERVICE HRS:</strong> {reportData.nextServiceHrs}</td>
              <td colSpan="3"><strong>MACHINE:</strong> {reportData.machine}</td>
            </tr>
            <tr>
              <td colSpan="3"><strong>MECHANICS:</strong> {reportData.mechanics}</td>
              <td colSpan="3"><strong>LOCATION:</strong> {reportData.location}</td>
            </tr>
            <tr>
              <td colSpan="3"><strong>DATE:</strong> {formattedDate}</td>
              <td colSpan="3"><strong>OPERATOR NAME:</strong> {reportData.operatorName}</td>
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