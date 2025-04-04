import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';
import Dashboard from './pages/Dashboard';

function App() {
  const productId = '18'; // Replace with actual productId

  return (
    <Router>

      <Dashboard />
    </Router>
  );
}

export default App;