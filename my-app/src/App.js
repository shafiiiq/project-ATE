import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, createContext } from 'react';
import Home from './Components/Home/Home';
import ServiceDoc from './Components/ServiceDoc/ServiceDoc';
import ServiceForm from './Components/ServiceForm/ServiceForm';
import Equipments from './Components/Equipments/Equipments';
import ServiceHistory from './Components/ServiceHistory/ServiceHistory';
import ServiceHistoryForm from './Components/ServiceHistoryForm/ServiceHistoryForm';
import Notification from './Components/Notification/Notification';
import MechanicService from './Components/MechanicService/MechanicService';
import TyreHistoryForm from './Components/TyreHistoryForm/TyreHistoryForm';
import Stocks from './Components/Stocks/Stocks';
import StocksNavigation from './Components/StocksNavigation/StocksNavigation';
import MaintanceHistoryForm from './Components/MaintanceHistoryForm/MaintanceHistoryForm';
import EquipmentStockForm from './Components/EquipmentStockForm/EquipmentStockForm';
import EquipmentStocks from './Components/EquipmentStocks/EquipmentStocks';
import EquipmentUpdate from './Components/EquipmentUpdate/EquipmentUpdate';
import Header from './Components/Common/Header/Header';

// Create a context to share service report data between components
export const ServiceReportContext = createContext();

function HeaderWrapper() {
  const location = useLocation();
  const hideHeader = location.pathname === '/' || location.pathname.startsWith('/service-doc');
  return !hideHeader && <Header />;
}

function App() {
  // State to store the service report data
  const [serviceReportData, setServiceReportData] = useState(null);

  return (
    <ServiceReportContext.Provider value={{ serviceReportData, setServiceReportData }}>
      <Router>
        <HeaderWrapper />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service-doc" element={<ServiceDoc />} />
          <Route path="/service-doc/:regNo/:date" element={<ServiceDoc />} />
          <Route path="/service-form" element={<ServiceForm />} />
          <Route path="/equipments" element={<Equipments />} />
          <Route path="/service-history" element={<ServiceHistory />} />
          <Route path="/service-history/:regNo" element={<ServiceHistory />} />
          <Route path="/service-form/:regNo/:date/:serviceHrs/:nextServiceHrs" element={<ServiceForm />} />
          <Route path="/maintanance-history/:regNo" element={<ServiceHistory maintanance={true}/>} />
          <Route path="/tyre-history/:regNo" element={<MechanicService tyre={true}/>} />
          <Route path="/battery-history/:regNo" element={<MechanicService />} />
          <Route path="/service-history-form/:regNo" element={<ServiceHistoryForm />} />
          <Route path="/notification/next-full-service" element={<Notification />} />
          <Route path="/tyre-history-form/:regNo" element={<TyreHistoryForm />} />
          <Route path="/maintenance-history-form/:regNo" element={<MaintanceHistoryForm />} />
          <Route path="/stocks" element={<StocksNavigation />} />
          <Route path="/stocks/equipment-part-stocks" element={<Stocks />} />
          <Route path="/stocks/equipment-stocks" element={<EquipmentStocks />} />
          <Route path="/equipment-stocks-form" element={<EquipmentStockForm />} />
          <Route path="/equipment-updates" element={<EquipmentUpdate />} />
        </Routes>
      </Router>
    </ServiceReportContext.Provider>
  );
}

export default App;