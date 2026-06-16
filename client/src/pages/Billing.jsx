import React, { useState, useMemo, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { Card, Badge, Button, Avatar, Modal, Input, Select, TableWrapper, Th, Td } from '../components/UI';
import { Plus, Download, Search, CheckCircle, Clock, CreditCard, Smartphone, DollarSign, FileText, Eye, AlertCircle } from 'lucide-react';

const statusV={ Paid:'success', Partial:'warning', Unpaid:'danger', Waived:'default', Pending:'warning' };

export default function Billing() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [addModal, setAddModal] = useState(false);
  const [viewInv, setViewInv] = useState(null);
  const [newInvoice, setNewInvoice] = useState({ invoiceId: '', clientId: '', clientName: '', description: '', quantity: '1', unitPrice: '', paymentMethod: 'M-Pesa' });

  // Fetch invoices from backend
  const { data: invoices = [], isLoading, error } = trpc.billing.listInvoices.useQuery();
  const createMutation = trpc.billing.createInvoice.useMutation();
  const utils = trpc.useUtils();

  const filtered = useMemo(() => {
    if (!invoices) return [];
    const q = search.toLowerCase();
    return invoices.filter(b => {
      const matchesSearch = (b.clientName?.toLowerCase().includes(q) || b.invoiceId?.toLowerCase().includes(q));
      const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, filterStatus]);

  const totalRev = useMemo(() => invoices.reduce((s, b) => s + parseFloat(b.paid || 0), 0), [invoices]);
  const totalOut = useMemo(() => invoices.reduce((s, b) => s + parseFloat(b.outstanding || 0), 0), [invoices]);
  const totalInv = useMemo(() => invoices.reduce((s, b) => s + parseFloat(b.total || 0), 0), [invoices]);

  const handleCreateInvoice = async () => {
    try {
      const items = [{
        description: newInvoice.description,
        quantity: parseInt(newInvoice.quantity),
        unitPrice: parseFloat(newInvoice.unitPrice)
      }];

      await createMutation.mutateAsync({
        invoiceId: newInvoice.invoiceId || `INV-${Date.now()}`,
        clientId: parseInt(newInvoice.clientId),
        clientName: newInvoice.clientName,
        invoiceDate: new Date(),
        items: items,
        paymentMethod: newInvoice.paymentMethod
      });
      setNewInvoice({ invoiceId: '', clientId: '', clientName: '', description: '', quantity: '1', unitPrice: '', paymentMethod: 'M-Pesa' });
      setAddModal(false);
      await utils.billing.listInvoices.invalidate();
    } catch (err) {
      console.error('Failed to create invoice:', err);
    }
  };

  if (error) return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:16, background:'var(--danger-light)', border:'1px solid var(--danger)', borderRadius:8, color:'var(--danger)' }}>
      <AlertCircle size={20} />
      <span>Failed to load invoices. Please try again.</span>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18, animation:'fadeIn 0.25s ease' }}>
      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:13 }}>
        {[{icon:DollarSign,label:'Total Invoiced',value:`KES ${totalInv.toLocaleString()}`,color:'var(--accent)'},{icon:CheckCircle,label:'Collected',value:`KES ${totalRev.toLocaleString()}`,color:'var(--success)'},{icon:Clock,label:'Outstanding',value:`KES ${totalOut.toLocaleString()}`,color:'var(--danger)'},{icon:FileText,label:'Invoices',value:invoices.length,color:'var(--violet)'}].map(s=>(
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
          {['All','Paid','Partial','Unpaid','Waived','Pending'].map(s=>(
            <button key={s} onClick={()=>setFilterStatus(s)} style={{ padding:'5px 12px', borderRadius:6, border:`1px solid ${filterStatus===s?'var(--accent)':'var(--border-light)'}`, cursor:'pointer', background:filterStatus===s?'var(--accent-light)':'var(--bg-surface)', color:filterStatus===s?'var(--accent)':'var(--text-muted)', fontSize:12, fontFamily:'var(--font-body)', fontWeight:filterStatus===s?600:400, transition:'var(--transition)' }}>{s}</button>
          ))}
        </div>
        <div style={{ marginLeft:'auto' }}>
          <Button variant="primary" icon={Plus} onClick={()=>setAddModal(true)}>New Invoice</Button>
        </div>
      </div>

      {/* Invoices Table */}
      <TableWrapper>
        <thead>
          <tr><Th>Invoice ID</Th><Th>Client</Th><Th>Amount</Th><Th>Paid</Th><Th>Outstanding</Th><Th>Payment Method</Th><Th>Status</Th><Th>Date</Th><Th>Actions</Th></tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><Td colSpan={9} style={{textAlign:'center', padding:20}}>Loading invoices...</Td></tr>
          ) : filtered.length === 0 ? (
            <tr><Td colSpan={9} style={{textAlign:'center', padding:20, color:'var(--text-muted)'}}>No invoices found</Td></tr>
          ) : filtered.map(inv=>(
            <tr key={inv.id} style={{ transition:'var(--transition)' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface-2)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <Td><span style={{ fontSize:12.5, fontWeight:600, color:'var(--accent)' }}>{inv.invoiceId}</span></Td>
              <Td>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Avatar name={inv.clientName || 'Client'} size={28}/>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{inv.clientName || 'Unknown'}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)' }}>ID: {inv.clientId}</div>
                  </div>
                </div>
              </Td>
              <Td><span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>KES {parseFloat(inv.total || 0).toLocaleString()}</span></Td>
              <Td><span style={{ fontSize:13, fontWeight:600, color:'var(--success)' }}>KES {parseFloat(inv.paid || 0).toLocaleString()}</span></Td>
              <Td><span style={{ fontSize:13, fontWeight:600, color:'var(--danger)' }}>KES {parseFloat(inv.outstanding || 0).toLocaleString()}</span></Td>
              <Td>
                <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'var(--text-secondary)' }}>
                  {inv.paymentMethod === 'M-Pesa' ? <Smartphone size={12} /> : <DollarSign size={12} />}
                  {inv.paymentMethod}
                </span>
              </Td>
              <Td><Badge variant={statusV[inv.status]||'default'}>{inv.status}</Badge></Td>
              <Td><span style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(inv.invoiceDate).toLocaleDateString()}</span></Td>
              <Td>
                <div style={{ display:'flex', gap:5 }}>
                  <Button variant="ghost" size="sm" icon={Eye} onClick={()=>setViewInv(inv)}>View</Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>

      {/* View Invoice Modal */}
      <Modal open={!!viewInv} title={viewInv ? `Invoice ${viewInv.invoiceId}` : ''} onClose={()=>setViewInv(null)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:3 }}>Client</div>
                <div style={{ fontSize:13, fontWeight:600 }}>{viewInv.clientName}</div>
              </div>
              <div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:3 }}>Invoice Date</div>
                <div style={{ fontSize:13, fontWeight:600 }}>{new Date(viewInv.invoiceDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:3 }}>Total Amount</div>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--accent)' }}>KES {parseFloat(viewInv.total || 0).toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:3 }}>Status</div>
                <Badge variant={statusV[viewInv.status]||'default'}>{viewInv.status}</Badge>
              </div>
            </div>
            <div style={{ borderTop:'1px solid var(--border-light)', paddingTop:12 }}>
              <div style={{ fontSize:12, fontWeight:600, marginBottom:6 }}>Payment Details</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, fontSize:12 }}>
                <div>
                  <div style={{ color:'var(--text-muted)', marginBottom:3 }}>Paid</div>
                  <div style={{ fontWeight:600, color:'var(--success)' }}>KES {parseFloat(viewInv.paid || 0).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color:'var(--text-muted)', marginBottom:3 }}>Outstanding</div>
                  <div style={{ fontWeight:600, color:'var(--danger)' }}>KES {parseFloat(viewInv.outstanding || 0).toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <Button variant="secondary" icon={Download}>Download PDF</Button>
              <Button variant="ghost" onClick={()=>setViewInv(null)}>Close</Button>
            </div>
            </div>
          </Modal>

      {/* Add Invoice Modal */}
      <Modal open={addModal} title="New Invoice" onClose={()=>setAddModal(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <Input placeholder="Client ID" value={newInvoice.clientId} onChange={e=>setNewInvoice({...newInvoice, clientId:e.target.value})} />
            <Input placeholder="Client Name" value={newInvoice.clientName} onChange={e=>setNewInvoice({...newInvoice, clientName:e.target.value})} />
            <Input placeholder="Description" value={newInvoice.description} onChange={e=>setNewInvoice({...newInvoice, description:e.target.value})} />
            <Input type="number" placeholder="Quantity" value={newInvoice.quantity} onChange={e=>setNewInvoice({...newInvoice, quantity:e.target.value})} />
            <Input type="number" placeholder="Unit Price (KES)" value={newInvoice.unitPrice} onChange={e=>setNewInvoice({...newInvoice, unitPrice:e.target.value})} />
            <Select value={newInvoice.paymentMethod} onChange={e=>setNewInvoice({...newInvoice, paymentMethod:e.target.value})}>
              <option>M-Pesa</option>
              <option>Cash</option>
              <option>Waived</option>
            </Select>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <Button variant="ghost" onClick={()=>setAddModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateInvoice} disabled={createMutation.isPending}>Create</Button>
            </div>
            </div>
          </Modal>
    </div>
  );
}
