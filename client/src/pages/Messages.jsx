import React, { useState, useMemo, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { Card, Badge, Button, Avatar, Modal, Select } from '../components/UI';
import { Send, Smartphone, Phone, Plus, CheckCheck, Check, Bell, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const templates=[
  {id:1,name:'Appointment Reminder',body:'Hello {name}! Reminder for your appointment on {date} at {time}. Reply to confirm or call us to reschedule.'},
  {id:2,name:'Welcome Message',body:'Hi {name}! Welcome to AFyalink Clinic. Your appointment is confirmed. We look forward to supporting your health journey.'},
  {id:3,name:'Payment Reminder',body:'Dear {name}, you have an outstanding balance of KES {amount}. Please settle at your earliest convenience. Thank you!'},
  {id:4,name:'Follow-up Check-in',body:'Hi {name}, checking in on your progress! How are you doing with your meal plan? Reach out if you need support.'},
  {id:5,name:'Lab Result Ready',body:'Hi {name}, your lab interpretation is ready. Please book a follow-up to discuss your results.'},
];
const chColor={WhatsApp:'#25d366',SMS:'var(--accent)'};

export default function Messages() {
  const { setAiAssistantOpen } = useApp();
  const [tab, setTab] = useState('all');
  const [compose, setCompose] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [channel, setChannel] = useState('WhatsApp');
  const [selTemplate, setSelTemplate] = useState(null);
  const [recipientId, setRecipientId] = useState('');
  const [recipientName, setRecipientName] = useState('');

  // Fetch messages from backend
  const { data: messages = [], isLoading, error } = trpc.message.list.useQuery();
  const createMutation = trpc.message.create.useMutation();
  const utils = trpc.useUtils();

  const filtered = useMemo(() => {
    if (!messages) return [];
    return messages.filter(m=>{
      if(tab==='all') return true;
      if(tab==='sent') return m.direction==='Outbound';
      if(tab==='received') return m.direction==='Inbound';
      if(tab==='whatsapp') return m.channel==='WhatsApp';
      if(tab==='sms') return m.channel==='SMS';
      return true;
    });
  }, [messages, tab]);

  const stats = useMemo(() => ({
    sent: messages.filter(m=>m.direction==='Outbound').length,
    received: messages.filter(m=>m.direction==='Inbound').length,
    pending: 0
  }), [messages]);

  const handleSendMessage = async () => {
    try {
      await createMutation.mutateAsync({
        messageId: `MSG-${Date.now()}`,
        clientId: parseInt(recipientId),
        clientName: recipientName,
        channel: channel,
        direction: 'Outbound',
        message: composeText,
        status: 'Sent'
      });
      setComposeText('');
      setRecipientId('');
      setRecipientName('');
      setCompose(false);
      await utils.message.list.invalidate();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (error) return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:16, background:'var(--danger-light)', border:'1px solid var(--danger)', borderRadius:8, color:'var(--danger)' }}>
      <AlertCircle size={20} />
      <span>Failed to load messages. Please try again.</span>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18, animation:'fadeIn 0.25s ease' }}>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:13 }}>
        {[{l:'Sent',v:stats.sent,c:'var(--accent)'},{l:'Received',v:stats.received,c:'var(--success)'},{l:'Pending',v:stats.pending,c:'var(--warning)'},{l:'Delivery Rate',v:'98%',c:'var(--info)'}].map(s=>(
          <Card key={s.l} style={{ padding:16, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:24, fontWeight:700, fontFamily:'var(--font-display)', color:s.c }}>{s.v}</div>
            <div style={{ fontSize:12.5, color:'var(--text-muted)' }}>{s.l}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 300px', gap:16 }}>
        <div>
          <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
            {['all','sent','received','whatsapp','sms'].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{ padding:'6px 14px', borderRadius:6, border:`1px solid ${tab===t?'var(--accent)':'var(--border-light)'}`, cursor:'pointer', background:tab===t?'var(--accent-light)':'var(--bg-surface)', color:tab===t?'var(--accent)':'var(--text-muted)', fontSize:12, fontFamily:'var(--font-body)', fontWeight:tab===t?600:400, transition:'var(--transition)', textTransform:'capitalize' }}>{t}</button>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {isLoading ? (
              <div style={{ padding:20, textAlign:'center', color:'var(--text-muted)' }}>Loading messages...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding:20, textAlign:'center', color:'var(--text-muted)' }}>No messages</div>
            ) : filtered.map(m=>(
              <Card key={m.id} style={{ padding:14, borderLeft:`3px solid ${chColor[m.channel]}` }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <Avatar name={m.clientName || 'Client'} size={36}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{m.clientName || 'Unknown'}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        {m.status === 'Delivered' && <CheckCheck size={14} color="var(--success)"/>}
                        {m.status === 'Sent' && <Check size={14} color="var(--accent)"/>}
                        <span style={{ fontSize:11, color:'var(--text-muted)' }}>{new Date(m.createdAt || m.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                    <div style={{ fontSize:12.5, color:'var(--text-primary)', lineHeight:1.4, marginBottom:6 }}>{m.message}</div>
                    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                      <Badge variant={m.channel==='WhatsApp'?'accent':'info'} style={{fontSize:10}}>
                        {m.channel==='WhatsApp'?<Smartphone size={10}/>:<Phone size={10}/>} {m.channel}
                      </Badge>
                      <Badge variant={m.direction==='Outbound'?'default':'success'} style={{fontSize:10}}>
                        {m.direction}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Button variant="primary" icon={Send} onClick={()=>setCompose(true)} style={{ width:'100%', justifyContent:'center' }}>New Message</Button>

          <Card style={{ padding:14 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:10, color:'var(--text-primary)' }}>Message Templates</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {templates.map(t=>(
                <button key={t.id} onClick={()=>setSelTemplate(t)} style={{ padding:8, background:'var(--bg-surface)', border:'1px solid var(--border-light)', borderRadius:6, cursor:'pointer', textAlign:'left', fontSize:12, color:'var(--text-secondary)', transition:'var(--transition)' }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface-2)'}
                  onMouseLeave={e=>e.currentTarget.style.background='var(--bg-surface)'}>
                  {t.name}
                </button>
              ))}
            </div>
          </Card>

          {selTemplate && (
            <Card style={{ padding:14, background:'var(--accent-light)', borderLeft:'3px solid var(--accent)' }}>
              <div style={{ fontSize:12, fontWeight:600, marginBottom:8, color:'var(--accent)' }}>Selected Template</div>
              <div style={{ fontSize:12, color:'var(--text-primary)', lineHeight:1.5, marginBottom:10 }}>{selTemplate.body}</div>
              <Button variant="secondary" size="sm" onClick={()=>{ setComposeText(selTemplate.body); setCompose(true); }} style={{ width:'100%' }}>Use Template</Button>
            </Card>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      <Modal open={compose} title="Send Message" onClose={()=>setCompose(false)}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Recipient Client ID</label>
              <input value={recipientId} onChange={e=>setRecipientId(e.target.value)} placeholder="Enter client ID" style={{ width:'100%', padding:8, border:'1px solid var(--border-light)', borderRadius:6, fontFamily:'var(--font-body)', fontSize:13, outline:'none' }}/>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Recipient Name</label>
              <input value={recipientName} onChange={e=>setRecipientName(e.target.value)} placeholder="Enter recipient name" style={{ width:'100%', padding:8, border:'1px solid var(--border-light)', borderRadius:6, fontFamily:'var(--font-body)', fontSize:13, outline:'none' }}/>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Channel</label>
              <Select value={channel} onChange={e=>setChannel(e.target.value)}>
                <option>WhatsApp</option>
                <option>SMS</option>
              </Select>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:6 }}>Message</label>
              <textarea value={composeText} onChange={e=>setComposeText(e.target.value)} placeholder="Type your message…" style={{ width:'100%', padding:10, border:'1px solid var(--border-light)', borderRadius:6, fontFamily:'var(--font-body)', fontSize:13, minHeight:120, resize:'vertical', outline:'none' }}/>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>{composeText.length}/160 characters</div>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <Button variant="ghost" onClick={()=>setCompose(false)}>Cancel</Button>
              <Button variant="primary" icon={Send} onClick={handleSendMessage} disabled={createMutation.isPending || !recipientId || !composeText}>Send</Button>
            </div>
            </div>
          </Modal>
    </div>
  );
}
