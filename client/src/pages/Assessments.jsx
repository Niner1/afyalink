import React, { useState, useMemo, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { Card, Badge, Button, Avatar, Modal, Input, Select } from '../components/UI';
import { useApp } from '../context/AppContext';
import { Plus, AlertTriangle, Sparkles, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const bmiColor=bmi=>bmi<18.5?'var(--info)':bmi<25?'var(--success)':bmi<30?'var(--warning)':'var(--danger)';
const riskV={ 'High Risk':'danger','Critical':'danger','Medium Risk':'warning','Low Risk':'success' };

export default function Assessments() {
  const { setAiAssistantOpen } = useApp();
  const [sel, setSel] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [clientIdFilter, setClientIdFilter] = useState('1');
  const [newAssessment, setNewAssessment] = useState({ assessmentId: '', clientId: '', height: '', weight: '', bmi: '', bloodPressure: '', riskClassification: 'Low Risk', notes: '' });

  // Fetch assessments from backend - requires clientId
  const { data: assessments = [], isLoading, error } = trpc.assessment.list.useQuery({ clientId: parseInt(clientIdFilter) || 1 });
  const createMutation = trpc.assessment.create.useMutation();
  const utils = trpc.useUtils();

  // Set first assessment as selected if available
  useEffect(() => {
    if (assessments.length > 0 && !sel) {
      setSel(assessments[0]);
    }
  }, [assessments, sel]);

  const handleCreateAssessment = async () => {
    try {
      await createMutation.mutateAsync({
        assessmentId: newAssessment.assessmentId || `ASS-${Date.now()}`,
        clientId: parseInt(newAssessment.clientId),
        assessmentDate: new Date(),
        weight: parseFloat(newAssessment.weight),
        height: parseFloat(newAssessment.height),
        bmi: parseFloat(newAssessment.bmi),
        bloodPressure: newAssessment.bloodPressure,
        riskClassification: newAssessment.riskClassification,
        notes: newAssessment.notes
      });
      setNewAssessment({ assessmentId: '', clientId: '', height: '', weight: '', bmi: '', bloodPressure: '', riskClassification: 'Low Risk', notes: '' });
      setAddModal(false);
      await utils.assessment.list.invalidate();
    } catch (err) {
      console.error('Failed to create assessment:', err);
    }
  };

  if (error) return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:16, background:'var(--danger-light)', border:'1px solid var(--danger)', borderRadius:8, color:'var(--danger)' }}>
      <AlertCircle size={20} />
      <span>Failed to load assessments. Please try again.</span>
    </div>
  );

  return (
    <div style={{ display:'flex', gap:16, animation:'fadeIn 0.25s ease', flexWrap:'wrap' }}>
      {/* List */}
      <div style={{ width:260, flexShrink:0, display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <label style={{ fontSize:12, fontWeight:600, color:'var(--text-secondary)' }}>Filter by Client ID</label>
          <Input placeholder="Client ID" value={clientIdFilter} onChange={e=>setClientIdFilter(e.target.value)} />
        </div>
        <Button variant="primary" icon={Plus} onClick={()=>setAddModal(true)} style={{ width:'100%', justifyContent:'center' }}>New Assessment</Button>
        {isLoading ? (
          <div style={{ padding:20, textAlign:'center', color:'var(--text-muted)' }}>Loading...</div>
        ) : assessments.length === 0 ? (
          <div style={{ padding:20, textAlign:'center', color:'var(--text-muted)' }}>No assessments</div>
        ) : assessments.map(a=>{
          const isS=sel?.id===a.id;
          return (
            <div key={a.id} onClick={()=>setSel(a)} style={{ background:isS?'var(--accent-light)':'var(--bg-surface)', border:`1px solid ${isS?'var(--accent-mid)':'var(--border-light)'}`, borderRadius:12, padding:14, cursor:'pointer', transition:'var(--transition)', boxShadow:isS?'var(--shadow-sm)':'var(--shadow-xs)' }}
              onMouseEnter={e=>{ if(!isS)e.currentTarget.style.background='var(--bg-surface-2)'; }}
              onMouseLeave={e=>{ if(!isS)e.currentTarget.style.background='var(--bg-surface)'; }}>
              <div style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:10 }}>
                <Avatar name={a.clientName || 'Client'} size={34}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:isS?'var(--accent)':'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.clientName || 'Unknown'}</div>
                  <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{new Date(a.assessmentDate).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                <Badge variant={riskV[a.riskClassification]||'default'} style={{fontSize:10.5}}>{a.riskClassification}</Badge>
                <span style={{ fontSize:11.5, color:'var(--text-muted)', display:'flex', alignItems:'center' }}>BMI {parseFloat(a.bmi || 0).toFixed(1)}</span>
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
                <Avatar name={sel.clientName || 'Client'} size={40}/>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>{sel.clientName || 'Unknown'}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>Assessment • {new Date(sel.assessmentDate).toLocaleDateString()}</div>
                </div>
              </div>
              <Badge variant={riskV[sel.riskClassification]||'default'}>{sel.riskClassification}</Badge>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:12, marginBottom:16 }}>
              <div style={{ background:'var(--bg-surface)', padding:12, borderRadius:8 }}>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>BMI</div>
                <div style={{ fontSize:18, fontWeight:700, color:bmiColor(parseFloat(sel.bmi || 0)) }}>{parseFloat(sel.bmi || 0).toFixed(1)}</div>
                <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:2 }}>
                  {parseFloat(sel.bmi || 0)<18.5?'Underweight':parseFloat(sel.bmi || 0)<25?'Normal':parseFloat(sel.bmi || 0)<30?'Overweight':'Obese'}
                </div>
              </div>
              <div style={{ background:'var(--bg-surface)', padding:12, borderRadius:8 }}>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>Weight</div>
                <div style={{ fontSize:18, fontWeight:700, color:'var(--text-primary)' }}>{sel.weight} kg</div>
              </div>
              <div style={{ background:'var(--bg-surface)', padding:12, borderRadius:8 }}>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>Height</div>
                <div style={{ fontSize:18, fontWeight:700, color:'var(--text-primary)' }}>{sel.height} cm</div>
              </div>
              <div style={{ background:'var(--bg-surface)', padding:12, borderRadius:8 }}>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>BP</div>
                <div style={{ fontSize:18, fontWeight:700, color:'var(--text-primary)' }}>{sel.bloodPressure}</div>
              </div>
            </div>

            {sel.notes && (
              <div style={{ background:'var(--bg-surface)', padding:12, borderRadius:8, marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:600, marginBottom:6, color:'var(--text-secondary)' }}>Notes</div>
                <div style={{ fontSize:13, color:'var(--text-primary)', lineHeight:1.5 }}>{sel.notes}</div>
              </div>
            )}

            <div style={{ display:'flex', gap:8 }}>
              <Button variant="secondary" icon={Sparkles} onClick={()=>setAiAssistantOpen(true)}>Get AI Insights</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Add Assessment Modal */}
      <Modal open={addModal} title="New Assessment" onClose={()=>setAddModal(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <Input placeholder="Client ID" value={newAssessment.clientId} onChange={e=>setNewAssessment({...newAssessment, clientId:e.target.value})} />
            <Input type="number" placeholder="Weight (kg)" value={newAssessment.weight} onChange={e=>setNewAssessment({...newAssessment, weight:e.target.value})} />
            <Input type="number" placeholder="Height (cm)" value={newAssessment.height} onChange={e=>setNewAssessment({...newAssessment, height:e.target.value})} />
            <Input type="number" placeholder="BMI" value={newAssessment.bmi} onChange={e=>setNewAssessment({...newAssessment, bmi:e.target.value})} />
            <Input placeholder="Blood Pressure (e.g., 120/80)" value={newAssessment.bloodPressure} onChange={e=>setNewAssessment({...newAssessment, bloodPressure:e.target.value})} />
            <Select value={newAssessment.riskClassification} onChange={e=>setNewAssessment({...newAssessment, riskClassification:e.target.value})}>
              <option>Low Risk</option>
              <option>Medium Risk</option>
              <option>High Risk</option>
              <option>Critical</option>
            </Select>
            <Input placeholder="Notes" value={newAssessment.notes} onChange={e=>setNewAssessment({...newAssessment, notes:e.target.value})} />
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <Button variant="ghost" onClick={()=>setAddModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateAssessment} disabled={createMutation.isPending}>Create</Button>
            </div>
            </div>
          </Modal>
    </div>
  );
}
