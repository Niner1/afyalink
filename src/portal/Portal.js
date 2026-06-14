import React, { useState, useRef, useEffect } from 'react';
import { currentClient, portalAppointments, portalCarePlan, portalProgress, portalBilling, portalMessages, healthTips } from './portalData';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  Stethoscope, LayoutDashboard, Calendar, Target, CreditCard,
  MessageSquare, BookOpen, User, LogOut, Send,  ChevronRight, CheckCircle, Clock, Circle, Menu,
  Activity
} from 'lucide-react';

// ─── Shared styles ───────────────────────────────────────────────────────────
const c = {
  bg: '#F0F2F5', surface: '#FFFFFF', surface2: '#F8F9FB', surface3: '#F1F3F6',
  border: '#E8ECF0', borderDef: '#D8DDE4', accent: '#2563EB', accentLight: '#EFF4FF', accentMid: '#BFDBFE',
  success: '#059669', successLight: '#ECFDF5', successMid: '#A7F3D0',
  warning: '#D97706', warningLight: '#FFFBEB', warningMid: '#FDE68A',
  danger: '#DC2626', dangerLight: '#FEF2F2', dangerMid: '#FECACA',
  text: '#111827', textSec: '#374151', textMuted: '#6B7280', textPh: '#9CA3AF',
  sidebar: '#1E2A3B', sidebarHov: '#2A3A50',
};

const SIDEBAR_W = 230;

// ─── Mini component helpers ──────────────────────────────────────────────────
function PBadge({ children, variant='default' }) {
  const defs = {
    success:{ bg:c.successLight, color:c.success, border:c.successMid },
    warning:{ bg:c.warningLight, color:c.warning, border:c.warningMid },
    danger: { bg:c.dangerLight,  color:c.danger,  border:c.dangerMid  },
    accent: { bg:c.accentLight,  color:c.accent,  border:c.accentMid  },
    default:{ bg:c.surface3,     color:c.textMuted, border:c.border   },
  };
  const s = defs[variant]||defs.default;
  return <span style={{ display:'inline-flex', alignItems:'center', background:s.bg, color:s.color, border:`1px solid ${s.border}`, fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:20, whiteSpace:'nowrap' }}>{children}</span>;
}

function PCard({ children, style={}, onClick }) {
  return <div onClick={onClick} style={{ background:c.surface, border:`1px solid ${c.border}`, borderRadius:12, boxShadow:'0 1px 3px rgba(0,0,0,0.06)', ...style }}>{children}</div>;
}

function PProgressBar({ value, max=100, color=c.accent, height=6 }) {
  const pct = Math.min(100, Math.max(0, (value/max)*100));
  return <div style={{ width:'100%', height, background:c.surface3, borderRadius:height, border:`1px solid ${c.border}` }}><div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:height, transition:'width 0.5s ease' }}/></div>;
}

const goalIcon = { Achieved:CheckCircle, 'In Progress':Clock, 'Not Started':Circle };
const goalColor = { Achieved:c.success, 'In Progress':c.accent, 'Not Started':c.textPh };
const statusV = { Confirmed:'success', Scheduled:'accent', Completed:'default', Cancelled:'danger' };

