import React, { useState, useMemo, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { Card, Badge, Button, Avatar, Modal, Select, Input, TableWrapper, Th, Td } from '../components/UI';
import { Plus, Clock, Video, MapPin, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const statusV = { Confirmed:'success', Pending:'warning', Completed:'default', Scheduled:'accent', Cancelled:'danger' };
const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function calDays(y,m){ const fd=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate(), d=[]; for(let i=0;i<fd;i++)d.push(null); for(let i=1;i<=dim;i++)d.push(i); return d; }

export default function Appointments() {
  const [view, setView] = useState('list');
  const [filterStatus, setFilterStatus] = useState('All');
  const [addModal, setAddModal] = useState(false);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [newAppointment, setNewAppointment] = useState({ appointmentId: '', clientId: '', clientName: '', appointmentDate: '', appointmentTime: '', type: 'Follow-up', mode: 'In-Person', duration: 60, notes: '' });

  // Fetch appointments from backend
  const { data: appointments = [], isLoading, error } = trpc.appointment.list.useQuery({ status: filterStatus === 'All' ? undefined : filterStatus });
  const createMutation = trpc.appointment.create.useMutation();
  const utils = trpc.useUtils();

  const filtered = useMemo(() => {
    if (!appointments) return [];
    return filterStatus === 'All' ? appointments : appointments.filter(a => a.status === filterStatus);
  }, [appointments, filterStatus]);

  const days = calDays(calYear, calMonth);
  const monthName = new Date(calYear, calMonth).toLocaleString('en',{month:'long'});
  const byDay = useMemo(() => {
    if (!appointments) return {};
    return appointments.reduce((acc,a)=>{ 
      const d = new Date(a.appointmentDate).getDate(); 
      if(!acc[d])acc[d]=[]; 
      acc[d].push(a); 
      return acc; 
    },{});
  }, [appointments]);

  const prevMonth=()=>{ if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); };
  const nextMonth=()=>{ if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); };

  const handleCreateAppointment = async () => {
    try {
      await createMutation.mutateAsync({
        appointmentId: newAppointment.appointmentId || `APT-${Date.now()}`,
        clientId: parseInt(newAppointment.clientId),
        clientName: newAppointment.clientName,
        appointmentDate: new Date(newAppointment.appointmentDate),
        appointmentTime: newAppointment.appointmentTime,
        type: newAppointment.type,
        mode: newAppointment.mode,
        duration: newAppointment.duration,
        status: 'Pending',
        notes: newAppointment.notes
      });
      setNewAppointment({ appointmentId: '', clientId: '', clientName: '', appointmentDate: '', appointmentTime: '', type: 'Follow-up', mode: 'In-Person', duration: 60, notes: '' });
      setAddModal(false);
      await utils.appointment.list.invalidate();
    } catch (err) {
      console.error('Failed to create appointment:', err);
    }
  };

  if (error) return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:16, background:'var(--danger-light)', border:'1px solid var(--danger)', borderRadius:8, color:'var(--danger)' }}>
      <AlertCircle size={20} />
      <span>Failed to load appointments. Please try again.</span>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18, animation:'fadeIn 0.25s ease' }}>
      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
        <div style={{ display:'flex', background:'var(--bg-surface)', border:'1px solid var(--border-light)', borderRadius:8, padding:3 }}>
          {['list','calendar'].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{ padding:'5px 14px', borderRadius:6, border:'none', cursor:'pointer', background:view===v?'var(--accent)':'transparent', color:view===v?'#fff':'var(--text-muted)', fontSize:12.5, fontFamily:'var(--font-body)', fontWeight:view===v?600:400, transition:'var(--transition)', textTransform:'capitalize' }}>{v}</button>
          ))}
        </div>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {['All','Confirmed','Pending','Completed','Scheduled'].map(s=>(
            <button key={s} onClick={()=>setFilterStatus(s)} style={{ padding:'5px 12px', borderRadius:6, border:`1px solid ${filterStatus===s?'var(--accent)':'var(--border-light)'}`, cursor:'pointer', background:filterStatus===s?'var(--accent-light)':'var(--bg-surface)', color:filterStatus===s?'var(--accent)':'var(--text-muted)', fontSize:12, fontFamily:'var(--font-body)', fontWeight:filterStatus===s?600:400, transition:'var(--transition)' }}>{s}</button>
          ))}
        </div>
        <div style={{ marginLeft:'auto' }}>
          <Button variant="primary" icon={Plus} onClick={()=>setAddModal(true)}>New Appointment</Button>
        </div>
      </div>

      {view==='list' && (
        <TableWrapper>
          <thead>
            <tr><Th>Date & Time</Th><Th>Client</Th><Th>Type</Th><Th>Mode</Th><Th>Duration</Th><Th>Status</Th><Th>Notes</Th><Th>Actions</Th></tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><Td colSpan={8} style={{textAlign:'center', padding:20}}>Loading appointments...</Td></tr>
            ) : filtered.length === 0 ? (
              <tr><Td colSpan={8} style={{textAlign:'center', padding:20, color:'var(--text-muted)'}}>No appointments found</Td></tr>
            ) : filtered.sort((a,b)=>new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()).map(a=>(
              <tr key={a.id} style={{ transition:'var(--transition)' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface-2)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <Td>
                  <div style={{ fontSize:13.5, fontWeight:600, color:'var(--text-primary)' }}>{new Date(a.appointmentDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:3 }}><Clock size={10}/>{a.appointmentTime}</div>
                </Td>
                <Td>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <Avatar name={a.clientName || 'Client'} size={30}/>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600 }}>{a.clientName || 'Unknown'}</div>
                      <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>ID: {a.clientId}</div>
                    </div>
                  </div>
                </Td>
                <Td><Badge variant={a.type==='New Patient'?'accent':'info'}>{a.type}</Badge></Td>
                <Td>
                  <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, color:'var(--text-secondary)' }}>
                    {a.mode==='Telehealth'?<Video size={13} color="var(--accent)"/>:<MapPin size={13} color="var(--success)"/>}{a.mode}
                  </span>
                </Td>
                <Td><span style={{ fontSize:13, color:'var(--text-secondary)' }}>{a.duration} min</span></Td>
                <Td><Badge variant={statusV[a.status]||'default'}>{a.status}</Badge></Td>
                <Td><span style={{ fontSize:12, color:'var(--text-muted)', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block' }}>{a.notes||'—'}</span></Td>
                <Td>
                  <div style={{ display:'flex', gap:5 }}>
                    <Button variant="ghost" size="sm">Edit</Button>
                    {a.status==='Pending'&&<Button variant="secondary" size="sm">Confirm</Button>}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
      )}

      {view==='calendar' && (
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 300px', gap:16, flexWrap:'wrap' }}>
          <Card style={{ padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16 }}>{monthName} {calYear}</h3>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={prevMonth} style={{ background:'var(--bg-surface-2)', border:'1px solid var(--border-light)', borderRadius:7, padding:'5px 9px', cursor:'pointer', color:'var(--text-secondary)', display:'flex' }}><ChevronLeft size={15}/></button>
                <button onClick={nextMonth} style={{ background:'var(--bg-surface-2)', border:'1px solid var(--border-light)', borderRadius:7, padding:'5px 9px', cursor:'pointer', color:'var(--text-secondary)', display:'flex' }}><ChevronRight size={15}/></button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3, marginBottom:6 }}>
              {DOW.map(d=><div key={d} style={{ textAlign:'center', fontSize:11, fontWeight:600, color:'var(--text-muted)', padding:'8px 0' }}>{d}</div>)}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
              {days.map((d,i)=>(
                <div key={i} style={{ aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, background:d?'var(--bg-surface-2)':'transparent', border:d?'1px solid var(--border-light)':'none', cursor:d?'pointer':'default', fontSize:13, fontWeight:d?600:400, color:d?'var(--text-primary)':'var(--text-muted)', position:'relative' }}>
                  {d}
                  {byDay[d]&&byDay[d].length>0&&<div style={{ position:'absolute', bottom:2, width:4, height:4, borderRadius:'50%', background:'var(--accent)' }}/>}
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding:20 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:12 }}>Upcoming</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {filtered.slice(0,5).map(a=>(
                <div key={a.id} style={{ padding:10, background:'var(--bg-surface-2)', borderRadius:7, borderLeft:`3px solid var(--accent)` }}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text-primary)' }}>{a.clientName}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{new Date(a.appointmentDate).toLocaleDateString()} {a.appointmentTime}</div>
                  <Badge variant={statusV[a.status]||'default'} style={{ marginTop:6, fontSize:10 }}>{a.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Add Appointment Modal */}
      <Modal open={addModal} title="New Appointment" onClose={()=>setAddModal(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <Input placeholder="Client ID" value={newAppointment.clientId} onChange={e=>setNewAppointment({...newAppointment, clientId:e.target.value})} />
            <Input placeholder="Client Name" value={newAppointment.clientName} onChange={e=>setNewAppointment({...newAppointment, clientName:e.target.value})} />
            <Input type="date" value={newAppointment.appointmentDate} onChange={e=>setNewAppointment({...newAppointment, appointmentDate:e.target.value})} />
            <Input type="time" value={newAppointment.appointmentTime} onChange={e=>setNewAppointment({...newAppointment, appointmentTime:e.target.value})} />
            <Select value={newAppointment.type} onChange={e=>setNewAppointment({...newAppointment, type:e.target.value})}>
              <option>Follow-up</option>
              <option>New Patient</option>
              <option>Walk-in</option>
            </Select>
            <Select value={newAppointment.mode} onChange={e=>setNewAppointment({...newAppointment, mode:e.target.value})}>
              <option>In-Person</option>
              <option>Telehealth</option>
            </Select>
            <Input type="number" placeholder="Duration (minutes)" value={newAppointment.duration} onChange={e=>setNewAppointment({...newAppointment, duration:parseInt(e.target.value)})} />
            <Input placeholder="Notes" value={newAppointment.notes} onChange={e=>setNewAppointment({...newAppointment, notes:e.target.value})} />
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <Button variant="ghost" onClick={()=>setAddModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateAppointment} disabled={createMutation.isPending}>Create</Button>
            </div>
            </div>
          </Modal>
    </div>
  );
}
