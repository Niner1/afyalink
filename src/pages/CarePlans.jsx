import React, { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Card, Badge, Button, Avatar, Modal, Input, Select, ProgressBar } from '../components/UI';
// Using real backend APIs
import { useApp } from '../context/AppContext';
import { Plus, CheckCircle, Circle, Clock, Target, FileText, MessageSquare, Sparkles, Upload, ChevronDown, ChevronUp, Edit } from 'lucide-react';

const goalStatusV={ Achieved:'success','In Progress':'accent','Not Started':'default' };
const goalIcon={ Achieved:CheckCircle,'In Progress':Clock,'Not Started':Circle };
const goalColor={ Achieved:'var(--success)','In Progress':'var(--accent)','Not Started':'var(--text-placeholder)' };

export default function CarePlans() {
  const { setAiAssistantOpen } = useApp();
  const [sel, setSel] = useState(mockCarePlans[0]);
  const [addModal, setAddModal] = useState(false);
  const [showGoals, setShowGoals] = useState(true);
  const [showNotes, setShowNotes] = useState(true);

  const progress=p=>Math.round((p.goals.filter(g=>g.status==='Achieved').length/p.goals.length)*100);

  return (
    <div style={{ display:'flex', gap:16, animation:'fadeIn 0.25s ease', flexWrap:'wrap' }}>
      {/* List */}
      <div style={{ width:260, flexShrink:0, display:'flex', flexDirection:'column', gap:10 }}>
        <Button variant="primary" icon={Plus} onClick={()=>setAddModal(true)} style={{ width:'100%', justifyContent:'center' }}>New Care Plan</Button>
        {mockCarePlans.map(p=>{
          const isS=sel?.id===p.id; const prog=progress(p);
          return (
            <div key={p.id} onClick={()=>setSel(p)} style={{ background:isS?'var(--accent-light)':'var(--bg-surface)', border:`1px solid ${isS?'var(--accent-mid)':'var(--border-light)'}`, borderRadius:12, padding:14, cursor:'pointer', transition:'var(--transition)', boxShadow:isS?'var(--shadow-sm)':'var(--shadow-xs)' }}
              onMouseEnter={e=>{if(!isS)e.currentTarget.style.background='var(--bg-surface-2)';}}
              onMouseLeave={e=>{if(!isS)e.currentTarget.style.background='var(--bg-surface)';}}>
              <div style={{ display:'flex', gap:9, alignItems:'flex-start', marginBottom:10 }}>
                <Avatar name={p.clientName} size={34}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:isS?'var(--accent)':'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.clientName}</div>
                  <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>Updated {p.updatedDate}</div>
                </div>
                <Badge variant={p.status==='Active'?'success':'default'} style={{fontSize:10}}>Active</Badge>
              </div>
              <div style={{ fontSize:11.5, color:'var(--text-muted)', marginBottom:5 }}>Goals: {prog}%</div>
              <ProgressBar value={prog} color={isS?'var(--accent)':'var(--success)'} height={4}/>
            </div>
          );
        })}
      </div>

      {/* Detail */}
      {sel&&(
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:14 }}>
          <Card style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <Avatar name={sel.clientName} size={46}/>
                <div>
                  <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18 }}>{sel.clientName}</h2>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{sel.id} · Created {sel.createdDate} · {sel.dietitian}</div>
                  <div style={{ display:'flex', gap:6, marginTop:6 }}><Badge variant="success">Active</Badge><Badge variant="default">{sel.goals.length} Goals</Badge></div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <Button variant="secondary" size="sm" icon={Edit}>Edit</Button>
                <Button variant="ghost" size="sm" icon={Sparkles} onClick={()=>setAiAssistantOpen(true)}>AFyalinkAI</Button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
              <div style={{ background:'var(--bg-surface-2)', border:'1px solid var(--border-light)', borderRadius:9, padding:14 }}>
                <div style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)', letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:6 }}>Nutrition Diagnosis</div>
                <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6 }}>{sel.nutritionDiagnosis}</p>
              </div>
              <div style={{ background:'var(--bg-surface-2)', border:'1px solid var(--border-light)', borderRadius:9, padding:14 }}>
                <div style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)', letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:6 }}>Diet Prescription</div>
                <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6 }}>{sel.dietPrescription}</p>
              </div>
            </div>
            {sel.mealPlanFile&&(
              <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--accent-light)', border:'1px solid var(--accent-mid)', borderRadius:9, padding:'10px 14px' }}>
                <FileText size={15} color="var(--accent)"/>
                <span style={{ flex:1, fontSize:13, color:'var(--accent)' }}>{sel.mealPlanFile}</span>
                <Button variant="secondary" size="sm">Download</Button>
                <Button variant="secondary" size="sm" icon={Upload}>Update</Button>
              </div>
            )}
          </Card>

          {/* Goals */}
          <Card style={{ overflow:'hidden' }}>
            <button onClick={()=>setShowGoals(!showGoals)} style={{ width:'100%', padding:'15px 20px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', color:'var(--text-primary)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Target size={15} color="var(--accent)"/>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14 }}>Behaviour Change Goals</span>
                <span style={{ fontSize:11, background:'var(--accent-light)', color:'var(--accent)', padding:'2px 8px', borderRadius:20, border:'1px solid var(--accent-mid)' }}>{sel.goals.filter(g=>g.status==='Achieved').length}/{sel.goals.length} achieved</span>
              </div>
              {showGoals?<ChevronUp size={15} color="var(--text-muted)"/>:<ChevronDown size={15} color="var(--text-muted)"/>}
            </button>
            {showGoals&&(
              <div style={{ padding:'0 20px 16px' }}>
                <ProgressBar value={progress(sel)} height={6}/>
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
                  {sel.goals.map(g=>{
                    const GIcon=goalIcon[g.status]||Circle;
                    return (
                      <div key={g.id} style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 13px', background:g.status==='Achieved'?'var(--success-light)':'var(--bg-surface-2)', border:`1px solid ${g.status==='Achieved'?'var(--success-mid)':'var(--border-light)'}`, borderRadius:9 }}>
                        <GIcon size={15} color={goalColor[g.status]} style={{flexShrink:0}}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, color:'var(--text-primary)', marginBottom:2 }}>{g.goal}</div>
                          <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>Target: {g.target}</div>
                        </div>
                        <Badge variant={goalStatusV[g.status]||'default'} style={{fontSize:10.5}}>{g.status}</Badge>
                        <Button variant="ghost" size="sm">Update</Button>
                      </div>
                    );
                  })}
                  <Button variant="secondary" size="sm" icon={Plus} style={{alignSelf:'flex-start'}}>Add Goal</Button>
                </div>
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card style={{ overflow:'hidden' }}>
            <button onClick={()=>setShowNotes(!showNotes)} style={{ width:'100%', padding:'15px 20px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', color:'var(--text-primary)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <MessageSquare size={15} color="var(--info)"/>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14 }}>Follow-up Notes</span>
                <span style={{ fontSize:11, background:'var(--info-light)', color:'var(--info)', padding:'2px 8px', borderRadius:20, border:'1px solid var(--info-mid)' }}>{sel.followUpNotes.length} entries</span>
              </div>
              {showNotes?<ChevronUp size={15} color="var(--text-muted)"/>:<ChevronDown size={15} color="var(--text-muted)"/>}
            </button>
            {showNotes&&(
              <div style={{ padding:'0 20px 16px', display:'flex', flexDirection:'column', gap:9 }}>
                {sel.followUpNotes.map((n,i)=>(
                  <div key={i} style={{ padding:'11px 13px', background:'var(--bg-surface-2)', borderRadius:9, borderLeft:'3px solid var(--info)', border:'1px solid var(--border-light)' }}>
                    <div style={{ fontSize:11.5, color:'var(--text-muted)', marginBottom:4 }}>{n.date}</div>
                    <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6 }}>{n.note}</p>
                  </div>
                ))}
                <Input placeholder="Add a follow-up note…"/>
                <Button variant="primary" size="sm" style={{alignSelf:'flex-start'}}>Add Note</Button>
              </div>
            )}
          </Card>
        </div>
      )}

      <Modal open={addModal} onClose={()=>setAddModal(false)} title="Create New Care Plan" width={640}>
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          <Select label="Client *"><option value="">Select…</option><option>Amara Osei</option><option>James Mwangi</option><option>Fatima Al-Hassan</option></Select>
          <Input label="Nutrition Diagnosis (PES)"/>
          <Input label="Diet Prescription" placeholder="Kcal target, macronutrient breakdown…"/>
          <div style={{ fontSize:12.5, fontWeight:500, color:'var(--text-secondary)' }}>Behaviour Change Goals</div>
          {[1,2,3].map(i=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:8 }}>
              <Input placeholder={`Goal ${i}…`}/>
              <Input type="date" style={{width:140}}/>
            </div>
          ))}
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <Button variant="secondary" onClick={()=>setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={()=>setAddModal(false)}>Save Care Plan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