// ─── Portal Dashboard ────────────────────────────────────────────────────────
function PortalDashboard({ setPage }) {
  const next = portalAppointments.find(a=>a.status==='Confirmed'||a.status==='Scheduled');
  const achieved = portalCarePlan.goals.filter(g=>g.status==='Achieved').length;
  const s = portalProgress.stats;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      {/* Welcome */}
      <div style={{ background:`linear-gradient(135deg, ${c.accent} 0%, #1D4ED8 100%)`, borderRadius:16, padding:'20px 24px', color:'#fff' }}>
        <div style={{ fontSize:12.5, color:'rgba(255,255,255,0.75)', marginBottom:4 }}>Welcome back 👋</div>
        <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:20, fontWeight:800, marginBottom:4 }}>{currentClient.fullName}</h2>
        <p style={{ color:'rgba(255,255,255,0.8)', fontSize:13 }}>
          {next ? <>Next appointment: <strong style={{color:'#fff'}}>{next.date} at {next.time}</strong></> : 'No upcoming appointments'}
        </p>
      </div>

      {/* Quick stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12 }}>
        {[
          { label:'Weight Lost', value:`${s.weightLost} kg`, sub:`from ${s.startWeight}kg`, color:c.success },
          { label:'Current BMI', value:s.bmi, sub:'Obese Class I', color:c.warning },
          { label:'Blood Sugar', value:`${s.bloodSugar} mmol/L`, sub:'Improving ↓', color:c.accent },
          { label:'Goals Achieved', value:`${achieved}/${portalCarePlan.goals.length}`, sub:'Keep going!', color:c.violet||'#7C3AED' },
        ].map(stat => (
          <PCard key={stat.label} style={{ padding:16 }}>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", color:stat.color, lineHeight:1, marginBottom:4 }}>{stat.value}</div>
            <div style={{ fontSize:12.5, color:c.textMuted, fontWeight:500 }}>{stat.label}</div>
            <div style={{ fontSize:11.5, color:c.textPh, marginTop:2 }}>{stat.sub}</div>
          </PCard>
        ))}
      </div>

      {/* Weight trend */}
      <PCard style={{ padding:20 }}>
        <div style={{ fontSize:14, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:4 }}>Weight Progress</div>
        <div style={{ fontSize:12.5, color:c.textMuted, marginBottom:14 }}>Jan 2024 — Apr 2025 · Target: {s.targetWeight} kg</div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={portalProgress.weightHistory}>
            <CartesianGrid stroke={c.border} strokeDasharray="4 4"/>
            <XAxis dataKey="date" tick={{fontSize:10,fill:c.textMuted}} axisLine={false} tickLine={false}/>
            <YAxis domain={[70,'auto']} tick={{fontSize:10,fill:c.textMuted}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:'#fff',border:`1px solid ${c.borderDef}`,borderRadius:8,fontSize:12}}/>
            <Line type="monotone" dataKey="weight" stroke={c.accent} strokeWidth={2.5} dot={{fill:c.accent,r:4}} name="Weight (kg)"/>
          </LineChart>
        </ResponsiveContainer>
      </PCard>

      {/* Next appt + Goals summary */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <PCard style={{ padding:18 }}>
          <div style={{ fontSize:13.5, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:12 }}>Next Appointment</div>
          {next ? (
            <div style={{ background:c.accentLight, border:`1px solid ${c.accentMid}`, borderRadius:10, padding:14 }}>
              <div style={{ fontSize:14, fontWeight:700, color:c.accent, marginBottom:4 }}>{next.date} · {next.time}</div>
              <div style={{ fontSize:13, color:c.textSec, marginBottom:2 }}>{next.type} with {next.dietitian}</div>
              <div style={{ fontSize:12.5, color:c.textMuted, marginBottom:2 }}>{next.mode}</div>
              {next.notes&&<div style={{ fontSize:12.5, color:c.textMuted, marginTop:6, fontStyle:'italic' }}>{next.notes}</div>}
              <button onClick={()=>setPage('appointments')} style={{ marginTop:12, width:'100%', padding:'8px', background:c.accent, color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>View Details →</button>
            </div>
          ) : <div style={{ color:c.textMuted, fontSize:13 }}>No upcoming appointments. Book one now!</div>}
        </PCard>

        <PCard style={{ padding:18 }}>
          <div style={{ fontSize:13.5, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:12 }}>My Goals</div>
          <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
            {portalCarePlan.goals.map(g=>{
              const GIcon=goalIcon[g.status]||Circle;
              return(
                <div key={g.id} style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <GIcon size={14} color={goalColor[g.status]} style={{flexShrink:0}}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, color:c.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{g.goal}</div>
                    <PProgressBar value={g.progress} height={4} color={goalColor[g.status]}/>
                  </div>
                  <PBadge variant={g.status==='Achieved'?'success':g.status==='In Progress'?'accent':'default'} >{g.progress}%</PBadge>
                </div>
              );
            })}
          </div>
        </PCard>
      </div>
    </div>
  );
}

// ─── Portal Appointments ─────────────────────────────────────────────────────
function PortalAppointments() {
  const [bookModal, setBookModal] = useState(false);
  const upcoming = portalAppointments.filter(a=>a.status!=='Completed');
  const past = portalAppointments.filter(a=>a.status==='Completed');

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:18 }}>My Appointments</h2>
        <button onClick={()=>setBookModal(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', background:c.accent, color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>
          + Book Appointment
        </button>
      </div>

      <div>
        <div style={{ fontSize:12, fontWeight:600, color:c.textMuted, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:10 }}>Upcoming</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {upcoming.map(a=>(
            <PCard key={a.id} style={{ padding:18 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:c.accent, marginBottom:4 }}>{a.date} · {a.time}</div>
                  <div style={{ fontSize:13.5, fontWeight:600, color:c.text, marginBottom:2 }}>{a.type} with {a.dietitian}</div>
                  <div style={{ fontSize:13, color:c.textMuted, marginBottom:2 }}>📍 {a.location}</div>
                  {a.notes&&<div style={{ fontSize:12.5, color:c.textMuted, marginTop:4, fontStyle:'italic' }}>Note: {a.notes}</div>}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end' }}>
                  <PBadge variant={statusV[a.status]||'default'}>{a.status}</PBadge>
                  <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                    <button style={{ padding:'6px 12px', background:c.surface2, border:`1px solid ${c.borderDef}`, borderRadius:7, fontSize:12, fontWeight:500, cursor:'pointer', color:c.textSec, fontFamily:"'Inter',sans-serif" }}>Reschedule</button>
                    <button style={{ padding:'6px 12px', background:c.dangerLight, border:`1px solid ${c.dangerMid}`, borderRadius:7, fontSize:12, fontWeight:500, cursor:'pointer', color:c.danger, fontFamily:"'Inter',sans-serif" }}>Cancel</button>
                  </div>
                </div>
              </div>
            </PCard>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize:12, fontWeight:600, color:c.textMuted, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:10 }}>Past Appointments</div>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {past.map(a=>(
            <PCard key={a.id} style={{ padding:16 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:c.textSec }}>{a.date} · {a.time}</div>
                  <div style={{ fontSize:12.5, color:c.textMuted }}>{a.type} · {a.mode}</div>
                  {a.notes&&<div style={{ fontSize:12, color:c.textMuted, marginTop:3, fontStyle:'italic' }}>{a.notes}</div>}
                </div>
                <PBadge variant="default">Completed</PBadge>
              </div>
            </PCard>
          ))}
        </div>
      </div>

      {bookModal&&(
        <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <div onClick={()=>setBookModal(false)} style={{ position:'absolute', inset:0, background:'rgba(15,23,42,0.4)', backdropFilter:'blur(3px)' }}/>
          <div style={{ position:'relative', width:'100%', maxWidth:480, background:'#fff', border:`1px solid ${c.border}`, borderRadius:16, boxShadow:'0 20px 40px rgba(0,0,0,0.12)', padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:16 }}>Book Appointment</h3>
              <button onClick={()=>setBookModal(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:c.textMuted }}>✕</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
              {[{label:'Preferred Date',type:'date'},{label:'Preferred Time',type:'time'}].map(f=>(
                <div key={f.label}>
                  <label style={{ fontSize:12.5, fontWeight:500, color:c.textSec, display:'block', marginBottom:5 }}>{f.label}</label>
                  <input type={f.type} style={{ width:'100%', background:c.surface2, border:`1px solid ${c.borderDef}`, borderRadius:8, padding:'9px 12px', fontSize:13, fontFamily:"'Inter',sans-serif", color:c.text, outline:'none' }}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize:12.5, fontWeight:500, color:c.textSec, display:'block', marginBottom:5 }}>Appointment Type</label>
                <select style={{ width:'100%', background:c.surface2, border:`1px solid ${c.borderDef}`, borderRadius:8, padding:'9px 12px', fontSize:13, fontFamily:"'Inter',sans-serif", color:c.text, outline:'none', cursor:'pointer' }}>
                  <option>Follow-up Consultation</option><option>New Concern</option><option>Lab Review</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:12.5, fontWeight:500, color:c.textSec, display:'block', marginBottom:5 }}>Mode</label>
                <div style={{ display:'flex', gap:10 }}>
                  {['In-Person','Telehealth'].map(m=>(
                    <button key={m} style={{ flex:1, padding:'9px', background:m==='In-Person'?c.accentLight:c.surface2, border:`1px solid ${m==='In-Person'?c.accentMid:c.borderDef}`, borderRadius:8, color:m==='In-Person'?c.accent:c.textMuted, fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:12.5, fontWeight:500, color:c.textSec, display:'block', marginBottom:5 }}>Additional Notes</label>
                <textarea rows={3} placeholder="Any specific concerns…" style={{ width:'100%', background:c.surface2, border:`1px solid ${c.borderDef}`, borderRadius:8, padding:'9px 12px', fontSize:13, fontFamily:"'Inter',sans-serif", color:c.text, outline:'none', resize:'vertical' }}/>
              </div>
              <button onClick={()=>setBookModal(false)} style={{ width:'100%', padding:'11px', background:c.accent, color:'#fff', border:'none', borderRadius:9, fontSize:13.5, fontWeight:600, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Portal Care Plan ─────────────────────────────────────────────────────────
function PortalCarePlan() {
  const [tab, setTab] = useState('goals');
  const tabs = ['goals','mealplan','foods'];
  const tabLabel = { goals:'My Goals', mealplan:'Meal Plan', foods:'Food Guide' };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:18 }}>My Care Plan</h2>

      <PCard style={{ padding:18 }}>
        <div style={{ fontSize:11.5, fontWeight:600, color:c.textMuted, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:6 }}>Nutrition Diagnosis</div>
        <p style={{ fontSize:13.5, color:c.textSec }}>{portalCarePlan.diagnosis}</p>
        <div style={{ marginTop:12, fontSize:11.5, fontWeight:600, color:c.textMuted, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:6 }}>My Diet Prescription</div>
        <p style={{ fontSize:13.5, color:c.textSec }}>{portalCarePlan.prescription}</p>
      </PCard>

      {/* Tab bar */}
      <div style={{ display:'flex', borderBottom:`1px solid ${c.border}` }}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'9px 18px', border:'none', cursor:'pointer', background:'transparent', color:tab===t?c.accent:c.textMuted, fontSize:13, fontWeight:tab===t?600:400, fontFamily:"'Inter',sans-serif", borderBottom:`2px solid ${tab===t?c.accent:'transparent'}`, marginBottom:-1, transition:'all 0.15s ease' }}>{tabLabel[t]}</button>
        ))}
      </div>

      {tab==='goals'&&(
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {portalCarePlan.goals.map(g=>{
            const GIcon=goalIcon[g.status]||Circle;
            return(
              <PCard key={g.id} style={{ padding:16 }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <GIcon size={18} color={goalColor[g.status]} style={{flexShrink:0,marginTop:2}}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:600, color:c.text, marginBottom:4 }}>{g.goal}</div>
                    <div style={{ fontSize:12, color:c.textMuted, marginBottom:8 }}>Target date: {g.target}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <PProgressBar value={g.progress} color={goalColor[g.status]}/>
                      <span style={{ fontSize:12.5, fontWeight:700, color:goalColor[g.status], flexShrink:0 }}>{g.progress}%</span>
                    </div>
                  </div>
                  <PBadge variant={g.status==='Achieved'?'success':g.status==='In Progress'?'accent':'default'}>{g.status}</PBadge>
                </div>
              </PCard>
            );
          })}
        </div>
      )}

      {tab==='mealplan'&&(
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:14 }}>
          {[['🌅 Breakfast',portalCarePlan.mealPlan.breakfast],['🌞 Lunch',portalCarePlan.mealPlan.lunch],['🌆 Dinner',portalCarePlan.mealPlan.dinner],['🍎 Snacks',portalCarePlan.mealPlan.snacks]].map(([title,items])=>(
            <PCard key={title} style={{ padding:16 }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:10 }}>{title}</div>
              <ul style={{ paddingLeft:18, display:'flex', flexDirection:'column', gap:5 }}>
                {items.map((item,i)=><li key={i} style={{ fontSize:13, color:c.textSec, lineHeight:1.5 }}>{item}</li>)}
              </ul>
            </PCard>
          ))}
        </div>
      )}

      {tab==='foods'&&(
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14 }}>
          {[{title:'✅ Encouraged Foods',items:portalCarePlan.foods.encouraged,color:c.success,bg:c.successLight,border:c.successMid},{title:'⚠️ Limit These',items:portalCarePlan.foods.limit,color:c.warning,bg:c.warningLight,border:c.warningMid},{title:'❌ Best Avoided',items:portalCarePlan.foods.avoid,color:c.danger,bg:c.dangerLight,border:c.dangerMid}].map(cat=>(
            <div key={cat.title} style={{ background:cat.bg, border:`1px solid ${cat.border}`, borderRadius:12, padding:16 }}>
              <div style={{ fontSize:13.5, fontWeight:700, color:cat.color, marginBottom:10 }}>{cat.title}</div>
              <ul style={{ paddingLeft:18, display:'flex', flexDirection:'column', gap:5 }}>
                {cat.items.map((item,i)=><li key={i} style={{ fontSize:13, color:c.textSec, lineHeight:1.5 }}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Portal Progress ──────────────────────────────────────────────────────────
function PortalProgress() {
  const s = portalProgress.stats;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:18 }}>My Progress</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12 }}>
        {[
          {l:'Start Weight',v:`${s.startWeight} kg`,c:'#64748B'},{l:'Current Weight',v:`${s.currentWeight} kg`,c:c.accent},
          {l:'Target Weight',v:`${s.targetWeight} kg`,c:c.success},{l:'Weight Lost',v:`${s.weightLost} kg`,c:c.success},
          {l:'Current BMI',v:s.bmi,c:c.warning},{l:'Blood Sugar',v:`${s.bloodSugar} mmol/L`,c:c.accent},
        ].map(st=>(
          <PCard key={st.l} style={{ padding:16, textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:"'Plus Jakarta Sans',sans-serif", color:st.c, lineHeight:1, marginBottom:4 }}>{st.v}</div>
            <div style={{ fontSize:12, color:c.textMuted }}>{st.l}</div>
          </PCard>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <PCard style={{ padding:20 }}>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:14, marginBottom:14 }}>Weight Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={portalProgress.weightHistory}>
              <CartesianGrid stroke={c.border} strokeDasharray="4 4"/>
              <XAxis dataKey="date" tick={{fontSize:10,fill:c.textMuted}} axisLine={false} tickLine={false}/>
              <YAxis domain={[70,'auto']} tick={{fontSize:10,fill:c.textMuted}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#fff',border:`1px solid ${c.borderDef}`,borderRadius:8,fontSize:12}}/>
              <Line type="monotone" dataKey="weight" stroke={c.accent} strokeWidth={2.5} dot={{fill:c.accent,r:3}} name="Weight (kg)"/>
            </LineChart>
          </ResponsiveContainer>
        </PCard>
        <PCard style={{ padding:20 }}>
          <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:14, marginBottom:14 }}>Blood Sugar Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={portalProgress.bloodSugar}>
              <CartesianGrid stroke={c.border} strokeDasharray="4 4"/>
              <XAxis dataKey="date" tick={{fontSize:10,fill:c.textMuted}} axisLine={false} tickLine={false}/>
              <YAxis domain={[6,'auto']} tick={{fontSize:10,fill:c.textMuted}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#fff',border:`1px solid ${c.borderDef}`,borderRadius:8,fontSize:12}}/>
              <Line type="monotone" dataKey="value" stroke="#D97706" strokeWidth={2.5} dot={{fill:'#D97706',r:3}} name="Blood Sugar (mmol/L)"/>
            </LineChart>
          </ResponsiveContainer>
        </PCard>
      </div>

      <PCard style={{ padding:18 }}>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:14, marginBottom:14 }}>Weight Loss Journey</div>
        <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap', marginBottom:10 }}>
          <span style={{ fontSize:13, color:c.textMuted }}>Start: <strong style={{color:c.text}}>{s.startWeight} kg</strong></span>
          <ChevronRight size={14} color={c.textPh}/>
          <span style={{ fontSize:13, color:c.textMuted }}>Current: <strong style={{color:c.accent}}>{s.currentWeight} kg</strong></span>
          <ChevronRight size={14} color={c.textPh}/>
          <span style={{ fontSize:13, color:c.textMuted }}>Target: <strong style={{color:c.success}}>{s.targetWeight} kg</strong></span>
        </div>
        <PProgressBar value={s.startWeight - s.currentWeight} max={s.startWeight - s.targetWeight} color={c.success} height={10}/>
        <div style={{ fontSize:12.5, color:c.textMuted, marginTop:8 }}>
          Lost {s.weightLost} kg of {s.startWeight - s.targetWeight} kg goal · {Math.round((s.weightLost / (s.startWeight - s.targetWeight)) * 100)}% complete
        </div>
      </PCard>
    </div>
  );
}

