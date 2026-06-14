import React, { useState } from 'react';
import { Card, Badge, Button, Avatar, Modal, Input, Select, TableWrapper, Th, Td } from '../components/UI';
import { mockBilling } from '../data/mockData';
import { Plus, Download, Search, CheckCircle, Clock, CreditCard, Smartphone, DollarSign, FileText, Eye } from 'lucide-react';

const statusV={ Paid:'success', Partial:'warning', Unpaid:'danger', Waived:'default' };

export default function Billing() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [addModal, setAddModal] = useState(false);
  const [viewInv, setViewInv] = useState(null);

  const filtered = mockBilling.filter(b=>{
    const q=search.toLowerCase();
    return (b.clientName.toLowerCase().includes(q)||b.id.toLowerCase().includes(q))&&(filterStatus==='All'||b.status===filterStatus);
  });
  const totalRev=mockBilling.reduce((s,b)=>s+b.paid,0);
  const totalOut=mockBilling.reduce((s,b)=>s+b.outstanding,0);
  const totalInv=mockBilling.reduce((s,b)=>s+b.total,0);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18, animation:'fadeIn 0.25s ease' }}>
      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:13 }}>
        {[{icon:DollarSign,label:'Total Invoiced',value:`KES ${totalInv.toLocaleString()}`,color:'var(--accent)'},{icon:CheckCircle,label:'Collected',value:`KES ${totalRev.toLocaleString()}`,color:'var(--success)'},{icon:Clock,label:'Outstanding',value:`KES ${totalOut.toLocaleString()}`,color:'var(--danger)'},{icon:FileText,label:'Invoices',value:mockBilling.length,color:'var(--violet)'}].map(s=>(
          <Card key={s.label} style={{ padding:18 }}>
            <div style={{ display:'flex', alignItems:'center', gap:11 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:s.color+'18', display:'flex', alignItems:'center', justifyContent:'center' }}><s.icon size={17} color={s.color}/></div>
              <div>
                <div style={{ fontSize:19, fontWeight:700, fontFamily:'var(--font-display)', lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:3 }}>{s.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, maxWidth:300 }}>
          <Search size={14} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-placeholder)' }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search invoices…"
            style={{ width:'100%', background:'var(--bg-surface)', border:'1px solid var(--border-default)', borderRadius:8, padding:'8px 12px 8px 34px', fontSize:13, fontFamily:'var(--font-body)', color:'var(--text-primary)', outline:'none' }}/>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {['All','Paid','Partial','Unpaid','Waived'].map(s=>(
            <button key={s} onClick={()=>setFilterStatus(s)} style={{ padding:'5px 12px', borderRadius:6, border:`1px solid ${filterStatus===s?'var(--accent)':'var(--border-light)'}`, cursor:'pointer', background:filterStatus===s?'var(--accent-light)':'var(--bg-surface)', color:filterStatus===s?'var(--accent)':'var(--text-muted)', fontSize:12, fontFamily:'var(--font-body)', fontWeight:filterStatus===s?600:400, transition:'var(--transition)' }}>{s}</button>
          ))}
        </div>
        <div style={{ marginLeft:'auto' }}>
          <Button variant="primary" icon={Plus} onClick={()=>setAddModal(true)}>New Invoice</Button>
        </div>
      </div>

      <TableWrapper>
        <thead><tr><Th>Invoice</Th><Th>Client</Th><Th>Date</Th><Th>Services</Th><Th>Total (KES)</Th><Th>Paid (KES)</Th><Th>Outstanding</Th><Th>Method</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
        <tbody>
          {filtered.map(inv=>(
            <tr key={inv.id} style={{ transition:'var(--transition)' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface-2)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <Td><div style={{ fontSize:13, fontWeight:600, color:'var(--accent)' }}>{inv.id}</div><div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{inv.receiptNo}</div></Td>
              <Td><div style={{ display:'flex', alignItems:'center', gap:8 }}><Avatar name={inv.clientName} size={28}/><span style={{ fontSize:13, fontWeight:600 }}>{inv.clientName}</span></div></Td>
              <Td><span style={{ fontSize:12.5, color:'var(--text-secondary)' }}>{inv.date}</span></Td>
              <Td><span style={{ fontSize:12.5, color:'var(--text-muted)' }}>{inv.services.length} item(s)</span></Td>
              <Td><span style={{ fontSize:13, fontWeight:600 }}>{inv.total.toLocaleString()}</span></Td>
              <Td><span style={{ fontSize:13, color:'var(--success)', fontWeight:600 }}>{inv.paid.toLocaleString()}</span></Td>
              <Td>{inv.outstanding>0?<span style={{ fontSize:13, fontWeight:700, color:'var(--danger)' }}>{inv.outstanding.toLocaleString()}</span>:<span style={{ fontSize:12.5, color:'var(--success)' }}>—</span>}</Td>
              <Td><span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12.5, color:'var(--text-secondary)' }}>{inv.paymentMethod==='M-Pesa'?<Smartphone size={12} color="var(--success)"/>:<CreditCard size={12}/>}{inv.paymentMethod}</span></Td>
              <Td><Badge variant={statusV[inv.status]}>{inv.status}</Badge></Td>
              <Td><div style={{ display:'flex', gap:5 }}><Button variant="ghost" size="sm" icon={Eye} onClick={()=>setViewInv(inv)}>View</Button>{inv.outstanding>0&&<Button variant="secondary" size="sm">Pay</Button>}</div></Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>

      {/* Invoice View Modal */}
      <Modal open={!!viewInv} onClose={()=>setViewInv(null)} title={`Invoice ${viewInv?.id||''}`} width={540}>
        {viewInv&&(
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div><div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800, color:'var(--accent)' }}>AFyalink</div><div style={{ fontSize:12, color:'var(--text-muted)' }}>Clinical Nutrition · Nairobi, Kenya</div></div>
              <div style={{ textAlign:'right' }}><div style={{ fontSize:16, fontWeight:700 }}>{viewInv.id}</div><div style={{ fontSize:12, color:'var(--text-muted)' }}>{viewInv.date}</div><Badge variant={statusV[viewInv.status]} style={{marginTop:6}}>{viewInv.status}</Badge></div>
            </div>
            <hr style={{ border:'none', borderTop:'1px solid var(--border-light)' }}/>
            <div style={{ background:'var(--bg-surface-2)', borderRadius:9, padding:'11px 13px' }}>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:2 }}>BILLED TO</div>
              <div style={{ fontSize:15, fontWeight:600 }}>{viewInv.clientName}</div>
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr style={{ borderBottom:'1px solid var(--border-light)' }}>
                {['SERVICE','QTY','UNIT (KES)','TOTAL (KES)'].map(h=><th key={h} style={{ padding:'8px 0', textAlign:h==='SERVICE'?'left':'right', fontSize:11, color:'var(--text-muted)', fontWeight:600 }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {viewInv.services.map((s,i)=>(
                  <tr key={i} style={{ borderBottom:'1px solid var(--border-light)' }}>
                    <td style={{ padding:'10px 0', fontSize:13, color:'var(--text-primary)' }}>{s.description}</td>
                    <td style={{ padding:'10px 0', textAlign:'right', fontSize:13, color:'var(--text-muted)' }}>{s.quantity}</td>
                    <td style={{ padding:'10px 0', textAlign:'right', fontSize:13, color:'var(--text-muted)' }}>{s.unitPrice.toLocaleString()}</td>
                    <td style={{ padding:'10px 0', textAlign:'right', fontSize:13, fontWeight:600 }}>{(s.quantity*s.unitPrice).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5 }}>
              {[['Subtotal',viewInv.subtotal,'var(--text-secondary)'],[viewInv.discount>0?`Discount`:'','',''],[`Total`,viewInv.total,'var(--text-primary)'],['Paid',viewInv.paid,'var(--success)'],viewInv.outstanding>0?['Outstanding',viewInv.outstanding,'var(--danger)']:null].filter(Boolean).filter(x=>x[0]).map(([l,v,c])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', width:220, fontSize:l==='Total'?15:13, fontWeight:l==='Total'||l==='Outstanding'?700:400, color:c, borderTop:l==='Total'?'1px solid var(--border-light)':'none', paddingTop:l==='Total'?8:0 }}>
                  <span>{l}:</span><span>KES {Number(v).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <Button variant="secondary" icon={Download}>Download PDF</Button>
              {viewInv.outstanding>0&&<Button variant="primary">Record Payment</Button>}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={addModal} onClose={()=>setAddModal(false)} title="Create Invoice" width={560}>
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          <Select label="Client *"><option value="">Select…</option><option>Amara Osei</option><option>James Mwangi</option><option>Fatima Al-Hassan</option></Select>
          <Input label="Date" type="date" defaultValue="2025-05-17"/>
          <div style={{ fontSize:12.5, fontWeight:500, color:'var(--text-secondary)' }}>Services</div>
          {[1,2].map(i=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 60px 120px', gap:8 }}>
              <Input placeholder="Service description"/><Input placeholder="Qty" type="number"/><Input placeholder="Price (KES)" type="number"/>
            </div>
          ))}
          <Input label="Discount (KES)" type="number" placeholder="0"/>
          <Select label="Payment Method"><option>M-Pesa</option><option>Cash</option><option>Bank Transfer</option></Select>
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <Button variant="secondary" onClick={()=>setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={()=>setAddModal(false)}>Generate Invoice</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
