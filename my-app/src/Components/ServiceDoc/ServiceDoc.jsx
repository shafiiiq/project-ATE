'use client';
import React, { useEffect, useState } from 'react';
import './ServiceDoc.css';
import equipments from '../../equipments';
import logoImage from '../../assets/images/al-ansari.png';
import sign from '../../assets/images/sign.jpg';

const ServiceDoc = () => {
  const [filteredData, setFilteredData] = useState(equipments);
  const [remarks, setRemarks] = useState('');
  const [serviceHrs, setServiceHrs] = useState('');
  const [equipmentNo, setEquipmentNo] = useState('');
  const [nextServiceHrs, setNextServiceHrs] = useState('');
  const [machine, setMachine] = useState('');
  const [mechanics, setMechanics] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [mechanicSign, setMechanicSign] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const correctText = async (text) => {
    const response = await fetch('https://api.languagetoolplus.com/v2/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text,
        language: 'en-US',
      }),
    });

    const result = await response.json();
    let corrected = text;

    for (const match of result.matches.reverse()) {
      if (match.replacements.length > 0) {
        const replacement = match.replacements[0].value;
        corrected =
          corrected.slice(0, match.offset) +
          replacement +
          corrected.slice(match.offset + match.length);
      }
    }

    return corrected;
  };

  const formatText = (text) => {
    return text
      .toLowerCase()
      .replace(/(^\w|\.\s*\w|\bi\b)/g, (match) => match.toUpperCase());
  };

  useEffect(() => {
    const initializeData = async () => {
      setServiceHrs(formatText('7497'));
      setNextServiceHrs(formatText('7897'));
      setMechanics(formatText('Faisal, Sambath'));
      setDate(formatText('14/04/25'));
      // setMechanicSign(formatText(''));
      setEquipmentNo(formatText('7057'));
      setMachine(formatText('Skid loader'));
      setLocation('RLPP1');
      setOperatorName(formatText('Sarban keshy'));

      const correctedRemarks = await correctText(formatText('Engine oil changed, Oil filter changed'));
      setRemarks(correctedRemarks);
    };

    initializeData();
  }, []);

  const ifCheck = false;

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
              <th>STATUS</th>
              <th>SL.NO</th>
              <th>DESCRIPTION</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {/* Hardcoded checklist items */}
            <tr>
              <td>1</td>
              <td>Change Engine oil & Filter</td>
              <td>✓</td>
              <td>25</td>
              <td>Check Silencer</td>
              <td></td>
            </tr>
            <tr>
              <td>2</td>
              <td>Change Fuel Filter</td>
              <td>✓</td>
              <td>26</td>
              <td>Replace Hydraulic Oil- Filter</td>
              <td></td>
            </tr>
            <tr>
              <td>3</td>
              <td>{ifCheck ? "Check/Change Air Filter" : "Clean/Change Air Filter"}</td>
              <td>✓</td>
              <td>27</td>
              <td>Replace Transmission Oil</td>
              <td></td>
            </tr>
            <tr>
              <td>4</td>
              <td>Check Transmission Filter</td>
              <td>✓</td>
              <td>28</td>
              <td>Replace Differential Oil</td>
              <td></td>
            </tr>
            <tr>
              <td>5</td>
              <td>Check Power Steering Oil</td>
              <td>✓</td>
              <td>29</td>
              <td>Replace Steering Box Oil</td>
              <td></td>
            </tr>
            <tr>
              <td>6</td>
              <td>Check Hydraulic Oil</td>
              <td>✓</td>
              <td>30</td>
              <td>Check Engine Valve Clearence</td>
              <td></td>
            </tr>
            <tr>
              <td>7</td>
              <td>Check Brake</td>
              <td>✓</td>
              <td>31</td>
              <td>Replace clutch fluid</td>
              <td></td>
            </tr>
            <tr>
              <td>8</td>
              <td>Check Tyre Air Pressure</td>
              <td>✓</td>
              <td>32</td>
              <td>Check Brake Lining</td>
              <td></td>
            </tr>
            <tr>
              <td>9</td>
              <td>Check Oil Leak</td>
              <td>✓</td>
              <td>33</td>
              <td>Change Drive Belt</td>
              <td></td>
            </tr>
            <tr>
              <td>10</td>
              <td>Check Battery Condition</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>11</td>
              <td>Check Wiper & Water</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>12</td>
              <td>Check All Lights</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>13</td>
              <td>Check All Horns</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>14</td>
              <td>Check Parking Brake</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>15</td>
              <td>Check Differential Oil</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>16</td>
              <td>Check Rod Water & Hoses</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>17</td>
              <td>Lubricants All Points</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>18</td>
              <td>Check Gear Shift System</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>19</td>
              <td>Check Clutch System</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>20</td>
              <td>Check Wheel Nut</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>21</td>
              <td>Check Starter & Alternator</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>22</td>
              <td>Check Number Plate both</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>23</td>
              <td>Check Paint</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>24</td>
              <td>Check Tires</td>
              <td>✓</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            {/* ✅ Dynamic Remarks */}
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

            {/* ✅ Dynamic Footer Section */}
            <tr>
              <td colSpan="3"><strong>SERVICE HRS:</strong> {serviceHrs}</td>
              <td colSpan="3"><strong>EQUIPMENT NO:</strong> {equipmentNo}</td>
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
              <td colSpan="3"><strong>DATE:</strong> {date}</td>
              <td colSpan="3"><strong>OPERATOR NAME:</strong> {operatorName}</td>
            </tr>
            <tr className='sign-table'>
              <td colSpan="3"><strong>MECHANIC SIGN:</strong> {mechanicSign}</td>
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