// ─── Portal Billing ───────────────────────────────────────────────────────────
function PortalBilling() {
  const totalOut = portalBilling.reduce((s,b)=>s+b.outstanding,0);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:18 }}>Billing & Payments</h2>
      {totalOut>0&&(
        <div style={{ background:'#FEF2F2', border:`1px solid #FECACA`, borderRadius:12, padding:'14px 18px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:c.danger, marginBottom:2 }}>Outstanding Balance</div>
            <div style={{ fontSize:22, fontWeight:800, fontFamily:"'Plus Jakarta Sans',sans-serif", color:c.danger }}>KES {totalOut.toLocaleString()}</div>
          </div>
          <button style={{ padding:'9px 18px', background:c.danger, color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>Pay Now (M-Pesa)</button>
        </div>
      )}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {portalBilling.map(inv=>(
          <PCard key={inv.id} style={{ padding:18 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
              <div>
                <div style={{ fontSize:11.5, color:c.textMuted, marginBottom:2 }}>{inv.id} · {inv.date}</div>
                <div style={{ fontSize:14, fontWeight:600, color:c.text, marginBottom:4 }}>{inv.description}</div>
                <div style={{ display:'flex', gap:14, fontSize:13 }}>
                  <span style={{ color:c.textMuted }}>Total: <strong style={{color:c.text}}>KES {inv.total.toLocaleString()}</strong></span>
                  <span style={{ color:c.success }}>Paid: <strong>KES {inv.paid.toLocaleString()}</strong></span>
                  {inv.outstanding>0&&<span style={{ color:c.danger }}>Due: <strong>KES {inv.outstanding.toLocaleString()}</strong></span>}
                </div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <PBadge variant={inv.status==='Paid'?'success':inv.status==='Partial'?'warning':'danger'}>{inv.status}</PBadge>
                <button style={{ padding:'6px 12px', background:c.surface2, border:`1px solid ${c.borderDef}`, borderRadius:7, fontSize:12, fontWeight:500, cursor:'pointer', color:c.textSec, fontFamily:"'Inter',sans-serif" }}>Download</button>
                {inv.outstanding>0&&<button style={{ padding:'6px 12px', background:c.accentLight, border:`1px solid ${c.accentMid}`, borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer', color:c.accent, fontFamily:"'Inter',sans-serif" }}>Pay</button>}
              </div>
            </div>
          </PCard>
        ))}
      </div>
    </div>
  );
}

// ─── Portal Messages ──────────────────────────────────────────────────────────
function PortalMessages() {
  const [msgs, setMsgs] = useState(portalMessages);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:'smooth'}),[msgs]);

  const send = () => {
    if(!input.trim()) return;
    setMsgs(prev=>[...prev,{id:Date.now(),from:'Amara Osei',fromRole:'client',message:input.trim(),time:new Date().toLocaleString(),read:true}]);
    setInput('');
    setTimeout(()=>{
      setMsgs(prev=>[...prev,{id:Date.now()+1,from:'Dr. Wanjiku Kariuki',fromRole:'dietitian',message:"Thank you for your message, Amara! I'll review and get back to you shortly. If it's urgent, please call the clinic at +254 700 000 000.",time:new Date().toLocaleString(),read:false}]);
    },1200);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:18 }}>Messages</h2>
      <PCard style={{ overflow:'hidden', display:'flex', flexDirection:'column', height:'calc(100vh - 220px)', minHeight:400 }}>
        <div style={{ padding:'14px 16px', borderBottom:`1px solid ${c.border}`, display:'flex', alignItems:'center', gap:10, background:c.surface }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'#2563EB18', border:'1.5px solid #2563EB40', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:c.accent }}>WK</div>
          <div>
            <div style={{ fontSize:13.5, fontWeight:600, color:c.text }}>Dr. Wanjiku Kariuki</div>
            <div style={{ fontSize:12, color:c.success, display:'flex', alignItems:'center', gap:4 }}><span style={{ width:6, height:6, borderRadius:'50%', background:c.success, display:'inline-block' }}/>Available</div>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:12, background:c.surface2 }}>
          {msgs.map(msg=>(
            <div key={msg.id} style={{ display:'flex', flexDirection:msg.fromRole==='client'?'row-reverse':'row', gap:9, alignItems:'flex-end' }}>
              {msg.fromRole!=='client'&&(
                <div style={{ width:28, height:28, borderRadius:'50%', background:msg.fromRole==='system'?'#6366F118':'#2563EB18', border:`1.5px solid ${msg.fromRole==='system'?'#6366F140':'#2563EB40'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:msg.fromRole==='system'?'#6366F1':c.accent, flexShrink:0 }}>
                  {msg.fromRole==='system'?'NC':'WK'}
                </div>
              )}
              <div style={{ maxWidth:'75%' }}>
                {msg.fromRole!=='client'&&<div style={{ fontSize:11, color:c.textMuted, marginBottom:3 }}>{msg.from}</div>}
                <div style={{ background:msg.fromRole==='client'?c.accent:c.surface, border:`1px solid ${msg.fromRole==='client'?'transparent':c.border}`, borderRadius:msg.fromRole==='client'?'14px 4px 14px 14px':'4px 14px 14px 14px', padding:'10px 13px', fontSize:13, lineHeight:1.6, color:msg.fromRole==='client'?'#fff':c.text }}>
                  {msg.message}
                </div>
                <div style={{ fontSize:10.5, color:c.textPh, marginTop:3, textAlign:msg.fromRole==='client'?'right':'left' }}>{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={endRef}/>
        </div>
        <div style={{ padding:'12px 14px', borderTop:`1px solid ${c.border}`, display:'flex', gap:8, background:c.surface }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Type a message to your dietitian…"
            style={{ flex:1, background:c.surface2, border:`1px solid ${c.borderDef}`, borderRadius:10, padding:'9px 13px', fontSize:13, fontFamily:"'Inter',sans-serif", color:c.text, outline:'none' }}/>
          <button onClick={send} style={{ width:38, height:38, borderRadius:9, background:input.trim()?c.accent:c.surface3, border:`1px solid ${input.trim()?'transparent':c.borderDef}`, cursor:input.trim()?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', color:input.trim()?'#fff':c.textPh, transition:'all 0.15s ease' }}>
            <Send size={14}/>
          </button>
        </div>
      </PCard>
    </div>
  );
}

// ─── Portal Health Tips ────────────────────────────────────────────────────────
function PortalHealthTips() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:18 }}>Health Education</h2>
      {selected ? (
        <PCard style={{ padding:24 }}>
          <button onClick={()=>setSelected(null)} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:c.accent, fontSize:13, fontWeight:600, fontFamily:"'Inter',sans-serif", marginBottom:16 }}>← Back</button>
          <PBadge variant="accent">{selected.category}</PBadge>
          <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:20, fontWeight:700, margin:'12px 0 16px' }}>{selected.title}</h3>
          <p style={{ fontSize:14, color:c.textSec, lineHeight:1.8 }}>{selected.content}</p>
          <div style={{ marginTop:20, padding:14, background:c.accentLight, border:`1px solid ${c.accentMid}`, borderRadius:10 }}>
            <div style={{ fontSize:13, fontWeight:600, color:c.accent, marginBottom:4 }}>💡 Recommended for you</div>
            <div style={{ fontSize:13, color:c.textSec }}>This article was selected based on your care plan goals and current health status.</div>
          </div>
        </PCard>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:14 }}>
          {healthTips.map(tip=>(
            <PCard key={tip.id} style={{ padding:20, cursor:'pointer' }} onClick={()=>setSelected(tip)}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <PBadge variant="accent">{tip.category}</PBadge>
                <span style={{ fontSize:11.5, color:c.textMuted }}>{tip.time}</span>
              </div>
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:700, color:c.text, marginBottom:8, lineHeight:1.4 }}>{tip.title}</div>
              <p style={{ fontSize:13, color:c.textMuted, lineHeight:1.6 }}>{tip.content.substring(0,100)}…</p>
              <div style={{ marginTop:12, fontSize:13, color:c.accent, fontWeight:600 }}>Read more →</div>
            </PCard>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Portal Profile ────────────────────────────────────────────────────────────
function PortalProfile() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:18 }}>My Profile</h2>
      <PCard style={{ padding:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20, flexWrap:'wrap' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:`${c.accent}18`, border:`2px solid ${c.accent}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:700, color:c.accent, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>AO</div>
          <div>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:20, fontWeight:700, marginBottom:4 }}>{currentClient.fullName}</h3>
            <div style={{ fontSize:13, color:c.textMuted }}>Client since {currentClient.memberSince} · Under care of {currentClient.dietitian}</div>
            <div style={{ marginTop:6 }}><PBadge variant="success">Active Client</PBadge></div>
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:12.5, fontWeight:500, color:c.textMuted, marginBottom:6 }}>Profile Completeness</div>
          <PProgressBar value={currentClient.profileComplete} height={8}/>
          <div style={{ fontSize:12, color:c.textMuted, marginTop:5 }}>{currentClient.profileComplete}% complete</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['Email',currentClient.email],['Phone',currentClient.phone],['Date of Birth',currentClient.dob],['Age',`${currentClient.age} years`],['Gender',currentClient.gender],['Address',currentClient.address]].map(([l,v])=>(
            <div key={l} style={{ background:c.surface2, border:`1px solid ${c.border}`, borderRadius:9, padding:'11px 13px' }}>
              <div style={{ fontSize:11.5, color:c.textMuted, marginBottom:2 }}>{l}</div>
              <div style={{ fontSize:13.5, fontWeight:600, color:c.text }}>{v}</div>
            </div>
          ))}
        </div>
      </PCard>
      <PCard style={{ padding:20 }}>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:14, marginBottom:14 }}>Update Password</div>
        <div style={{ display:'flex', flexDirection:'column', gap:11, maxWidth:380 }}>
          {['Current Password','New Password','Confirm New Password'].map(l=>(
            <div key={l}><label style={{ fontSize:12.5, fontWeight:500, color:c.textSec, display:'block', marginBottom:5 }}>{l}</label><input type="password" placeholder="••••••••" style={{ width:'100%', background:c.surface2, border:`1px solid ${c.borderDef}`, borderRadius:8, padding:'9px 12px', fontSize:13, fontFamily:"'Inter',sans-serif", color:c.text, outline:'none' }}/></div>
          ))}
          <button style={{ alignSelf:'flex-start', padding:'9px 18px', background:c.accent, color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>Update Password</button>
        </div>
      </PCard>
    </div>
  );
}

