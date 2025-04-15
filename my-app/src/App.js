import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, createContext } from 'react';
import Home from './Components/Home/Home';
import ServiceDoc from './Components/ServiceDoc/ServiceDoc';
import ServiceForm from './Components/ServiceForm/ServiceForm';
import Equipments from './Components/Equipments/Equipments';
import ServiceHistory from './Components/ServiceHistory/ServiceHistory';

// Create a context to share service report data between components
export const ServiceReportContext = createContext();

function App() {
  // State to store the service report data
  const [serviceReportData, setServiceReportData] = useState(null);

  return (
    <ServiceReportContext.Provider value={{ serviceReportData, setServiceReportData }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service-doc" element={<ServiceDoc />} />
          <Route path="/service-form" element={<ServiceForm />} />
          <Route path="/equipments" element={<Equipments />} />
          <Route path="/service-history" element={<ServiceHistory />} />
        </Routes>
      </Router>
    </ServiceReportContext.Provider>
  );
}

export default App;