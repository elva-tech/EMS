// src/App.jsx
// UPDATED WITH MODULE 2 ROUTES

import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/LoginPage';
import Layout from './components/layout/Layout';

// Module 1 Components
import InwardModule from './components/inward/InwardModule';
import OutwardModule from './components/outward/OutwardModule';
import StockDashboard from './components/stock/StockDashboard';

// Module 2 Components
import DWAModule from './Module 2/dwa/DWAModule';
import DIModule from './Module 2/DeliveryInstructions/DIModule';
import WorkOrderModule from './Module 2/workOrder/WorkOrderModule';
import IndentModule from './Module 2/indent/IndentModule';
import InventoryModule from './Module 2/inventory/InventoryModule';
import BillingModule from './Module 2/billing/BillingModule';

const App = () => {
  const { isAuthenticated } = useAuth();
  const [currentModule, setCurrentModule] = useState('inward');
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  const renderModule = () => {
    switch (currentModule) {
      // Module 1
      case 'inward':
        return <InwardModule />;
      case 'outward':
        return <OutwardModule />;
      case 'stock':
        return <StockDashboard />;
      
      // Module 2
      case 'dwa':
        return <DWAModule />;
      case 'di':
        return <DIModule />;
      case 'workorder':
        return <WorkOrderModule />;
      case 'indent':
        return <IndentModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'billing':
        return <BillingModule />;
      
      default:
        return <InwardModule />;
    }
  };
  
  return (
    <Layout currentPage={currentModule} setCurrentPage={setCurrentModule}>
      {renderModule()}
    </Layout>
  );
};

export default App;