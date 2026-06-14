import React from 'react';
import { useApp } from '../context/AppContext';
import { StatCard, Card, Badge, Avatar, Button, ProgressBar, SectionHeader } from '../components/UI';
import { Users, Calendar, CreditCard, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { mockClients, mockAppointments, analyticsData, aiInsights, mockBilling } from '../data/mockData';

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
  const outstanding = mockBilling.reduce((s,b) => s+b.outstanding, 0);
  const activeClients = mockClients.filter(c => c.status==='Active').length;
  const todayAppts = mockAppointments.filter(a => a.date==='2025-05-17');

  const insightStyle = { Critical:{ bg:'var(--danger-light)', color:'var(--danger)', border:'var(--danger-mid)' }, Medium:{ bg:'var(--warning-light)', color:'var(--warning)', border:'var(--warning-mid)' }, Low:{ bg:'var(--success-light)', color:'var(--success)', border:'var(--success-mid)' } };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, animation:'fadeIn 0.25s ease' }}>

      {/* Welcome banner */}
      <div style={{ background:'linear-gradient(135deg, var(--accent) 0%, #1D4ED8 100%)', borderRadius:'var(--radius-xl)', padding:'20px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
        <div>
          <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.75)', marginBottom:4 }}>Good morning ☀️</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color:'#fff', marginBottom:4 }}>Dr. Wanjiku Kariuki</h2>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:13 }}>
            <strong style={{ color:'#fff' }}>{todayAppts.length} appointments</strong> today · <strong style={{ color:'#FBBF24' }}>2 critical alerts</strong> need attention
          </p>
        </div>
        <Button onClick={() => setAiAssistantOpen(true)} style={{ background:'rgba(255,255,255,0.2)', color:'#fff', border:'1px solid rgba(255,255,255,0.3)', fontWeight:600, backdropFilter:'blur(4px)' }}>
          <Sparkles size={14} /> Ask AFyalinkAI
        </Button>
      </div>

      {/* KPI Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:14 }}>
        <StatCard icon={Users} label="Active Clients" value={activeClients} sub={`${mockClients.length} total registered`} color="var(--accent)" trend={9} />
        <StatCard icon={Calendar} label="Today's Appointments" value={todayAppts.length} sub="3 confirmed · 1 pending" color="var(--success)" trend={0} />
        <StatCard icon={CreditCard} label="Revenue (MTD)" value={`KES ${(analyticsData.totalRevenueMTD/1000).toFixed(0)}K`} sub="May 2025" color="var(--violet)" trend={12} />
        <StatCard icon={TrendingUp} label="Retention Rate" value={`${analyticsData.retentionRate}%`} sub="Follow-up: 65%" color="var(--info)" trend={3} />
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,340px)', gap:16, flexWrap:'wrap' }}>
        <Card style={{ padding:20 }}>
          <SectionHeader title="Client & Revenue Trends" subtitle="Nov 2024 — May 2025" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analyticsData.monthlyClients}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/><stop offset="95%" stopColor="#2563EB" stopOpacity={0}/></linearGradient>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.15}/><stop offset="95%" stopColor="#059669" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border-light)" strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="c" hide /><YAxis yAxisId="r" orientation="right" hide />
              <Tooltip content={<CT />} />
              <Area yAxisId="c" type="monotone" dataKey="clients" stroke="#2563EB" fill="url(#cg)" strokeWidth={2} dot={false} name="clients" />
              <Area yAxisId="r" type="monotone" dataKey="revenue" stroke="#059669" fill="url(#rg)" strokeWidth={2} dot={false} name="revenue" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', gap:16, marginTop:8 }}>
            {[{c:'#2563EB',l:'Clients'},{c:'#059669',l:'Revenue'}].map(x => (
              <span key={x.l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:'var(--text-muted)' }}>
                <span style={{ width:12, height:3, background:x.c, borderRadius:2, display:'inline-block' }} />{x.l}
              </span>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        <Card style={{ padding:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Sparkles size={14} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, color:'var(--text-primary)' }}>AI Insights</div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>AFyalinkAI recommendations</div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {aiInsights.map(ins => {
              const s = insightStyle[ins.priority] || insightStyle.Low;
              return (
                <div key={ins.id} style={{ background:s.bg, border:`1px solid ${s.border}`, borderRadius:8, padding:'10px 12px', display:'flex', gap:9, alignItems:'flex-start' }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:s.color, marginTop:5, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11.5, fontWeight:600, color:s.color, marginBottom:1 }}>{ins.client}</div>
                    <div style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.4 }}>{ins.message}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setAiAssistantOpen(true)} style={{ width:'100%', marginTop:10, padding:'8px', background:'var(--accent-light)', border:'1px solid var(--accent-mid)', borderRadius:8, color:'var(--accent)', fontSize:12.5, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', transition:'var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.background='var(--accent-mid)'}
            onMouseLeave={e => e.currentTarget.style.background='var(--accent-light)'}
          >Open AFyalinkAI →</button>
        </Card>
      </div>

      {/* Today schedule + mini stats */}
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,300px)', gap:16 }}>
        <Card style={{ padding:20 }}>
          <SectionHeader title="Today's Schedule" subtitle="Monday, 17 May 2025"
            action={<Button variant="ghost" size="sm" onClick={() => setActivePage('appointments')}>View all <ChevronRight size={12} /></Button>} />
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {todayAppts.map(a => (
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'var(--bg-surface-2)', borderRadius:10, border:'1px solid var(--border-light)', borderLeft:`3px solid ${a.status==='Confirmed'?'var(--success)':'var(--warning)'}` }}>
                <div style={{ width:44, height:44, borderRadius:9, background:'var(--bg-surface)', border:'1px solid var(--border-light)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', lineHeight:1 }}>{a.time.split(':')[0]}</span>
                  <span style={{ fontSize:10, color:'var(--text-muted)' }}>{a.time.split(':')[1]}</span>
                </div>
                <Avatar name={a.clientName} size={34} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.clientName}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.type} · {a.mode} · {a.duration}min</div>
                </div>
                <Badge variant={a.status==='Confirmed'?'success':a.status==='Pending'?'warning':'accent'}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Mini KPIs */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <Card style={{ padding:16 }}>
            <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text-muted)', marginBottom:10 }}>Follow-up Adherence</div>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:'var(--font-display)', color:'var(--warning)', marginBottom:8 }}>{analyticsData.followUpAdherence}%</div>
            <ProgressBar value={analyticsData.followUpAdherence} color="var(--warning)" />
            <div style={{ fontSize:11, color:'var(--text-placeholder)', marginTop:6 }}>Target: 80% · Gap: 15%</div>
          </Card>
          <Card style={{ padding:16 }}>
            <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text-muted)', marginBottom:10 }}>Outstanding Balance</div>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:'var(--font-display)', color:'var(--danger)', marginBottom:8 }}>KES {outstanding.toLocaleString()}</div>
            <ProgressBar value={outstanding} max={outstanding+98000} color="var(--danger)" />
            <div style={{ fontSize:11, color:'var(--text-placeholder)', marginTop:6 }}>3 clients with pending payments</div>
          </Card>
          <Card style={{ padding:16 }}>
            <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text-muted)', marginBottom:10 }}>Condition Mix</div>
            {analyticsData.conditionBreakdown.slice(0,4).map(c => (
              <div key={c.name} style={{ marginBottom:7 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <span style={{ fontSize:11.5, color:'var(--text-muted)' }}>{c.name}</span>
                  <span style={{ fontSize:11.5, fontWeight:600, color:'var(--text-secondary)' }}>{c.value}%</span>
                </div>
                <ProgressBar value={c.value} color={c.color} height={4} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
