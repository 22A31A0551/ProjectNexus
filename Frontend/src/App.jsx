import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ManagerDashboard from './pages/ManagerDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';

// Client Pages
import ClientLayout from './pages/client/ClientLayout';
import ClientLogin from './pages/client/ClientLogin';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ClientSupportActive from './pages/client/ClientSupportActive';
import ClientSupportClosed from './pages/client/ClientSupportClosed';
import ClientSupportPending from './pages/client/ClientSupportPending';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardOverview from './pages/admin/AdminDashboardOverview';
import AdminClients from './pages/admin/AdminClients';
import AdminProjects from './pages/admin/AdminProjects';
import AdminRequestsNew from './pages/admin/AdminRequestsNew';
import AdminRequestsActive from './pages/admin/AdminRequestsActive';
import AdminManagers from './pages/admin/AdminManagers';
import AdminDevelopers from './pages/admin/AdminDevelopers';
import AdminRevenue from './pages/admin/AdminRevenue';
import AdminHistory from './pages/admin/AdminHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardOverview />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="requests/new" element={<AdminRequestsNew />} />
          <Route path="requests/active" element={<AdminRequestsActive />} />
          <Route path="managers" element={<AdminManagers />} />
          <Route path="developers" element={<AdminDevelopers />} />
          <Route path="revenue" element={<AdminRevenue />} />
          <Route path="history" element={<AdminHistory />} />
        </Route>

        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/developer" element={<DeveloperDashboard />} />
        
        {/* Client Routes */}
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="projects" element={<ClientProjects />} />
          <Route path="support/active" element={<ClientSupportActive />} />
          <Route path="support/closed" element={<ClientSupportClosed />} />
          <Route path="support/pending" element={<ClientSupportPending />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