// ─── Portal Root ──────────────────────────────────────────────────────────────
const navItems = [
  {id:'dashboard',label:'Dashboard',icon:LayoutDashboard},
  {id:'appointments',label:'Appointments',icon:Calendar},
  {id:'careplan',label:'Care Plan',icon:Target},
  {id:'progress',label:'My Progress',icon:Activity},
  {id:'billing',label:'Billing',icon:CreditCard},
  {id:'messages',label:'Messages',icon:MessageSquare},
  {id:'tips',label:'Health Tips',icon:BookOpen},
  {id:'profile',label:'My Profile',icon:User},
];

export default function Portal({ onBack }) {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const unread = portalMessages.filter(m=>!m.read&&m.fromRole!=='client').length;

  const pages = { dashboard:PortalDashboard, appointments:PortalAppointments, careplan:PortalCarePlan, progress:PortalProgress, billing:PortalBilling, messages:PortalMessages, tips:PortalHealthTips, profile:PortalProfile };
  const PageComp = pages[page]||PortalDashboard;

  return (
    <div style={{ minHeight:'100vh', background:c.bg, fontFamily:"'Inter',sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ position:'fixed', top:0, left:0, bottom:0, width:SIDEBAR_W, background:c.sidebar, display:'flex', flexDirection:'column', zIndex:100, transform:sidebarOpen?'translateX(0)':'translateX(-100%)', transition:'transform 0.25s ease', boxShadow:'2px 0 12px rgba(0,0,0,0.12)' }}>
        <div style={{ height:60, display:'flex', alignItems:'center', padding:'0 18px', borderBottom:'1px solid rgba(255,255,255,0.07)', gap:10, flexShrink:0 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:c.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Stethoscope size={16} color="#fff"/></div>
          <div><div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:14, color:'#fff', lineHeight:1.2 }}>NutriCare</div><div style={{ fontSize:10, color:'rgba(148,163,184,0.8)', letterSpacing:'0.3px' }}>Client Portal</div></div>
        </div>
        <nav style={{ flex:1, overflowY:'auto', padding:'14px 10px' }}>
          {navItems.map(item=>{
            const Icon=item.icon; const isA=page===item.id;
            return(
              <button key={item.id} onClick={()=>setPage(item.id)} style={{ display:'flex', alignItems:'center', gap:9, width:'100%', padding:'8px 10px', borderRadius:7, border:'none', cursor:'pointer', background:isA?c.accent:'transparent', color:isA?'#fff':'rgba(148,163,184,1)', fontFamily:"'Inter',sans-serif", fontSize:13.5, fontWeight:isA?600:400, transition:'all 0.15s ease', textAlign:'left', marginBottom:1, position:'relative' }}
                onMouseEnter={e=>{if(!isA){e.currentTarget.style.background=c.sidebarHov;e.currentTarget.style.color='#fff';}}}
                onMouseLeave={e=>{if(!isA){e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(148,163,184,1)';}}}
              >
                <Icon size={15} strokeWidth={isA?2.2:1.8}/>{item.label}
                {item.id==='messages'&&unread>0&&<span style={{ marginLeft:'auto', width:18, height:18, borderRadius:'50%', background:c.danger, color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{unread}</span>}
              </button>
            );
          })}
        </nav>
        <div style={{ padding:12, borderTop:'1px solid rgba(255,255,255,0.07)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 4px', marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:`${c.accent}30`, border:`1.5px solid ${c.accent}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#93C5FD', flexShrink:0 }}>AO</div>
            <div style={{ overflow:'hidden' }}>
              <div style={{ fontSize:12.5, fontWeight:600, color:'#E2E8F0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{currentClient.fullName}</div>
              <div style={{ fontSize:11, color:'rgba(148,163,184,0.8)' }}>Patient</div>
            </div>
          </div>
          <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:7, width:'100%', padding:'8px 10px', background:'rgba(220,38,38,0.15)', border:'1px solid rgba(220,38,38,0.3)', borderRadius:7, color:'#FCA5A5', cursor:'pointer', fontSize:12.5, fontFamily:"'Inter',sans-serif", fontWeight:500 }}>
            <LogOut size={13}/> Back to Admin
          </button>
        </div>
      </aside>

      {/* Header */}
      <header style={{ position:'fixed', top:0, left:sidebarOpen?SIDEBAR_W:0, right:0, height:60, background:'#fff', borderBottom:`1px solid ${c.border}`, display:'flex', alignItems:'center', padding:'0 20px', gap:14, zIndex:50, transition:'left 0.25s ease', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
        <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{ background:'none', border:'none', cursor:'pointer', color:c.textMuted, padding:6, borderRadius:6, display:'flex', alignItems:'center', transition:'all 0.15s ease' }}
          onMouseEnter={e=>{e.currentTarget.style.background=c.surface2;e.currentTarget.style.color=c.text;}}
          onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=c.textMuted;}}>
          <Menu size={19}/>
        </button>
        <div style={{ flex:1 }}/>
        <div style={{ fontSize:12.5, color:c.textMuted, fontWeight:500 }}>
          {new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}
        </div>
        <div style={{ width:34, height:34, borderRadius:'50%', background:`${c.accent}18`, border:`1.5px solid ${c.accent}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:c.accent }}>AO</div>
      </header>

      {/* Main content */}
      <main style={{ marginLeft:sidebarOpen?SIDEBAR_W:0, paddingTop:60, transition:'margin-left 0.25s ease', minHeight:'100vh' }}>
        <div style={{ padding:'24px 24px', maxWidth:1200, margin:'0 auto' }}>
          <PageComp setPage={setPage}/>
        </div>
      </main>
    </div>
  );
}
