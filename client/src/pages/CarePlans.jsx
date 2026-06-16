import React, { useState, useMemo, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { Card, Badge, Button, Avatar, Modal, Input, Select, ProgressBar } from '../components/UI';
import { useApp } from '../context/AppContext';
import { Plus, CheckCircle, Circle, Clock, Target, FileText, MessageSquare, Sparkles, Upload, ChevronDown, ChevronUp, Edit, AlertCircle } from 'lucide-react';

const goalStatusV={ Achieved:'success','In Progress':'accent','Not Started':'default' };
const goalIcon={ Achieved:CheckCircle,'In Progress':Clock,'Not Started':Circle };
const goalColor={ Achieved:'var(--success)','In Progress':'var(--accent)','Not Started':'var(--text-placeholder)' };

export default function CarePlans() {
  const { setAiAssistantOpen } = useApp();
  const [sel, setSel] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [showGoals, setShowGoals] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [clientIdFilter, setClientIdFilter] = useState('1');
  const [newCarePlan, setNewCarePlan] = useState({ carePlanId: '', clientId: '', clientName: '', nutritionDiagnosis: '', dietPrescription: '', goals: '' });

  // Fetch care plans from backend - requires clientId
  const { data: carePlans = [], isLoading, error } = trpc.carePlan.list.useQuery({ clientId: parseInt(clientIdFilter) || 1 });
  const createMutation = trpc.carePlan.create.useMutation();
  const utils = trpc.useUtils();

  // Set first care plan as selected if available
  useEffect(() => {
    if (carePlans.length > 0 && !sel) {
      setSel(carePlans[0]);
    }
  }, [carePlans, sel]);

  const progress=p=>{
    if (!p.goals || p.goals.length === 0) return 0;
    const achieved = Array.isArray(p.goals) ? p.goals.filter(g=>g.status==='Achieved').length : 0;
    return Math.round((achieved / p.goals.length) * 100);
  };

  const handleCreateCarePlan = async () => {
    try {
      const goalsList = newCarePlan.goals.split('\n').filter(g => g.trim()).map((g, i) => ({ 
        id: i + 1, 
        goal: g.trim(), 
        status: 'Not Started',
        target: ''
      }));
      
      await createMutation.mutateAsync({
        carePlanId: newCarePlan.carePlanId || `CP-${Date.now()}`,
        clientId: parseInt(newCarePlan.clientId),
        clientName: newCarePlan.clientName,
        createdDate: new Date(),
        updatedDate: new Date(),
        nutritionDiagnosis: newCarePlan.nutritionDiagnosis,
        dietPrescription: newCarePlan.dietPrescription,
        goals: goalsList,
        status: 'Active'
      });
      setNewCarePlan({ carePlanId: '', clientId: '', clientName: '', nutritionDiagnosis: '', dietPrescription: '', goals: '' });
      setAddModal(false);
      await utils.carePlan.list.invalidate();
    } catch (err) {
      console.error('Failed to create care plan:', err);
    }
  };

  if (error) return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:16, background:'var(--danger-light)', border:'1px solid var(--danger)', borderRadius:8, color:'var(--danger)' }}>
      <AlertCircle size={20} />
      <span>Failed to load care plans. Please try again.</span>
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
        <Button variant="primary" icon={Plus} onClick={()=>setAddModal(true)} style={{ width:'100%', justifyContent:'center' }}>New Care Plan</Button>
        {isLoading ? (
          <div style={{ padding:20, textAlign:'center', color:'var(--text-muted)' }}>Loading...</div>
        ) : carePlans.length === 0 ? (
          <div style={{ padding:20, textAlign:'center', color:'var(--text-muted)' }}>No care plans</div>
        ) : carePlans.map(p=>{
          const isS=sel?.id===p.id; const prog=progress(p);
          return (
            <div key={p.id} onClick={()=>setSel(p)} style={{ background:isS?'var(--accent-light)':'var(--bg-surface)', border:`1px solid ${isS?'var(--accent-mid)':'var(--border-light)'}`, borderRadius:12, padding:14, cursor:'pointer', transition:'var(--transition)', boxShadow:isS?'var(--shadow-sm)':'var(--shadow-xs)' }}
              onMouseEnter={e=>{if(!isS)e.currentTarget.style.background='var(--bg-surface-2)';}}
              onMouseLeave={e=>{if(!isS)e.currentTarget.style.background='var(--bg-surface)';}}>
              <div style={{ display:'flex', gap:9, alignItems:'flex-start', marginBottom:10 }}>
                <Avatar name={p.clientName || 'Client'} size={34}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:isS?'var(--accent)':'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.clientName || 'Unknown'}</div>
                  <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>Updated {new Date(p.updatedDate).toLocaleDateString()}</div>
                </div>
                <Badge variant={p.status==='Active'?'success':'default'} style={{fontSize:10}}>{p.status}</Badge>
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
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <Avatar name={sel.clientName || 'Client'} size={40}/>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>{sel.clientName || 'Unknown'}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>Care Plan • {new Date(sel.createdDate).toLocaleDateString()}</div>
                </div>
              </div>
              <Badge variant={sel.status==='Active'?'success':'default'}>{sel.status}</Badge>
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:600, color:'var(--text-secondary)' }}>Progress: {progress(sel)}%</span>
              <span style={{ fontSize:12, color:'var(--text-muted)' }}>{sel.goals?.filter(g=>g.status==='Achieved').length || 0}/{sel.goals?.length || 0} goals</span>
            </div>
            <ProgressBar value={progress(sel)} color="var(--accent)" height={6} style={{ marginBottom:16 }}/>

            {/* Nutrition Diagnosis */}
            {sel.nutritionDiagnosis && (
              <div style={{ marginBottom:16, background:'var(--bg-surface)', padding:12, borderRadius:8 }}>
                <div style={{ fontSize:12, fontWeight:600, marginBottom:6, color:'var(--text-secondary)' }}>Nutrition Diagnosis</div>
                <div style={{ fontSize:13, color:'var(--text-primary)', lineHeight:1.5 }}>{sel.nutritionDiagnosis}</div>
              </div>
            )}

            {/* Goals Section */}
            <div style={{ marginBottom:16, borderTop:'1px solid var(--border-light)', paddingTop:16 }}>
              <button onClick={()=>setShowGoals(!showGoals)} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', background:'none', border:'none', cursor:'pointer', padding:0, marginBottom:12 }}>
                {showGoals?<ChevronUp size={16}/>:<ChevronDown size={16}/>}
                <Target size={16} color="var(--accent)"/>
                <span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>Goals</span>
              </button>
              {showGoals && (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {sel.goals && sel.goals.map((g,i)=>{
                    const Icon=goalIcon[g.status] || Circle;
                    return (
                      <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:10, background:'var(--bg-surface)', borderRadius:8 }}>
                        <Icon size={18} color={goalColor[g.status]} style={{ marginTop:2, flexShrink:0 }}/>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, fontWeight:500, color:'var(--text-primary)' }}>{g.goal}</div>
                          <Badge variant={goalStatusV[g.status]||'default'} style={{ fontSize:10, marginTop:4 }}>{g.status}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Diet Prescription */}
            {sel.dietPrescription && (
              <div style={{ marginBottom:16, borderTop:'1px solid var(--border-light)', paddingTop:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <FileText size={16} color="var(--accent)"/>
                  <span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>Diet Prescription</span>
                </div>
                <div style={{ background:'var(--bg-surface)', padding:12, borderRadius:8, fontSize:13, color:'var(--text-primary)', lineHeight:1.6 }}>
                  {sel.dietPrescription}
                </div>
              </div>
            )}

            <div style={{ display:'flex', gap:8 }}>
              <Button variant="secondary" icon={Sparkles} onClick={()=>setAiAssistantOpen(true)}>Get AI Suggestions</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Add Care Plan Modal */}
      <Modal open={addModal} title="New Care Plan" onClose={()=>setAddModal(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <Input placeholder="Client ID" value={newCarePlan.clientId} onChange={e=>setNewCarePlan({...newCarePlan, clientId:e.target.value})} />
            <Input placeholder="Client Name" value={newCarePlan.clientName} onChange={e=>setNewCarePlan({...newCarePlan, clientName:e.target.value})} />
            <textarea placeholder="Nutrition Diagnosis" value={newCarePlan.nutritionDiagnosis} onChange={e=>setNewCarePlan({...newCarePlan, nutritionDiagnosis:e.target.value})} style={{ padding:10, border:'1px solid var(--border-light)', borderRadius:6, fontFamily:'var(--font-body)', fontSize:13, minHeight:80, resize:'vertical' }} />
            <textarea placeholder="Diet Prescription" value={newCarePlan.dietPrescription} onChange={e=>setNewCarePlan({...newCarePlan, dietPrescription:e.target.value})} style={{ padding:10, border:'1px solid var(--border-light)', borderRadius:6, fontFamily:'var(--font-body)', fontSize:13, minHeight:80, resize:'vertical' }} />
            <textarea placeholder="Goals (one per line)" value={newCarePlan.goals} onChange={e=>setNewCarePlan({...newCarePlan, goals:e.target.value})} style={{ padding:10, border:'1px solid var(--border-light)', borderRadius:6, fontFamily:'var(--font-body)', fontSize:13, minHeight:100, resize:'vertical' }} />
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <Button variant="ghost" onClick={()=>setAddModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateCarePlan} disabled={createMutation.isPending}>Create</Button>
            </div>
            </div>
          </Modal>
    </div>
  );
}
