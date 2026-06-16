import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import AiAssistant from './components/AiAssistant.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Clients from './pages/Clients.jsx';
import Appointments from './pages/Appointments.jsx';
import Assessments from './pages/Assessments.jsx';
import CarePlans from './pages/CarePlans.jsx';
import Billing from './pages/Billing.jsx';
import Messages from './pages/Messages.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import Portal from './portal/Portal.jsx';
import { trpc } from './lib/trpc';

const pages = {
  dashboard: Dashboard, clients: Clients, appointments: Appointments,
  assessments: Assessments, careplans: CarePlans, billing: Billing,
  messages: Messages, reports: Reports, settings: Settings,
};

function AdminApp({ user, userType, onLogout, onSwitchToPortal }) {
  const { activePage, sidebarOpen } = useApp();
  const PageComponent = pages[activePage] || Dashboard;
  
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Sidebar />
      <Header 
        user={user}
        userType={userType}
        onLogout={onLogout}
        onSwitchToPortal={userType === 'admin' ? onSwitchToPortal : null}
      />
      <main style={{
        marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 0,
        paddingTop: 'var(--header-height)',
        transition: 'margin-left 0.25s ease',
        minHeight: '100vh',
      }}>
        <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
          <PageComponent />
        </div>
      </main>
      <AiAssistant />
    </div>
  );
}

function ClientPortalApp({ user, onLogout, onBack }) {
  return (
    <Portal 
      user={user}
      onLogout={onLogout}
      onBack={onBack}
    />
  );
}

function AppLayout() {
  const [authState, setAuthState] = useState(null); // null | { user, userType }
  const [mode, setMode] = useState('auth'); // 'auth' | 'admin' | 'portal'

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    if (storedUser && storedUserType) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({ user, userType: storedUserType });
        // Set initial mode based on user type
        setMode(storedUserType === 'client' ? 'portal' : 'admin');
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
  }, []);

  const handleLoginSuccess = (user, userType) => {
    setAuthState({ user, userType });
    setMode(userType === 'client' ? 'portal' : 'admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setAuthState(null);
    setMode('auth');
  };

  const handleSwitchToPortal = () => {
    if (authState?.userType === 'admin') {
      setMode('portal');
    }
  };

  const handleBackFromPortal = () => {
    if (authState?.userType === 'admin') {
      setMode('admin');
    } else {
      handleLogout();
    }
  };

  // Show auth page if not logged in
  if (!authState) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  // Show appropriate interface based on mode
  if (mode === 'portal') {
    return (
      <ClientPortalApp 
        user={authState.user}
        onLogout={handleLogout}
        onBack={handleBackFromPortal}
      />
    );
  }

  return (
    <AdminApp 
      user={authState.user}
      userType={authState.userType}
      onLogout={handleLogout}
      onSwitchToPortal={handleSwitchToPortal}
    />
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
