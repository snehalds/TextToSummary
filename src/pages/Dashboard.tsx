// src/pages/Dashboard.tsx
import React from 'react';
import DocumentList from '../components/DocumentList';

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Document Viewer</h1>
      <DocumentList productId="18" /> {/* Hardcoded product ID */}
    </div>
  );
};

export default Dashboard;