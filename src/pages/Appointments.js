import React, { useState } from 'react';
import { Card, Badge, Button, Avatar, Modal, Select, Input, TableWrapper, Th, Td } from '../components/UI';
import { mockAppointments } from '../data/mockData';
import { Plus, Clock, Video, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const statusV = { Confirmed:'success', Pending:'warning', Completed:'default', Scheduled:'accent', Cancelled:'danger' };
const DOW = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function calDays(y,m){ const fd=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate(), d=[]; for(let i=0;i<fd;i++)d.push(null); for(let i=1;i<=dim;i++)d.push(i); return d; }

export default function Appointments() {
  const [view, setView] = useState('list');
  const [filterStatus, setFilterStatus] = useState('All');
  const [addModal, setAddModal] = useState(false);
  const [calYear, setCalYear] = useState(2025);
  const [calMonth, setCalMonth] = useState(4);

  const filtered = mockAppointments.filter(a => filterStatus==='All'||a.status===filterStatus);
  const days = calDays(calYear, calMonth);
  const monthName = new Date(calYear, calMonth).toLocaleString('en',{month:'long'});
  const byDay = mockAppointments.reduce((acc,a)=>{ const d=parseInt(a.date.split('-')[2]); if(!acc[d])acc[d]=[]; acc[d].push(a); return acc; },{});

  const prevMonth=()=>{ if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); };
  const nextMonth=()=>{ if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); };

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
            {filtered.sort((a,b)=>`${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).map(a=>(
              <tr key={a.id} style={{ transition:'var(--transition)' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface-2)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <Td>
                  <div style={{ fontSize:13.5, fontWeight:600, color:'var(--text-primary)' }}>{new Date(a.date).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:3 }}><Clock size={10}/>{a.time}</div>
                </Td>
                <Td>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <Avatar name={a.clientName} size={30}/>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600 }}>{a.clientName}</div>
                      <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{a.clientId}</div>
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
              {DOW.map(d=><div key={d} style={{ textAlign:'center', fontSize:11, fontWeight:600, color:'var(--text-muted)', padding:'3px 0' }}>{d}</div>)}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
              {days.map((day,i)=>{
                const haA=day&&byDay[day];
                const isT=day===17&&calMonth===4&&calYear===2025;
                return (
                  <div key={i} style={{ minHeight:64, padding:'5px 6px', borderRadius:8, background:isT?'var(--accent-light)':day?'var(--bg-surface-2)':'transparent', border:`1px solid ${isT?'var(--accent-mid)':day?'var(--border-light)':'transparent'}`, cursor:day?'pointer':'default', transition:'var(--transition)' }}
                    onMouseEnter={e=>day&&(e.currentTarget.style.background=isT?'var(--accent-light)':'var(--bg-surface-3)')}
                    onMouseLeave={e=>day&&(e.currentTarget.style.background=isT?'var(--accent-light)':'var(--bg-surface-2)')}>
                    {day&&<>
                      <div style={{ fontSize:12, fontWeight:isT?700:400, color:isT?'var(--accent)':'var(--text-secondary)', marginBottom:3 }}>{day}</div>
                      {haA&&byDay[day].map((a,j)=>(
                        <div key={j} style={{ fontSize:9, padding:'2px 4px', background:a.status==='Confirmed'?'var(--success-light)':'var(--accent-light)', color:a.status==='Confirmed'?'var(--success)':'var(--accent)', borderRadius:4, marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', border:`1px solid ${a.status==='Confirmed'?'var(--success-mid)':'var(--accent-mid)'}` }}>
                          {a.time} {a.clientName.split(' ')[0]}
                        </div>
                      ))}
                    </>}
                  </div>
                );
              })}
            </div>
          </Card>
          <Card style={{ padding:20 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, marginBottom:14 }}>May 17 — Today</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {mockAppointments.filter(a=>a.date==='2025-05-17').map(a=>(
                <div key={a.id} style={{ background:'var(--bg-surface-2)', borderRadius:9, padding:'11px 13px', border:'1px solid var(--border-light)', borderLeft:`3px solid ${a.status==='Confirmed'?'var(--success)':'var(--warning)'}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{a.time}</span>
                    <Badge variant={statusV[a.status]||'default'} style={{fontSize:10}}>{a.status}</Badge>
                  </div>
                  <div style={{ fontSize:13, color:'var(--text-primary)', marginBottom:2 }}>{a.clientName}</div>
                  <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{a.type} · {a.mode} · {a.duration}min</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <Modal open={addModal} onClose={()=>setAddModal(false)} title="Schedule New Appointment">
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          <Select label="Client *"><option value="">Select a client…</option><option>Amara Osei</option><option>James Mwangi</option><option>Fatima Al-Hassan</option></Select>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Input label="Date *" type="date" defaultValue="2025-05-17"/>
            <Input label="Time *" type="time" defaultValue="09:00"/>
            <Select label="Type"><option>New Patient</option><option>Follow-up</option><option>Walk-in</option></Select>
            <Select label="Mode"><option>In-Person</option><option>Telehealth</option></Select>
            <Select label="Duration"><option>30 minutes</option><option>45 minutes</option><option>60 minutes</option><option>90 minutes</option></Select>
          </div>
          <Input label="Notes" placeholder="Reason for visit…"/>
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <Button variant="secondary" onClick={()=>setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={()=>setAddModal(false)}>Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
