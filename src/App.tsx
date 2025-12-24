import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider, AuthProvider, useAuth } from './context';
import { ProtectedLayout } from './components/layout';
import { initDB } from './services/db';

// Feature imports
import Dashboard from './features/dashboard/Dashboard';
import Login from './features/auth/Login';
import Sales from './features/sales/Sales';
import Customers from './features/customers/Customers';
import Devices from './features/devices/Devices';
import Packages from './features/packages/Packages';
import Navigation from './features/navigation/Navigation';
import Notifications from './features/notifications/Notifications';
import Inventory from './features/inventory/Inventory';
import Transactions from './features/transactions/Transactions';
import Reports from './features/reports/Reports';
import Installer from './features/installer/Installer';
import SettingsView from './features/settings/SettingsView';
import ComponentGallery from './features/gallery/ComponentGallery';

const AppRoutes = () => {
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={login} />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/installer" element={<Installer />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/gallery" element={<ComponentGallery />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
