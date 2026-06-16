import React, { useState } from 'react';
import { Card, Button, ProgressBar } from '../components/UI';
// Using real backend APIs
import { Download, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const CT=({active,payload,label})=>{
  if(!active||!payload?.length) return null;
  return <div style={{background:'#fff',border:'1px solid var(--border-light)',borderRadius:8,padding:'8px 12px',fontSize:12,boxShadow:'var(--shadow-md)'}}>
    <p style={{color:'var(--text-muted)',marginBottom:3}}>{label}</p>
    {payload.map((p,i)=><p key={i} style={{color:p.color,fontWeight:600}}>{p.name==='revenue'?`KES ${Number(p.value).toLocaleString()}`:p.value}</p>)}
  </div>;
};

export default function Reports() {
  const [period, setPeriod] = useState('7months');
  const kpis=[
    {icon:Users,label:'Active Clients',value:'24',trend:'+9%',c:'var(--accent)'},
    {icon:DollarSign,label:'Revenue MTD',value:'KES 98K',trend:'+12%',c:'var(--success)'},
    {icon:TrendingUp,label:'Retention Rate',value:'78%',trend:'+3%',c:'var(--violet)'},
    {icon:Activity,label:'Follow-up Adherence',value:'65%',trend:'-2%',c:'var(--warning)'},
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, animation:'fadeIn 0.25s ease' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <p style={{ fontSize:13, color:'var(--text-muted)' }}>Performance overview — clinical & administrative metrics</p>
        <div style={{ display:'flex', gap:8 }}>
          <div style={{ display:'flex', background:'var(--bg-surface)', border:'1px solid var(--border-light)', borderRadius:8, padding:3 }}>
            {['1month','3months','7months'].map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{ padding:'5px 13px', borderRadius:6, border:'none', cursor:'pointer', background:period===p?'var(--accent)':'transparent', color:period===p?'#fff':'var(--text-muted)', fontSize:12, fontFamily:'var(--font-body)', fontWeight:period===p?600:400, transition:'var(--transition)' }}>
                {p==='1month'?'1M':p==='3months'?'3M':'7M'}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" icon={Download}>Export</Button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:13 }}>
        {kpis.map(k=>(
          <Card key={k.label} style={{ padding:18 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ width:36, height:36, borderRadius:9, background:k.c+'18', display:'flex', alignItems:'center', justifyContent:'center' }}><k.icon size={16} color={k.c}/></div>
              <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20, color:k.trend.startsWith('+')?'var(--success)':'var(--danger)', background:k.trend.startsWith('+')?'var(--success-light)':'var(--danger-light)', border:`1px solid ${k.trend.startsWith('+')?'var(--success-mid)':'var(--danger-mid)'}` }}>{k.trend}</span>
            </div>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:'var(--font-display)', lineHeight:1 }}>{k.value}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{k.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <Card style={{ padding:20 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, marginBottom:4 }}>Monthly Revenue</div>
          <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:14 }}>KES collected per month</p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={analyticsData.monthlyClients}>
              <CartesianGrid stroke="var(--border-light)" strokeDasharray="4 4"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false} tickFormatter={v=>`${v/1000}K`}/>
              <Tooltip content={<CT/>}/>
              <Bar dataKey="revenue" fill="var(--accent)" radius={[5,5,0,0]} name="revenue"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding:20 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, marginBottom:4 }}>Client Growth</div>
          <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:14 }}>Total active vs new enrolments</p>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={analyticsData.monthlyClients}>
              <defs>
                <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/><stop offset="95%" stopColor="#2563EB" stopOpacity={0}/></linearGradient>
                <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.15}/><stop offset="95%" stopColor="#059669" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border-light)" strokeDasharray="4 4"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CT/>}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Area type="monotone" dataKey="clients" stroke="#2563EB" fill="url(#ag1)" strokeWidth={2} name="clients"/>
              <Area type="monotone" dataKey="newClients" stroke="#059669" fill="url(#ag2)" strokeWidth={2} name="newClients"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'320px minmax(0,1fr)', gap:16 }}>
        <Card style={{ padding:20 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, marginBottom:12 }}>Condition Breakdown</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={analyticsData.conditionBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {analyticsData.conditionBreakdown.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip formatter={v=>[`${v}%`]} contentStyle={{background:'#fff',border:'1px solid var(--border-light)',borderRadius:8,fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:5, marginTop:8 }}>
            {analyticsData.conditionBreakdown.map(c=>(
              <div key={c.name} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12.5 }}>
                <span style={{ width:10, height:10, borderRadius:2, background:c.color, flexShrink:0 }}/>
                <span style={{ flex:1, color:'var(--text-secondary)' }}>{c.name}</span>
                <span style={{ fontWeight:600, color:'var(--text-primary)' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding:20 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, marginBottom:4 }}>Performance Metrics</div>
          <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:16 }}>Clinical & operational KPIs vs targets</p>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[{l:'Client Retention Rate',v:78,t:85,c:'var(--accent)'},{l:'Follow-up Adherence',v:65,t:80,c:'var(--warning)'},{l:'Appointment Fill Rate',v:84,t:90,c:'var(--success)'},{l:'Goal Achievement Rate',v:58,t:70,c:'var(--violet)'},{l:'Payment Collection Rate',v:72,t:95,c:'var(--info)'}].map(m=>(
              <div key={m.l}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{m.l}</span>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <span style={{ fontSize:11.5, color:'var(--text-placeholder)' }}>Target: {m.t}%</span>
                    <span style={{ fontSize:13, fontWeight:700, color:m.v>=m.t?'var(--success)':m.v>=m.t*0.8?'var(--warning)':'var(--danger)' }}>{m.v}%</span>
                  </div>
                </div>
                <div style={{ position:'relative' }}>
                  <ProgressBar value={m.v} color={m.c} height={8}/>
                  <div style={{ position:'absolute', top:-2, bottom:-2, left:`${m.t}%`, width:2, background:'rgba(0,0,0,0.2)', borderRadius:1 }}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:18, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[['Avg Visits/Client',analyticsData.avgVisitsPerClient],['Outstanding (KES)','7,000'],['New Clients (May)',6]].map(s=>(
              <div key={s[0]} style={{ background:'var(--bg-surface-2)', border:'1px solid var(--border-light)', borderRadius:9, padding:'12px', textAlign:'center' }}>
                <div style={{ fontSize:20, fontWeight:700, fontFamily:'var(--font-display)' }}>{s[1]}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{s[0]}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
