import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FileProvider } from './context/FileContext';
import Header from './components/Header';
import Tabs from './components/Tabs';
import DefaultSummarization from './pages/DefaultSummarization';
import CustomSummarization from './pages/CustomSummarization';
import FileUpload from './components/FileUpload';
import './index.css';

function App() {
  const productId = '18'; // Replace with actual productId

  return (
    <Router>
      <FileProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="container mx-auto p-6">
            {/* Global FileUpload Component */}
            <FileUpload productId={productId} />

            {/* Tabs for switching between pages */}
            <Tabs />
            
            {/* Routes for both types of Summarization */}
            <Routes>
              <Route path="/" element={<DefaultSummarization />} />
              <Route path="/custom" element={<CustomSummarization />} />
            </Routes>
          </div>
        </div>
      </FileProvider>
    </Router>
  );
}

export default App;