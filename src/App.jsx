import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';

// Auth Pages
import LoginPage from './components/auth/LoginPage';
import ManagerLoginPage from './components/auth/ManagerLoginPage';

// Layouts
import Layout from './components/layout/Layout';
import ManagerLayout from './Module 2/layout/ManagerLayout';

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
  const { isAuthenticated, user } = useAuth();
  // Keep this name consistent everywhere
  const [currentModule, setCurrentModule] = useState('stock');
  
  const isManagerRoute = window.location.pathname.includes('/manager');

  // 1. LOGIN REDIRECTION
  if (!isAuthenticated) {
    return isManagerRoute ? <ManagerLoginPage /> : <LoginPage />;
  }

  // 2. MANAGER WORLD (Shows EVERYTHING)
  if (user?.role === 'manager') {
    return (
      <ManagerLayout currentPage={currentModule} setCurrentPage={setCurrentModule}>
        {currentModule === 'stock' && <StockDashboard />}
        {currentModule === 'inward' && <InwardModule />}
        {currentModule === 'outward' && <OutwardModule />}
        {currentModule === 'dwa' && <DWAModule />}
        {currentModule === 'di' && <DIModule />}
        {currentModule === 'workorder' && <WorkOrderModule />}
        {currentModule === 'indent' && <IndentModule />}
        {currentModule === 'inventory' && <InventoryModule />}
        {currentModule === 'billing' && <BillingModule />}
      </ManagerLayout>
    );
  }

  // 3. ADMIN WORLD (Store Only)
  // FIXED: Changed setCurrentPage={setCurrentPage} to setCurrentPage={setCurrentModule}
  return (
    <Layout currentPage={currentModule} setCurrentPage={setCurrentModule}>
      {currentModule === 'stock' && <StockDashboard />}
      {currentModule === 'inward' && <InwardModule />}
      {currentModule === 'outward' && <OutwardModule />}
    </Layout>
  );
};

export default App;