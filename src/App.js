import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AiAssistant from './components/AiAssistant';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Appointments from './pages/Appointments';
import Assessments from './pages/Assessments';
import CarePlans from './pages/CarePlans';
import Billing from './pages/Billing';
import Messages from './pages/Messages';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Portal from './portal/Portal';

const pages = {
  dashboard: Dashboard, clients: Clients, appointments: Appointments,
  assessments: Assessments, careplans: CarePlans, billing: Billing,
  messages: Messages, reports: Reports, settings: Settings,
};

function AdminApp({ onSwitchToPortal }) {
  const { activePage, sidebarOpen } = useApp();
  const PageComponent = pages[activePage] || Dashboard;
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Sidebar />
      <Header onSwitchToPortal={onSwitchToPortal} />
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

function AppLayout() {
  const [mode, setMode] = useState('admin'); // 'admin' | 'portal' | 'landing'
  if (mode === 'portal') return <Portal onBack={() => setMode('admin')} />;
  if (mode === 'landing') return <LandingPage onAdmin={() => setMode('admin')} onPortal={() => setMode('portal')} />;
  return <AdminApp onSwitchToPortal={() => setMode('portal')} />;
}

function LandingPage({ onAdmin, onPortal }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F0F2F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 540, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(37,99,235,0.3)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 30, fontWeight: 800, color: '#111827', marginBottom: 8 }}>AFyalink IMS</h1>
        <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 36 }}>Clinical Nutrition & Information Management System</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onAdmin} style={{ padding: '14px 32px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            Admin / Dietitian Login
          </button>
          <button onClick={onPortal} style={{ padding: '14px 32px', background: '#fff', color: '#2563EB', border: '1px solid #BFDBFE', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
            Client Portal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
