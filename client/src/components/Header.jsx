import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, Bell, Search, X, CheckCheck, ExternalLink, LogOut } from 'lucide-react';

const pageLabels = {
  dashboard: 'Dashboard', clients: 'Client Management', appointments: 'Appointments',
  assessments: 'Clinical Assessments', careplans: 'Care Plans', billing: 'Billing & Payments',
  messages: 'Communications', reports: 'Reports & Analytics', settings: 'Settings',
};

export default function Header({ user, userType, onLogout, onSwitchToPortal }) {
  const { activePage, sidebarOpen, setSidebarOpen, notifications, markAllRead, unreadCount } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const notifColors = { alert: '#DC2626', appointment: '#059669', payment: '#059669', message: '#2563EB' };

  return (
    <header style={{
      position: 'fixed', top: 0,
      left: sidebarOpen ? 'var(--sidebar-width)' : 0,
      right: 0, height: 'var(--header-height)',
      background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)',
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12,
      zIndex: 50, transition: 'left 0.25s ease', boxShadow: 'var(--shadow-xs)',
    }}>
      {/* Sidebar toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
        background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
        padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'var(--transition)', flexShrink: 0,
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
        <Menu size={19} />
      </button>

      {/* Logo and Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <img src="/manus-storage/afyalink-logo_5123d512.png" alt="AFyalink" style={{ height: 32, width: 'auto' }} />
        <span style={{ fontSize: 12, color: '#6BA82E', fontWeight: 600 }}>AFyalink</span>
        <span style={{ fontSize: 12, color: 'var(--border-default)' }}>/</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
          {pageLabels[activePage]}
        </h1>
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div style={{ position: 'relative', flexShrink: 1, minWidth: 0 }}>
        <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-placeholder)', pointerEvents: 'none' }} />
        <input value={searchVal} onChange={e => setSearchVal(e.target.value)}
          placeholder="Search clients, appointments…"
          style={{
            background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)',
            borderRadius: 8, padding: '7px 12px 7px 32px', color: 'var(--text-primary)',
            fontSize: 13, width: 220, outline: 'none', fontFamily: 'var(--font-body)', transition: 'var(--transition)',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.background = 'var(--bg-surface-2)'; e.target.style.boxShadow = 'none'; }} />
        {searchVal && (
          <button onClick={() => setSearchVal('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
            <X size={12} />
          </button>
        )}
      </div>

      {/* Date */}
      <div style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>
        {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
      </div>

      {/* Client Portal button - Only show for admin users */}
      {userType === 'admin' && onSwitchToPortal && (
        <button onClick={onSwitchToPortal} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '6px 12px', background: 'var(--accent-light)', border: '1px solid var(--accent-mid)',
          borderRadius: 8, color: 'var(--accent)', cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
          fontFamily: 'var(--font-body)', transition: 'var(--transition)', whiteSpace: 'nowrap', flexShrink: 0,
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-mid)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-light)'}>
          <ExternalLink size={12} />
          Client Portal
        </button>
      )}

      {/* User Menu */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
          background: userMenuOpen ? 'var(--bg-surface-2)' : 'none',
          border: `1px solid ${userMenuOpen ? 'var(--border-default)' : 'transparent'}`,
          cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 8,
          padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 8, position: 'relative', transition: 'var(--transition)',
          fontSize: 13, fontWeight: 500,
        }}
          onMouseEnter={e => { if (!userMenuOpen) { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.borderColor = 'var(--border-light)'; } }}
          onMouseLeave={e => { if (!userMenuOpen) { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'transparent'; } }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</span>
        </button>

        {userMenuOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 200,
            background: 'var(--bg-surface)', border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', zIndex: 200,
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', fontSize: 12, color: 'var(--text-muted)' }}>
              {user?.email}
            </div>
            <button onClick={() => { onLogout(); setUserMenuOpen(false); }} style={{
              width: '100%', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
              color: '#DC2626', fontSize: 13, fontWeight: 500, textAlign: 'left', transition: 'var(--transition)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button onClick={() => setNotifOpen(!notifOpen)} style={{
          background: notifOpen ? 'var(--bg-surface-2)' : 'none',
          border: `1px solid ${notifOpen ? 'var(--border-default)' : 'transparent'}`,
          cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 8,
          padding: 7, display: 'flex', alignItems: 'center', position: 'relative', transition: 'var(--transition)',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-2)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
          onMouseLeave={e => { if (!notifOpen) { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'transparent'; } }}>
          <Bell size={17} />
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: 3, right: 3, width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', border: '2px solid var(--bg-surface)' }} />
          )}
        </button>

        {notifOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 340,
            background: 'var(--bg-surface)', border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', zIndex: 200,
            animation: 'scaleIn 0.15s ease forwards', transformOrigin: 'top right',
          }}>
            <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>Notifications</span>
              {unreadCount > 0 && <span style={{ fontSize: 11, background: 'var(--danger-light)', color: 'var(--danger)', padding: '2px 7px', borderRadius: 20, border: '1px solid var(--danger-mid)', fontWeight: 600 }}>{unreadCount} new</span>}
              <button onClick={markAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCheck size={12} /> All read
              </button>
            </div>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {notifications.map(n => (
                <div key={n.id} style={{ padding: '11px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: 10, alignItems: 'flex-start', background: n.read ? 'transparent' : 'rgba(37,99,235,0.02)', transition: 'var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'rgba(37,99,235,0.02)'}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: notifColors[n.type] || 'var(--accent)', marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: n.read ? 'var(--text-muted)' : 'var(--text-primary)', lineHeight: 1.4 }}>{n.message}</p>
                    <span style={{ fontSize: 11, color: 'var(--text-placeholder)' }}>{n.time}</span>
                  </div>
                  {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginTop: 6, flexShrink: 0 }} />}
                </div>
              ))}
            </div>
            <div style={{ padding: '9px 16px', textAlign: 'center', borderTop: '1px solid var(--border-light)' }}>
              <button onClick={() => setNotifOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
