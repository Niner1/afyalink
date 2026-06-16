import React from 'react';

export function Card({ children, style = {}, hover = false, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: hov ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transition: 'var(--transition)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}>{children}</div>
  );
}

export function StatCard({ icon: Icon, label, value, sub, color = 'var(--accent)', trend }) {
  return (
    <Card style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} strokeWidth={2} />
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: trend >= 0 ? 'var(--success)' : 'var(--danger)',
            background: trend >= 0 ? 'var(--success-light)' : 'var(--danger-light)',
            padding: '3px 8px', borderRadius: 20, border: `1px solid ${trend >= 0 ? 'var(--success-mid)' : 'var(--danger-mid)'}`,
          }}>{trend >= 0 ? '+' : ''}{trend}%</span>
        )}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-placeholder)', marginTop: 2 }}>{sub}</div>}
    </Card>
  );
}

const badgeDefs = {
  success: { bg: 'var(--success-light)', color: 'var(--success)', border: 'var(--success-mid)' },
  danger:  { bg: 'var(--danger-light)',  color: 'var(--danger)',  border: 'var(--danger-mid)'  },
  warning: { bg: 'var(--warning-light)', color: 'var(--warning)', border: 'var(--warning-mid)' },
  info:    { bg: 'var(--info-light)',    color: 'var(--info)',    border: 'var(--info-mid)'    },
  accent:  { bg: 'var(--accent-light)',  color: 'var(--accent)',  border: 'var(--accent-mid)'  },
  violet:  { bg: 'var(--violet-light)',  color: 'var(--violet)',  border: 'var(--violet-mid)'  },
  default: { bg: 'var(--bg-surface-3)', color: 'var(--text-muted)', border: 'var(--border-light)' },
};

export function Badge({ children, variant = 'default', style = {} }) {
  const s = badgeDefs[variant] || badgeDefs.default;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontSize: 11, fontWeight: 600,
      padding: '2px 8px', borderRadius: 20,
      letterSpacing: '0.1px', whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
}

export function Button({ children, variant = 'primary', size = 'md', icon: Icon, onClick, disabled, style = {}, ...props }) {
  const [hov, setHov] = React.useState(false);
  const V = {
    primary:   { bg: hov ? 'var(--accent-hover)' : 'var(--accent)', color: '#fff', border: 'transparent', shadow: hov ? 'var(--shadow-md)' : 'var(--shadow-sm)' },
    secondary: { bg: hov ? 'var(--bg-surface-3)' : 'var(--bg-surface)', color: 'var(--text-secondary)', border: 'var(--border-default)', shadow: 'none' },
    ghost:     { bg: hov ? 'var(--bg-surface-2)' : 'transparent', color: hov ? 'var(--text-primary)' : 'var(--text-muted)', border: 'transparent', shadow: 'none' },
    danger:    { bg: hov ? 'var(--danger)' : 'var(--danger-light)', color: hov ? '#fff' : 'var(--danger)', border: hov ? 'transparent' : 'var(--danger-mid)', shadow: 'none' },
  };
  const S = { sm: { padding: '5px 12px', fontSize: 12 }, md: { padding: '8px 16px', fontSize: 13 }, lg: { padding: '11px 22px', fontSize: 14 } };
  const v = V[variant] || V.primary; const s = S[size] || S.md;
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: disabled ? 'var(--bg-surface-3)' : v.bg,
        color: disabled ? 'var(--text-placeholder)' : v.color,
        border: `1px solid ${v.border}`,
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-body)', fontWeight: 500,
        boxShadow: v.shadow,
        transition: 'var(--transition)',
        ...s, ...style,
      }} {...props}>
      {Icon && <Icon size={13} strokeWidth={2} />}{children}
    </button>
  );
}

export function Input({ label, error, style = {}, ...props }) {
  const [foc, setFoc] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <input onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        style={{
          background: 'var(--bg-input)',
          border: `1px solid ${error ? 'var(--danger)' : foc ? 'var(--border-focus)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-md)', padding: '8px 11px',
          color: 'var(--text-primary)', fontSize: 13.5,
          fontFamily: 'var(--font-body)', outline: 'none',
          boxShadow: foc ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none',
          transition: 'var(--transition)', width: '100%', ...style,
        }} {...props} />
      {error && <span style={{ fontSize: 11.5, color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
}

export function Select({ label, children, style = {}, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <select style={{
        background: 'var(--bg-input)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)', padding: '8px 11px',
        color: 'var(--text-primary)', fontSize: 13.5,
        fontFamily: 'var(--font-body)', outline: 'none', cursor: 'pointer', width: '100%', ...style,
      }} {...props}>{children}</select>
    </div>
  );
}

export function Avatar({ name, size = 36 }) {
  const initials = name ? name.split(' ').map(n => n[0]).slice(0, 2).join('') : '?';
  const palette = ['#2563EB','#059669','#7C3AED','#DC2626','#D97706','#0891B2'];
  const c = palette[(name?.charCodeAt(0) || 0) % palette.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: c + '18', border: `1.5px solid ${c}40`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.33, fontWeight: 700, color: c,
      fontFamily: 'var(--font-display)', flexShrink: 0,
    }}>{initials}</div>
  );
}

export function Modal({ open, onClose, title, children, width = 560 }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(3px)' }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: width,
        background: 'var(--bg-surface)', border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)',
        animation: 'scaleIn 0.18s ease forwards', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1, padding: '2px 6px', borderRadius: 4 }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export function ProgressBar({ value, max = 100, color = 'var(--accent)', height = 6 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ width: '100%', height, background: 'var(--bg-surface-3)', borderRadius: height, border: '1px solid var(--border-light)' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: height, transition: 'width 0.5s ease' }} />
    </div>
  );
}

export function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', gap: 0 }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
          padding: '9px 18px',
          border: 'none', cursor: 'pointer', background: 'transparent',
          color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
          fontFamily: 'var(--font-body)',
          borderBottom: `2px solid ${activeTab === tab.id ? 'var(--accent)' : 'transparent'}`,
          marginBottom: -1, transition: 'var(--transition)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {tab.icon && <tab.icon size={13} />}{tab.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '56px 24px', textAlign: 'center', gap: 10 }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--bg-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        {Icon && <Icon size={22} color="var(--text-placeholder)" />}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 280 }}>{description}</div>}
      {action}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 2 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function TableWrapper({ children }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', boxShadow: 'var(--shadow-xs)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>{children}</table>
    </div>
  );
}

export function Th({ children, style={} }) {
  return <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.4px', textTransform: 'uppercase', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-light)', whiteSpace: 'nowrap', ...style }}>{children}</th>;
}

export function Td({ children, style={} }) {
  return <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', verticalAlign: 'middle', ...style }}>{children}</td>;
}
