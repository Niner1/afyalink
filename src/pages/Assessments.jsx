import React, { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Card, Badge, Button, Avatar, Modal, Input, Select } from '../components/UI';
// Using real backend APIs
import { useApp } from '../context/AppContext';
import { Plus, AlertTriangle, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const bmiColor=bmi=>bmi<18.5?'var(--info)':bmi<25?'var(--success)':bmi<30?'var(--warning)':'var(--danger)';
const riskV={ 'High Risk':'danger','Critical':'danger','Moderate Risk':'warning','Low Risk':'success' };

export default function Assessments() {
  const { setAiAssistantOpen } = useApp();
  const [sel, setSel] = useState(mockAssessments[0]);
  const [addModal, setAddModal] = useState(false);
  const clientName = id => id==='CLT-001'?'Amara Osei':'Grace Akinyi';

  return (
    <div style={{ display:'flex', gap:16, animation:'fadeIn 0.25s ease', flexWrap:'wrap' }}>
      {/* List */}
      <div style={{ width:260, flexShrink:0, display:'flex', flexDirection:'column', gap:10 }}>
        <Button variant="primary" icon={Plus} onClick={()=>setAddModal(true)} style={{ width:'100%', justifyContent:'center' }}>New Assessment</Button>
        {mockAssessments.map(a=>{
          const isS=sel?.id===a.id;
          return (
            <div key={a.id} onClick={()=>setSel(a)} style={{ background:isS?'var(--accent-light)':'var(--bg-surface)', border:`1px solid ${isS?'var(--accent-mid)':'var(--border-light)'}`, borderRadius:12, padding:14, cursor:'pointer', transition:'var(--transition)', boxShadow:isS?'var(--shadow-sm)':'var(--shadow-xs)' }}
              onMouseEnter={e=>{ if(!isS)e.currentTarget.style.background='var(--bg-surface-2)'; }}
              onMouseLeave={e=>{ if(!isS)e.currentTarget.style.background='var(--bg-surface)'; }}>
              <div style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10 }}>
                <Avatar name={clientName(a.clientId)} size={34}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:isS?'var(--accent)':'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{clientName(a.clientId)}</div>
                  <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{a.date}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                <Badge variant={riskV[a.riskClassification]||'default'} style={{fontSize:10.5}}>{a.riskClassification}</Badge>
                <span style={{ fontSize:11.5, color:'var(--text-muted)', display:'flex', alignItems:'center' }}>BMI {a.bmi}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail */}
      {sel&&(
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:14 }}>
          <Card style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <Avatar name={clientName(sel.clientId)} size={44}/>
                <div>
                  <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17 }}>{clientName(sel.clientId)}</h3>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{sel.id} · {sel.date} · {sel.dietitian}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <Badge variant={riskV[sel.riskClassification]||'default'}>{sel.riskClassification}</Badge>
                <Button variant="ghost" size="sm" icon={Sparkles} onClick={()=>setAiAssistantOpen(true)}>AFyalinkAI</Button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))', gap:10 }}>
              {[['Height',`${sel.height} cm`],['Weight',`${sel.weight} kg`],['BMI',sel.bmi,true],['Waist',`${sel.waistCircumference} cm`],['Blood Pressure',sel.bloodPressure]].map(([l,v,colored])=>(
                <div key={l} style={{ background:'var(--bg-surface-2)', border:'1px solid var(--border-light)', borderRadius:9, padding:'11px 13px', textAlign:'center' }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:18, fontWeight:700, fontFamily:'var(--font-display)', color:colored?bmiColor(sel.bmi):'var(--text-primary)' }}>{v}</div>
                  {colored&&<div style={{ fontSize:10, color:bmiColor(sel.bmi), marginTop:2 }}>{sel.bmiCategory}</div>}
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <Card style={{ padding:20 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:14, marginBottom:12 }}>Weight Trend</div>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={sel.weightHistory}>
                  <CartesianGrid stroke="var(--border-light)"/>
                  <XAxis dataKey="date" tick={{fontSize:10,fill:'var(--text-muted)'}} tickFormatter={d=>d.slice(5)} axisLine={false} tickLine={false}/>
                  <YAxis domain={['auto','auto']} tick={{fontSize:10,fill:'var(--text-muted)'}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:'#fff',border:'1px solid var(--border-light)',borderRadius:8,fontSize:12}}/>
                  <Line type="monotone" dataKey="weight" stroke={sel.clientId==='CLT-001'?'var(--accent)':'var(--danger)'} strokeWidth={2} dot={{fill:sel.clientId==='CLT-001'?'var(--accent)':'var(--danger)',r:3}}/>
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card style={{ padding:20 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:14, marginBottom:12 }}>Clinical Indicators</div>
              {[['Blood Sugar',sel.bloodSugar?`${sel.bloodSugar} mmol/L`:'N/A',sel.bloodSugar&&sel.bloodSugar<7.0],['Blood Pressure',sel.bloodPressure,false],['BMI Category',sel.bmiCategory,sel.bmiCategory==='Normal weight']].map(([l,v,good])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 12px', background:'var(--bg-surface-2)', borderRadius:8, marginBottom:7, border:'1px solid var(--border-light)' }}>
                  <span style={{ fontSize:13, color:'var(--text-secondary)' }}>{l}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:good?'var(--success)':'var(--warning)' }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>

          <Card style={{ padding:20 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:14, marginBottom:12 }}>Dietary Assessment & 24-hr Recall</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6, fontWeight:500 }}>Dietary Assessment</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.65, background:'var(--bg-surface-2)', border:'1px solid var(--border-light)', borderRadius:8, padding:'11px 13px' }}>{sel.dietaryAssessment}</div>
              </div>
              <div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6, fontWeight:500 }}>24-Hour Recall</div>
                <div style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.65, background:'var(--bg-surface-2)', border:'1px solid var(--border-light)', borderRadius:8, padding:'11px 13px' }}>{sel.foodRecall}</div>
              </div>
            </div>
          </Card>

          <Card style={{ padding:18 }}>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:36, height:36, borderRadius:9, background:'var(--danger-light)', border:'1px solid var(--danger-mid)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <AlertTriangle size={16} color="var(--danger)"/>
              </div>
              <div>
                <div style={{ fontSize:11.5, fontWeight:600, color:'var(--text-muted)', letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:5 }}>Nutrition Diagnosis (PES)</div>
                <div style={{ fontSize:13.5, color:'var(--text-primary)', lineHeight:1.6 }}>{sel.nutritionDiagnosis}</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Modal open={addModal} onClose={()=>setAddModal(false)} title="New Clinical Assessment" width={700}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:13 }}>
          <Select label="Client *"><option>Amara Osei</option><option>James Mwangi</option><option>Fatima Al-Hassan</option></Select>
          <Input label="Date *" type="date" defaultValue="2025-05-17"/>
          <Input label="Height (cm)" type="number" placeholder="165"/>
          <Input label="Weight (kg)" type="number" placeholder="72"/>
          <Input label="Waist (cm)" type="number" placeholder="85"/>
          <Input label="Blood Pressure" placeholder="120/80"/>
          <Input label="Blood Sugar (mmol/L)" type="number"/>
          <Select label="Risk"><option>Low Risk</option><option>Moderate Risk</option><option>High Risk</option><option>Critical</option></Select>
          <div style={{ gridColumn:'1/-1' }}><Input label="Dietary Assessment" placeholder="Eating patterns, meal frequency…"/></div>
          <div style={{ gridColumn:'1/-1' }}><Input label="24-Hour Recall" placeholder="Breakfast, Lunch, Dinner, Snacks…"/></div>
          <div style={{ gridColumn:'1/-1' }}><Input label="Nutrition Diagnosis (PES)" placeholder="Excessive energy intake related to…"/></div>
          <div style={{ gridColumn:'1/-1', display:'flex', gap:8, justifyContent:'flex-end' }}>
            <Button variant="secondary" onClick={()=>setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={()=>setAddModal(false)}>Save Assessment</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
