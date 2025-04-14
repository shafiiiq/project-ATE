import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import ServiceDoc from './Components/ServiceDoc/ServiceDoc';
import ServiceForm from './Components/ServiceForm/ServiceForm';
import Equipments from './Components/Equipments/Equipments';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/service-doc" element={<ServiceDoc />} />
        <Route path="/service-form" element={<ServiceForm />} />
        <Route path="/equipments" element={<Equipments />} />
      </Routes>
    </Router>
  );
}

export default App;
