import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Users, Calendar, ClipboardList, CreditCard, MessageSquare, BarChart2, Settings, Sparkles, Stethoscope } from 'lucide-react';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',          icon: LayoutDashboard, group: 'main' },
  { id: 'clients',      label: 'Clients',             icon: Users,           group: 'main' },
  { id: 'appointments', label: 'Appointments',        icon: Calendar,        group: 'main' },
  { id: 'assessments',  label: 'Assessments',         icon: Stethoscope,     group: 'clinical' },
  { id: 'careplans',    label: 'Care Plans',          icon: ClipboardList,   group: 'clinical' },
  { id: 'billing',      label: 'Billing',             icon: CreditCard,      group: 'admin' },
  { id: 'messages',     label: 'Communications',      icon: MessageSquare,   group: 'admin' },
  { id: 'reports',      label: 'Reports & Analytics', icon: BarChart2,       group: 'admin' },
  { id: 'settings',     label: 'Settings',            icon: Settings,        group: 'system' },
];

const groupLabels = { main: 'OVERVIEW', clinical: 'CLINICAL', admin: 'ADMINISTRATION', system: 'SYSTEM' };

export default function Sidebar() {
  const { activePage, setActivePage, sidebarOpen, setSidebarOpen, setAiAssistantOpen } = useApp();

  // Close sidebar on mobile when page changes
  useEffect(() => {
    if (window.innerWidth <= 768) setSidebarOpen(false);
  }, [activePage, setSidebarOpen]);

  // Close on outside click (mobile)
  const handleBackdropClick = () => setSidebarOpen(false);

  const grouped = navItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div onClick={handleBackdropClick} className="sidebar-backdrop" style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
          backdropFilter: 'blur(2px)', zIndex: 99,
        }} />
      )}

      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 'var(--sidebar-width)',
        background: 'var(--sidebar-bg)',
        display: 'flex', flexDirection: 'column',
        zIndex: 100,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
        boxShadow: '2px 0 12px rgba(0,0,0,0.12)',
        overflowY: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 18px', height: 'var(--header-height)', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Stethoscope size={17} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#fff', lineHeight: 1.2 }}>NutriCare</div>
            <div style={{ fontSize: 10, color: 'var(--sidebar-text)', letterSpacing: '0.5px' }}>Clinical IMS</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '14px 10px' }}>
          {Object.entries(groupLabels).map(([key, label]) =>
            grouped[key] ? (
              <div key={key} style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(148,163,184,0.55)', letterSpacing: '1px', padding: '0 8px', marginBottom: 4 }}>{label}</div>
                {grouped[key].map(item => {
                  const Icon = item.icon;
                  const active = activePage === item.id;
                  return (
                    <button key={item.id} onClick={() => setActivePage(item.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      width: '100%', padding: '8px 10px', borderRadius: 7,
                      border: 'none', cursor: 'pointer',
                      background: active ? 'var(--accent)' : 'transparent',
                      color: active ? '#fff' : 'var(--sidebar-text)',
                      fontFamily: 'var(--font-body)', fontSize: 13.5,
                      fontWeight: active ? 600 : 400,
                      transition: 'var(--transition)', textAlign: 'left', marginBottom: 1,
                    }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--sidebar-hover)'; e.currentTarget.style.color = '#fff'; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-text)'; } }}
                    >
                      <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null
          )}
        </nav>

        {/* AI + User */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <button onClick={() => setAiAssistantOpen(true)} style={{
            width: '100%', padding: '9px 12px',
            background: 'rgba(37,99,235,0.22)', border: '1px solid rgba(37,99,235,0.35)',
            borderRadius: 8, color: '#93C5FD', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'var(--transition)', marginBottom: 10,
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,99,235,0.38)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,99,235,0.22)'}>
            <Sparkles size={14} />
            <span>NutriAI Assistant</span>
            <span style={{ marginLeft: 'auto', fontSize: 9, background: 'var(--accent)', color: '#fff', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>BETA</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 4px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#3B82F6,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>WK</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dr. Wanjiku Kariuki</div>
              <div style={{ fontSize: 11, color: 'var(--sidebar-text)' }}>Clinical Dietitian</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
