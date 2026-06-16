import React, { useMemo } from 'react';
// @ts-ignore
import { StatCard, Card, Badge, Avatar, Button, ProgressBar, SectionHeader } from '../components/UI';
import { Users, Calendar, CreditCard, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { trpc } from '../lib/trpc';
import { useAuth } from '../_core/hooks/useAuth';

const CT = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#fff', border:'1px solid var(--border-default)', borderRadius:8, padding:'8px 12px', fontSize:12, boxShadow:'var(--shadow-md)' }}>
      <p style={{ color:'var(--text-muted)', marginBottom:3 }}>{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color:p.color, fontWeight:600 }}>{p.name==='revenue'?`KES ${Number(p.value).toLocaleString()}`:p.value}</p>)}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  
  // Fetch real data from backend
  const { data: analyticsData, isLoading: analyticsLoading } = trpc.analytics.dashboard.useQuery();
  const { data: appointments, isLoading: appointmentsLoading } = trpc.appointment.list.useQuery({});
  const { data: clients, isLoading: clientsLoading } = trpc.clients.list.useQuery({});
  const { data: invoices, isLoading: invoicesLoading } = trpc.billing.listInvoices.useQuery({});

  // Calculate derived values
  const activeClients = useMemo(() => {
    return clients?.filter((c: any) => c.status === 'Active').length || 0;
  }, [clients]);

  const todayAppts = useMemo(() => {
    if (!appointments) return [];
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter((a: any) => {
      const aptDate = new Date(a.appointmentDate).toISOString().split('T')[0];
      return aptDate === today;
    });
  }, [appointments]);

  const outstanding = useMemo(() => {
    if (!invoices) return 0;
    return invoices.reduce((sum: number, inv: any) => {
      const paid = inv.paymentRecords?.reduce((s: number, p: any) => s + (p.amountPaid || 0), 0) || 0;
      const total = inv.invoiceItems?.reduce((s: number, item: any) => s + (item.quantity * item.unitPrice), 0) || 0;
      return sum + Math.max(0, total - paid);
    }, 0);
  }, [invoices]);

  const insightStyle = {
    Critical: { bg: 'var(--danger-light)', color: 'var(--danger)', border: 'var(--danger-mid)' },
    Medium: { bg: 'var(--warning-light)', color: 'var(--warning)', border: 'var(--warning-mid)' },
    Low: { bg: 'var(--success-light)', color: 'var(--success)', border: 'var(--success-mid)' },
  };

  // Transform analytics data for charts
  const chartData = useMemo(() => {
    // Generate sample trend data from analytics
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
    return months.map((month, idx) => ({
      month,
      clients: Math.max(5, (analyticsData?.totalClients || 0) - (7 - idx) * 2),
      revenue: Math.max(10000, (analyticsData?.totalRevenue || 0) - (7 - idx) * 5000),
    }));
  }, [analyticsData]);

  if (analyticsLoading || clientsLoading || appointmentsLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.25s ease' }}>
      {/* Welcome banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #1D4ED8 100%)', borderRadius: 'var(--radius-xl)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>Good morning ☀️</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{user?.name || 'Welcome'}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
            <strong style={{ color: '#fff' }}>{todayAppts.length} appointments</strong> today ·             <strong style={{ color: '#FBBF24' }}>2 critical alerts</strong> need attention
          </p>
        </div>
        <Button style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
          <Sparkles size={14} /> Ask AFyalinkAI
        </Button>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <StatCard icon={Users} label="Active Clients" value={activeClients} sub={`${clients?.length || 0} total registered`} color="var(--accent)" trend={analyticsData?.newThisMonth || 0} />
        <StatCard icon={Calendar} label="Today's Appointments" value={todayAppts.length} sub={`${todayAppts.filter((a: any) => a.status === 'Confirmed').length} confirmed · ${todayAppts.filter((a: any) => a.status === 'Pending').length} pending`} color="var(--success)" trend={0} />
        <StatCard icon={CreditCard} label="Revenue (MTD)" value={`KES ${((analyticsData?.totalRevenue || 0) / 1000).toFixed(0)}K`} sub={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} color="var(--violet)" trend={5} />
        <StatCard icon={TrendingUp} label="Retention Rate" value={`78%`} sub={`Follow-up: 65%`} color="var(--info)" trend={3} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,340px)', gap: 16, flexWrap: 'wrap' }}>
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Client & Revenue Trends" subtitle={`Last 6 months`} />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} /><stop offset="95%" stopColor="#2563EB" stopOpacity={0} /></linearGradient>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.15} /><stop offset="95%" stopColor="#059669" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border-light)" strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="c" hide /><YAxis yAxisId="r" orientation="right" hide />
              <Tooltip content={<CT />} />
              <Area yAxisId="c" type="monotone" dataKey="clients" stroke="#2563EB" fill="url(#cg)" strokeWidth={2} dot={false} name="clients" />
              <Area yAxisId="r" type="monotone" dataKey="revenue" stroke="#059669" fill="url(#rg)" strokeWidth={2} dot={false} name="revenue" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {[{ c: '#2563EB', l: 'Clients' }, { c: '#059669', l: 'Revenue' }].map(x => (
              <span key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-muted)' }}>
                <span style={{ width: 12, height: 3, background: x.c, borderRadius: 2, display: 'inline-block' }} />{x.l}
              </span>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={14} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>AI Insights</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>AFyalinkAI recommendations</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { priority: 'Critical', clientName: 'Grace Akinyi', message: 'Weight trending critically low (-10kg). Recommend ONS increase.' },
              { priority: 'Medium', clientName: 'Amara Osei', message: 'Blood sugar improving. Continue current plan.' },
              { priority: 'Low', clientName: 'Samuel Kimura', message: 'Excellent adherence. Ready for advanced goals.' },
            ].map((ins: any, idx: number) => {
              const s = insightStyle[ins.priority as keyof typeof insightStyle] || insightStyle.Low;
              return (
                <div key={idx} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: s.color, marginBottom: 1 }}>{ins.clientName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{ins.message}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <button style={{ width: '100%', marginTop: 10, padding: '8px', background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', borderRadius: 8, color: 'var(--accent)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'var(--transition)' }}
            onMouseEnter={e => (e.currentTarget as any).style.background = 'var(--accent-mid)'}
            onMouseLeave={e => (e.currentTarget as any).style.background = 'var(--accent-light)'}
          >Open AFyalinkAI →</button>
        </Card>
      </div>

      {/* Today schedule + mini stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,300px)', gap: 16 }}>
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Today's Schedule" subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            action={<Button variant="ghost" size="sm">View all <ChevronRight size={12} /></Button>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayAppts.slice(0, 5).map((a: any) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: 'var(--bg-surface-2)', borderRadius: 10, border: '1px solid var(--border-light)', borderLeft: `3px solid ${a.status === 'Confirmed' ? 'var(--success)' : 'var(--warning)'}` }}>
                <div style={{ width: 44, height: 44, borderRadius: 9, background: 'var(--bg-surface)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{a.appointmentTime.split(':')[0]}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{a.appointmentTime.split(':')[1]}</span>
                </div>
                <Avatar name={a.clientName} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.clientName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.type} · {a.mode}</div>
                </div>
                <Badge variant={a.status === 'Confirmed' ? 'success' : a.status === 'Pending' ? 'warning' : 'accent'}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Mini KPIs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>Follow-up Adherence</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--warning)', marginBottom: 8 }}>65%</div>
            <ProgressBar value={65} color="var(--warning)" />
            <div style={{ fontSize: 11, color: 'var(--text-placeholder)', marginTop: 6 }}>Target: 80% · Gap: 15%</div>
          </Card>
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>Outstanding Balance</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--danger)', marginBottom: 8 }}>KES {outstanding.toLocaleString()}</div>
            <ProgressBar value={Math.min(outstanding, (analyticsData?.totalRevenue || 0) * 0.1)} max={(analyticsData?.totalRevenue || 0) * 0.1 || 1} color="var(--danger)" />
            <div style={{ fontSize: 11, color: 'var(--text-placeholder)', marginTop: 6 }}>{invoices?.filter((i: any) => {
              const paid = i.paymentRecords?.reduce((s: number, p: any) => s + (p.amountPaid || 0), 0) || 0;
              const total = i.invoiceItems?.reduce((s: number, item: any) => s + (item.quantity * item.unitPrice), 0) || 0;
              return total > paid;
            }).length || 0} clients with pending payments</div>
          </Card>
          <Card style={{ padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>Risk Distribution</div>
            {[
              { level: 'Low Risk', count: analyticsData?.riskDistribution?.lowRisk || 0 },
              { level: 'Medium Risk', count: analyticsData?.riskDistribution?.mediumRisk || 0 },
              { level: 'High Risk', count: analyticsData?.riskDistribution?.highRisk || 0 },
              { level: 'Critical', count: analyticsData?.riskDistribution?.critical || 0 },
            ].map((r: any) => (
              <div key={r.level} style={{ marginBottom: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{r.level}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{r.count}</span>
                </div>
                <ProgressBar value={r.count} max={activeClients || 1} color={r.level === 'Critical' ? 'var(--danger)' : r.level === 'High Risk' ? 'var(--warning)' : 'var(--success)'} height={4} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
