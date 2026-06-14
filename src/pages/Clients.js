import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, Button, Avatar, Modal, Input, Select, TableWrapper, Th, Td } from '../components/UI';
import { Search, Plus, Phone, Mail, ChevronRight, Download, Sparkles } from 'lucide-react';
import { mockClients } from '../data/mockData';

const statusV = { Active:'success', Inactive:'default' };

export default function Clients() {
  const { setAiAssistantOpen } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [detail, setDetail] = useState(null);
  const [addModal, setAddModal] = useState(false);

  const filtered = mockClients.filter(c => {
    const q = search.toLowerCase();
    return (c.fullName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      && (filter === 'All' || c.status === filter);
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18, animation:'fadeIn 0.25s ease' }}>
      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <Search size={14} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-placeholder)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID or email…"
            style={{ width:'100%', background:'var(--bg-surface)', border:'1px solid var(--border-default)', borderRadius:8, padding:'8px 12px 8px 34px', fontSize:13, fontFamily:'var(--font-body)', color:'var(--text-primary)', outline:'none' }}
            onFocus={e=>{e.target.style.borderColor='var(--border-focus)';e.target.style.boxShadow='0 0 0 3px rgba(37,99,235,0.1)';}}
            onBlur={e=>{e.target.style.borderColor='var(--border-default)';e.target.style.boxShadow='none';}} />
        </div>
        <div style={{ display:'flex', gap:4, background:'var(--bg-surface)', border:'1px solid var(--border-light)', borderRadius:8, padding:3 }}>
          {['All','Active','Inactive'].map(f => (
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:'5px 13px', borderRadius:6, border:'none', cursor:'pointer', background:filter===f?'var(--accent)':'transparent', color:filter===f?'#fff':'var(--text-muted)', fontSize:12.5, fontFamily:'var(--font-body)', fontWeight:filter===f?600:400, transition:'var(--transition)' }}>
              {f}
            </button>
          ))}
        </div>
        <Button variant="secondary" size="sm" icon={Download}>Export</Button>
        <Button variant="primary" size="sm" icon={Plus} onClick={()=>setAddModal(true)}>Add Client</Button>
      </div>

      {/* Table */}
      <TableWrapper>
        <thead>
          <tr>
            <Th>Client</Th><Th>Contact</Th><Th>Age / Sex</Th><Th>Diagnoses</Th>
            <Th>Last Visit</Th><Th>Next Appt</Th><Th>Status</Th><Th>Balance</Th><Th></Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.id} onClick={()=>setDetail(c)} style={{ cursor:'pointer', transition:'var(--transition)' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface-2)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <Td>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <Avatar name={c.fullName} size={34} />
                  <div>
                    <div style={{ fontSize:13.5, fontWeight:600, color:'var(--text-primary)' }}>{c.fullName}</div>
                    <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{c.id}</div>
                  </div>
                </div>
              </Td>
              <Td>
                <div style={{ fontSize:12.5, color:'var(--text-secondary)' }}>{c.phone}</div>
                <div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{c.email}</div>
              </Td>
              <Td><span style={{ fontSize:13, color:'var(--text-secondary)' }}>{c.age}y · {c.gender}</span></Td>
              <Td>
                <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                  {c.currentDiagnoses.slice(0,2).map(d=><Badge key={d} variant="info" style={{fontSize:10.5}}>{d}</Badge>)}
                  {c.currentDiagnoses.length>2&&<Badge variant="default" style={{fontSize:10.5}}>+{c.currentDiagnoses.length-2}</Badge>}
                </div>
              </Td>
              <Td><span style={{ fontSize:12.5, color:'var(--text-secondary)' }}>{c.lastVisit||'—'}</span></Td>
              <Td><span style={{ fontSize:12.5, color:c.nextAppointment?'var(--accent)':'var(--text-placeholder)' }}>{c.nextAppointment||'—'}</span></Td>
              <Td><Badge variant={statusV[c.status]}>{c.status}</Badge></Td>
              <Td>
                {c.outstanding>0
                  ? <span style={{ fontSize:13, fontWeight:600, color:'var(--danger)' }}>KES {c.outstanding.toLocaleString()}</span>
                  : <span style={{ fontSize:12.5, color:'var(--success)' }}>Cleared</span>}
              </Td>
              <Td><ChevronRight size={15} color="var(--text-placeholder)" /></Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
      <div style={{ fontSize:12.5, color:'var(--text-muted)', paddingLeft:2 }}>Showing {filtered.length} of {mockClients.length} clients</div>

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={()=>setDetail(null)} title="Client Profile" width={680}>
        {detail && (
          <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, minWidth:110 }}>
              <Avatar name={detail.fullName} size={72} />
              <Badge variant={statusV[detail.status]}>{detail.status}</Badge>
              <span style={{ fontSize:11.5, color:'var(--text-muted)' }}>{detail.id}</span>
            </div>
            <div style={{ flex:1, minWidth:260 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:19, fontWeight:700, marginBottom:4 }}>{detail.fullName}</h3>
              <div style={{ display:'flex', gap:14, fontSize:13, color:'var(--text-secondary)', marginBottom:14, flexWrap:'wrap' }}>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><Phone size={12}/>{detail.phone}</span>
                <span style={{ display:'flex', alignItems:'center', gap:4 }}><Mail size={12}/>{detail.email}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                {[['Age / Gender',`${detail.age} yrs · ${detail.gender}`],['Address',detail.address],['Total Visits',`${detail.totalVisits} visits`],['Last Visit',detail.lastVisit||'N/A'],['Next Appointment',detail.nextAppointment||'Not scheduled'],['Outstanding',detail.outstanding>0?`KES ${detail.outstanding.toLocaleString()}`:'Clear']].map(([l,v])=>(
                  <div key={l} style={{ background:'var(--bg-surface-2)', border:'1px solid var(--border-light)', borderRadius:8, padding:'10px 12px' }}>
                    <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6, fontWeight:500 }}>Diagnoses</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>{detail.currentDiagnoses.map(d=><Badge key={d} variant="info">{d}</Badge>)}</div>
              </div>
              {detail.allergies.length>0&&(
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:6, fontWeight:500 }}>Allergies</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>{detail.allergies.map(a=><Badge key={a} variant="danger">{a}</Badge>)}</div>
                </div>
              )}
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <Button variant="primary" size="sm" icon={Plus}>Book Appointment</Button>
                <Button variant="secondary" size="sm">View Assessments</Button>
                <Button variant="ghost" size="sm" icon={Sparkles} onClick={()=>{setDetail(null);setAiAssistantOpen(true);}}>AFyalinkAI</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Client Modal */}
      <Modal open={addModal} onClose={()=>setAddModal(false)} title="Register New Client" width={620}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:13 }}>
          <Input label="Full Name *" placeholder="e.g. Jane Waweru" />
          <Input label="Phone *" placeholder="+254 7XX XXX XXX" />
          <Input label="Email" placeholder="client@email.com" />
          <Input label="Date of Birth *" type="date" />
          <Select label="Gender *"><option value="">Select…</option><option>Female</option><option>Male</option><option>Other</option></Select>
          <Input label="Address" placeholder="Area, City" />
          <div style={{ gridColumn:'1/-1' }}><Input label="Medical History" placeholder="Previous conditions, surgeries…" /></div>
          <div style={{ gridColumn:'1/-1' }}><Input label="Known Allergies" placeholder="e.g. Peanuts, Lactose…" /></div>
          <div style={{ gridColumn:'1/-1', display:'flex', gap:8, justifyContent:'flex-end' }}>
            <Button variant="secondary" onClick={()=>setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={()=>setAddModal(false)}>Register Client</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
