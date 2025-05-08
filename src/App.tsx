import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import BillingPage from './pages/BillingPage';
import CustomersPage from './pages/CustomersPage';
import ReportsPage from './pages/ReportsPage';
import Layout from './components/Layout';

function App() {
  // Mock authentication state
  const isAuthenticated = true;

  // Layout wrapper for authenticated routes
  const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
        <Route
          path="/"
          element={
            <AuthenticatedLayout>
              <DashboardPage />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/inventory"
          element={
            <AuthenticatedLayout>
              <InventoryPage />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/billing"
          element={
            <AuthenticatedLayout>
              <BillingPage />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/customers"
          element={
            <AuthenticatedLayout>
              <CustomersPage />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <AuthenticatedLayout>
              <ReportsPage />
            </AuthenticatedLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;