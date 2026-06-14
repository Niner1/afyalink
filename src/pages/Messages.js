import React, { useState } from 'react';
import { Card, Badge, Button, Avatar, Modal, Select } from '../components/UI';
import { mockMessages, mockClients } from '../data/mockData';
import { Send, Smartphone, Phone, Plus, CheckCheck, Check, Bell, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const templates=[
  {id:1,name:'Appointment Reminder',body:'Hello {name}! Reminder for your appointment on {date} at {time}. Reply to confirm or call us to reschedule.'},
  {id:2,name:'Welcome Message',body:'Hi {name}! Welcome to NutriCare Clinic. Your appointment is confirmed. We look forward to supporting your health journey.'},
  {id:3,name:'Payment Reminder',body:'Dear {name}, you have an outstanding balance of KES {amount}. Please settle at your earliest convenience. Thank you!'},
  {id:4,name:'Follow-up Check-in',body:'Hi {name}, checking in on your progress! How are you doing with your meal plan? Reach out if you need support.'},
  {id:5,name:'Lab Result Ready',body:'Hi {name}, your lab interpretation is ready. Please book a follow-up to discuss your results.'},
];
const chColor={WhatsApp:'#25d366',SMS:'var(--accent)'};

export default function Messages() {
  const { setAiAssistantOpen } = useApp();
  const [tab, setTab] = useState('all');
  const [compose, setCompose] = useState(false);
  const [bulk, setBulk] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [channel, setChannel] = useState('WhatsApp');
  const [selTemplate, setSelTemplate] = useState(null);

  const filtered = mockMessages.filter(m=>{
    if(tab==='all') return true;
    if(tab==='sent') return m.direction==='Outbound';
    if(tab==='received') return m.direction==='Inbound';
    if(tab==='whatsapp') return m.channel==='WhatsApp';
    if(tab==='sms') return m.channel==='SMS';
    return true;
  });
  const upcoming = mockClients.filter(c=>c.nextAppointment).map(c=>({name:c.fullName,date:c.nextAppointment,phone:c.phone}));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18, animation:'fadeIn 0.25s ease' }}>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:13 }}>
        {[{l:'Sent',v:mockMessages.filter(m=>m.direction==='Outbound').length,c:'var(--accent)'},{l:'Received',v:mockMessages.filter(m=>m.direction==='Inbound').length,c:'var(--success)'},{l:'Pending',v:upcoming.length,c:'var(--warning)'},{l:'Delivery Rate',v:'98%',c:'var(--info)'}].map(s=>(
          <Card key={s.l} style={{ padding:16, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:24, fontWeight:700, fontFamily:'var(--font-display)', color:s.c }}>{s.v}</div>
            <div style={{ fontSize:12.5, color:'var(--text-muted)' }}>{s.l}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 300px', gap:16 }}>
        <div>
          <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
            <div style={{ display:'flex', background:'var(--bg-surface)', border:'1px solid var(--border-light)', borderRadius:8, padding:3 }}>
              {[{id:'all',l:'All'},{id:'sent',l:'Sent'},{id:'received',l:'Received'},{id:'whatsapp',l:'WhatsApp'},{id:'sms',l:'SMS'}].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:'5px 13px', borderRadius:6, border:'none', cursor:'pointer', background:tab===t.id?'var(--accent)':'transparent', color:tab===t.id?'#fff':'var(--text-muted)', fontSize:12, fontFamily:'var(--font-body)', fontWeight:tab===t.id?600:400, transition:'var(--transition)' }}>{t.l}</button>
              ))}
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
              <Button variant="secondary" size="sm" icon={Bell} onClick={()=>setBulk(true)}>Bulk Remind</Button>
              <Button variant="primary" size="sm" icon={Plus} onClick={()=>setCompose(true)}>Compose</Button>
            </div>
          </div>

          <Card style={{ overflow:'hidden' }}>
            {filtered.map((msg,i)=>{
              const CIcon=msg.channel==='WhatsApp'?Smartphone:Phone;
              return (
                <div key={msg.id} style={{ padding:'14px 18px', borderBottom:i<filtered.length-1?'1px solid var(--border-light)':'none', display:'flex', gap:12, alignItems:'flex-start', transition:'var(--transition)' }}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface-2)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <Avatar name={msg.clientName} size={36}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:4, flexWrap:'wrap' }}>
                      <span style={{ fontSize:13.5, fontWeight:600, color:'var(--text-primary)' }}>{msg.clientName}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:11.5, color:chColor[msg.channel] }}><CIcon size={11}/>{msg.channel}</span>
                      <Badge variant={msg.direction==='Outbound'?'accent':'info'} style={{fontSize:10.5}}>{msg.direction}</Badge>
                      <Badge variant={msg.type==='Reminder'?'warning':msg.type==='Welcome'?'success':'default'} style={{fontSize:10.5}}>{msg.type}</Badge>
                    </div>
                    <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.5, marginBottom:4 }}>{msg.message}</p>
                    <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:11.5, color:'var(--text-placeholder)' }}>
                      <span>{msg.timestamp}</span>
                      {msg.status==='Read'&&<span style={{ display:'flex', alignItems:'center', gap:3, color:'var(--info)' }}><CheckCheck size={11}/>Read</span>}
                      {msg.status==='Delivered'&&<span style={{ display:'flex', alignItems:'center', gap:3 }}><Check size={11}/>Delivered</span>}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Reply</Button>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          <Card style={{ padding:18 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, marginBottom:12 }}>Message Templates</div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {templates.map(t=>(
                <div key={t.id} onClick={()=>{setSelTemplate(t);setComposeText(t.body);setCompose(true);}} style={{ padding:'9px 11px', background:'var(--bg-surface-2)', borderRadius:8, cursor:'pointer', border:'1px solid var(--border-light)', transition:'var(--transition)' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='var(--accent-light)';e.currentTarget.style.borderColor='var(--accent-mid)';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='var(--bg-surface-2)';e.currentTarget.style.borderColor='var(--border-light)';}}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:'var(--text-primary)', marginBottom:2 }}>{t.name}</div>
                  <div style={{ fontSize:11.5, color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.body.substring(0,50)}…</div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding:18 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, marginBottom:12, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              Upcoming Reminders
              <span style={{ fontSize:11, background:'var(--warning-light)', color:'var(--warning)', padding:'2px 8px', borderRadius:20, border:'1px solid var(--warning-mid)' }}>{upcoming.length}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {upcoming.map((r,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 10px', background:'var(--bg-surface-2)', border:'1px solid var(--border-light)', borderRadius:8 }}>
                  <div><div style={{ fontSize:12.5, fontWeight:600 }}>{r.name}</div><div style={{ fontSize:11.5, color:'var(--text-muted)' }}>{r.date}</div></div>
                  <Button variant="secondary" size="sm" icon={Send}>Remind</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal open={compose} onClose={()=>{setCompose(false);setComposeText('');setSelTemplate(null);}} title="Compose Message" width={520}>
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          <Select label="Client"><option value="">Select…</option>{mockClients.map(c=><option key={c.id}>{c.fullName} — {c.phone}</option>)}</Select>
          <div style={{ display:'flex', gap:10 }}>
            {['WhatsApp','SMS'].map(ch=>(
              <button key={ch} onClick={()=>setChannel(ch)} style={{ flex:1, padding:9, borderRadius:8, border:`1px solid ${channel===ch?chColor[ch]:'var(--border-default)'}`, background:channel===ch?chColor[ch]+'20':'var(--bg-surface-2)', color:channel===ch?chColor[ch]:'var(--text-muted)', cursor:'pointer', fontFamily:'var(--font-body)', fontSize:13, fontWeight:600, transition:'var(--transition)' }}>{ch}</button>
            ))}
          </div>
          {selTemplate&&<div style={{ fontSize:11.5, color:'var(--accent)', background:'var(--accent-light)', padding:'6px 10px', borderRadius:6, border:'1px solid var(--accent-mid)' }}>Template: <strong>{selTemplate.name}</strong></div>}
          <div>
            <div style={{ fontSize:12.5, fontWeight:500, color:'var(--text-secondary)', marginBottom:6 }}>Message</div>
            <textarea value={composeText} onChange={e=>setComposeText(e.target.value)} rows={5} placeholder="Type your message… Use {name}, {date}, {amount} for dynamic fields."
              style={{ width:'100%', background:'var(--bg-surface-2)', border:'1px solid var(--border-default)', borderRadius:8, padding:'10px 12px', color:'var(--text-primary)', fontSize:13, fontFamily:'var(--font-body)', resize:'vertical', outline:'none', lineHeight:1.6 }}
              onFocus={e=>{e.target.style.borderColor='var(--border-focus)';e.target.style.boxShadow='0 0 0 3px rgba(37,99,235,0.1)';}}
              onBlur={e=>{e.target.style.borderColor='var(--border-default)';e.target.style.boxShadow='none';}}/>
            <div style={{ fontSize:11.5, color:'var(--text-placeholder)', marginTop:4 }}>{composeText.length} characters</div>
          </div>
          <Button variant="ghost" size="sm" icon={Sparkles} onClick={()=>setAiAssistantOpen(true)}>Draft with NutriAI</Button>
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <Button variant="secondary" onClick={()=>setCompose(false)}>Cancel</Button>
            <Button variant="primary" icon={Send} onClick={()=>setCompose(false)}>Send</Button>
          </div>
        </div>
      </Modal>

      <Modal open={bulk} onClose={()=>setBulk(false)} title="Bulk Reminders" width={460}>
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          <div style={{ background:'var(--warning-light)', border:'1px solid var(--warning-mid)', borderRadius:9, padding:'11px 13px', fontSize:13, color:'var(--warning)' }}>
            Will send reminders to <strong>{upcoming.length} clients</strong> with upcoming appointments.
          </div>
          <Select label="Channel"><option>WhatsApp</option><option>SMS</option><option>Both</option></Select>
          <Select label="Template">{templates.map(t=><option key={t.id}>{t.name}</option>)}</Select>
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <Button variant="secondary" onClick={()=>setBulk(false)}>Cancel</Button>
            <Button variant="primary" onClick={()=>setBulk(false)}>Send All</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
