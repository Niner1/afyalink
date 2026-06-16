import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Badge, Avatar, Button, ProgressBar, SectionHeader } from '../components/UI';
import { Users, Calendar, CreditCard, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { trpc } from '../lib/trpc';

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#fff', border:'1px solid var(--border-default)', borderRadius:8, padding:'8px 12px', fontSize:12, boxShadow:'var(--shadow-md)' }}>
      <p style={{ color:'var(--text-muted)', marginBottom:3 }}>{label}</p>
      {payload.map((p,i) => <p key={i} style={{ color:p.color, fontWeight:600 }}>{p.name==='revenue'?`KES ${Number(p.value).toLocaleString()}`:p.value}</p>)}
    </div>
  );
};

export default function Dashboard() {
  const { setActivePage, setAiAssistantOpen } = useApp();

  // Fetch real data from backend
  const { data: analytics, isLoading: analyticsLoading } = trpc.analytics.dashboard.useQuery();
  const { data: appointments } = trpc.appointments.list.useQuery({ status: 'Scheduled' });
  const { data: invoices } = trpc.billing.listInvoices.useQuery();
  const { data: clients } = trpc.clients.list.useQuery();

  if (analyticsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    );
  }

  const outstanding = invoices?.reduce((s, b) => s + (b.outstandingBalance || 0), 0) || 0;
  const activeClients = clients?.filter(c => c.status === 'Active').length || 0;
  const todayAppts = appointments?.slice(0, 5) || [];

  const monthlyData = analytics?.revenueTrend || [];
  const riskData = [
    { name: 'Low Risk', value: analytics?.riskDistribution?.lowRisk || 0, color: '#10B981' },
    { name: 'Medium Risk', value: analytics?.riskDistribution?.mediumRisk || 0, color: '#F59E0B' },
    { name: 'High Risk', value: analytics?.riskDistribution?.highRisk || 0, color: '#EF4444' },
    { name: 'Critical', value: analytics?.riskDistribution?.critical || 0, color: '#7C3AED' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, animation:'fadeIn 0.25s ease' }}>

      {/* Welcome banner */}
      <div style={{ background:'linear-gradient(135deg, var(--accent) 0%, #1D4ED8 100%)', borderRadius:'var(--radius-xl)', padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
        <div>
          <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.75)', marginBottom:4 }}>Good morning ☀️</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color:'#fff', marginBottom:4 }}>AFyalink Dashboard</h2>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:13 }}>
            <strong style={{ color:'#fff' }}>{todayAppts.length} appointments</strong> today · <strong style={{ color:'#FBBF24' }}>{analytics?.atRiskClients || 0} critical alerts</strong> need attention
          </p>
        </div>
        <Button onClick={() => setAiAssistantOpen(true)} style={{ background:'rgba(255,255,255,0.2)', color:'#fff', border:'1px solid rgba(255,255,255,0.3)', fontWeight:600, backdropFilter:'blur(4px)' }}>
          <Sparkles size={14} /> Ask AFyalinkAI
        </Button>
      </div>

      {/* KPI Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:14 }}>
        <Card style={{ padding:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:'var(--accent-light)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Users size={20} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>Active Clients</div>
              <div style={{ fontSize:20, fontWeight:700, color:'var(--text-primary)' }}>{activeClients}</div>
              <div style={{ fontSize:11, color:'var(--success)', marginTop:2 }}>+9% from last month</div>
            </div>
          </div>
        </Card>

        <Card style={{ padding:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:'var(--success-light)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Calendar size={20} color="var(--success)" />
            </div>
            <div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>Appointments</div>
              <div style={{ fontSize:20, fontWeight:700, color:'var(--text-primary)' }}>{analytics?.totalAppointments || 0}</div>
              <div style={{ fontSize:11, color:'var(--success)', marginTop:2 }}>+5% from last month</div>
            </div>
          </div>
        </Card>

        <Card style={{ padding:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:'var(--violet-light)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <CreditCard size={20} color="var(--violet)" />
            </div>
            <div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>Revenue (MTD)</div>
              <div style={{ fontSize:20, fontWeight:700, color:'var(--text-primary)' }}>KES {(analytics?.monthlyRevenue || 0).toLocaleString()}</div>
              <div style={{ fontSize:11, color:'var(--success)', marginTop:2 }}>+12% from last month</div>
            </div>
          </div>
        </Card>

        <Card style={{ padding:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:'var(--warning-light)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <TrendingUp size={20} color="var(--warning)" />
            </div>
            <div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>Retention Rate</div>
              <div style={{ fontSize:20, fontWeight:700, color:'var(--text-primary)' }}>{analytics?.retentionRate || 0}%</div>
              <div style={{ fontSize:11, color:'var(--success)', marginTop:2 }}>+3% from last month</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,340px)', gap:16 }}>
        <Card style={{ padding:20 }}>
          <SectionHeader title="Revenue Trends" subtitle="Last 30 days" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.15}/><stop offset="95%" stopColor="#059669" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border-light)" strokeDasharray="4 4" />
              <XAxis dataKey="date" tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CT />} />
              <Area type="monotone" dataKey="revenue" stroke="#059669" fill="url(#rg)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Risk Distribution */}
        <Card style={{ padding:20 }}>
          <SectionHeader title="Risk Distribution" />
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={riskData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={60} fill="#8884d8" dataKey="value">
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Today schedule + mini stats */}
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,300px)', gap:16 }}>
        <Card style={{ padding:20 }}>
          <SectionHeader title="Today's Schedule" 
            action={<Button variant="ghost" size="sm" onClick={() => setActivePage('appointments')}>View all <ChevronRight size={12} /></Button>} />
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {todayAppts.length > 0 ? (
              todayAppts.map((a, idx) => (
                <div key={idx} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'var(--bg-surface-2)', borderRadius:10, border:'1px solid var(--border-light)', borderLeft:`3px solid ${a.status==='Confirmed'?'var(--success)':'var(--warning)'}` }}>
                  <div style={{ width:44, height:44, borderRadius:9, background:'var(--bg-surface)', border:'1px solid var(--border-light)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', lineHeight:1 }}>
                      {new Date(a.appointmentDate).getHours()}
                    </span>
                    <span style={{ fontSize:10, color:'var(--text-muted)' }}>
                      {String(new Date(a.appointmentDate).getMinutes()).padStart(2, '0')}
                    </span>
                  </div>
                  <Avatar name={a.clientName} size={34} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:600, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.clientName}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.appointmentType || 'Consultation'}</div>
                  </div>
                  <Badge variant={a.status==='Confirmed'?'success':a.status==='Pending'?'warning':'accent'}>{a.status}</Badge>
                </div>
              ))
            ) : (
              <div style={{ color:'var(--text-muted)', fontSize:13 }}>No appointments scheduled</div>
            )}
          </div>
        </Card>

        {/* Mini KPIs */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <Card style={{ padding:16 }}>
            <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text-muted)', marginBottom:10 }}>Outstanding Balance</div>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:'var(--font-display)', color:'var(--danger)', marginBottom:8 }}>KES {outstanding.toLocaleString()}</div>
            <ProgressBar value={Math.min(outstanding, 100000)} max={100000} color="var(--danger)" />
            <div style={{ fontSize:11, color:'var(--text-placeholder)', marginTop:6 }}>{invoices?.filter(i => i.outstandingBalance > 0).length || 0} clients with pending payments</div>
          </Card>
          <Card style={{ padding:16 }}>
            <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text-muted)', marginBottom:10 }}>At-Risk Clients</div>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:'var(--font-display)', color:'var(--warning)', marginBottom:8 }}>{analytics?.atRiskClients || 0}</div>
            <ProgressBar value={analytics?.atRiskClients || 0} max={activeClients || 1} color="var(--warning)" />
            <div style={{ fontSize:11, color:'var(--text-placeholder)', marginTop:6 }}>Require immediate follow-up</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
