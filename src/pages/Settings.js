import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../components/UI';
import { User, Bell, Shield, Database, Palette, Globe, Smartphone, CreditCard, Save, ChevronRight, Check } from 'lucide-react';

const sections=[{id:'profile',label:'Profile',icon:User},{id:'notifications',label:'Notifications',icon:Bell},{id:'security',label:'Security',icon:Shield},{id:'integrations',label:'Integrations',icon:Globe},{id:'appearance',label:'Appearance',icon:Palette},{id:'data',label:'Data & Backup',icon:Database}];

function Toggle({label,defaultChecked}){
  const [on,setOn]=useState(defaultChecked);
  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border-light)'}}>
      <span style={{fontSize:13,color:'var(--text-secondary)'}}>{label}</span>
      <button onClick={()=>setOn(!on)} style={{width:40,height:22,borderRadius:11,border:'none',cursor:'pointer',background:on?'var(--accent)':'var(--bg-surface-3)',position:'relative',transition:'var(--transition)',flexShrink:0}}>
        <span style={{position:'absolute',top:3,left:on?21:3,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'var(--transition)',boxShadow:'var(--shadow-sm)'}}/>
      </button>
    </div>
  );
}

export default function Settings(){
  const [active,setActive]=useState('profile');
  const [saved,setSaved]=useState(false);
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);};

  const renderSection=()=>{
    if(active==='profile') return(
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:3}}>Clinic Profile</h3><p style={{fontSize:13,color:'var(--text-muted)'}}>Manage your clinic information and branding</p></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
          <Input label="Clinic Name" defaultValue="NutriCare Clinic"/>
          <Input label="Registration No." defaultValue="MED-2022-4571"/>
          <Input label="Primary Dietitian" defaultValue="Dr. Wanjiku Kariuki"/>
          <Input label="Contact Phone" defaultValue="+254 700 000 000"/>
          <Input label="Email" defaultValue="info@nutricare.co.ke"/>
          <Input label="Website" defaultValue="www.nutricare.co.ke"/>
          <div style={{gridColumn:'1/-1'}}><Input label="Address" defaultValue="Westlands Medical Centre, Nairobi"/></div>
          <Select label="Country"><option>Kenya</option><option>Uganda</option><option>Tanzania</option></Select>
          <Select label="Currency"><option>KES — Kenyan Shilling</option><option>USD</option></Select>
          <div style={{gridColumn:'1/-1'}}><Input label="Standard Consultation Fee (KES)" defaultValue="3500" type="number"/></div>
        </div>
      </div>
    );
    if(active==='notifications') return(
      <div style={{display:'flex',flexDirection:'column',gap:18}}>
        <div><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:3}}>Notification Preferences</h3><p style={{fontSize:13,color:'var(--text-muted)'}}>Configure when and how you receive alerts</p></div>
        {[{g:'Appointments',items:[['New booking confirmation',true],['Reminder (24h before)',true],['Cancellation or reschedule',true]]},{g:'Clients',items:[['New client registration',true],['Critical risk alert',true],['Inactive client (>60 days)',false]]},{g:'Billing',items:[['Payment received',true],['Outstanding balance reminder',false],['Monthly revenue summary',true]]}].map(group=>(
          <div key={group.g}><div style={{fontSize:13,fontWeight:600,color:'var(--text-secondary)',marginBottom:8}}>{group.g}</div>{group.items.map(([l,d])=><Toggle key={l} label={l} defaultChecked={d}/>)}</div>
        ))}
      </div>
    );
    if(active==='security') return(
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:3}}>Security Settings</h3><p style={{fontSize:13,color:'var(--text-muted)'}}>Manage passwords, access, and sessions</p></div>
        <Card style={{padding:18}}><div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Change Password</div><div style={{display:'flex',flexDirection:'column',gap:11,maxWidth:380}}><Input label="Current Password" type="password" placeholder="••••••••"/><Input label="New Password" type="password" placeholder="••••••••"/><Input label="Confirm Password" type="password" placeholder="••••••••"/><Button variant="secondary" size="sm" style={{alignSelf:'flex-start'}}>Update Password</Button></div></Card>
        <Card style={{padding:18}}><div style={{fontSize:14,fontWeight:600,marginBottom:10}}>Two-Factor Authentication</div><div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><p style={{fontSize:13,color:'var(--text-muted)'}}>Add extra security to your account.</p><Badge variant="default" style={{marginTop:6}}>Not Enabled</Badge></div><Button variant="primary" size="sm">Enable 2FA</Button></div></Card>
      </div>
    );
    if(active==='integrations') return(
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <div><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:3}}>Integrations</h3><p style={{fontSize:13,color:'var(--text-muted)'}}>Connect with external services</p></div>
        {[{n:"M-Pesa (Safaricom)",d:"Accept mobile payments",icon:Smartphone,s:'Connected',c:'var(--success)'},{n:"Africa's Talking SMS",d:"Bulk SMS reminders",icon:Bell,s:'Connected',c:'var(--success)'},{n:"WhatsApp Business API",d:"WhatsApp messaging",icon:Smartphone,s:'Not Connected',c:'var(--text-muted)'},{n:"Google Calendar",d:"Sync appointments",icon:Globe,s:'Not Connected',c:'var(--text-muted)'},{n:"Health Insurance API",d:"NHIF & private claims",icon:CreditCard,s:'Pending Setup',c:'var(--warning)'}].map(int=>(
          <Card key={int.n} style={{padding:16}}>
            <div style={{display:'flex',alignItems:'center',gap:11}}>
              <div style={{width:40,height:40,borderRadius:10,background:'var(--bg-surface-2)',border:'1px solid var(--border-light)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><int.icon size={17} color={int.c}/></div>
              <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600,marginBottom:2}}>{int.n}</div><div style={{fontSize:12,color:'var(--text-muted)'}}>{int.d}</div></div>
              <Badge variant={int.s==='Connected'?'success':int.s==='Pending Setup'?'warning':'default'}>{int.s}</Badge>
              <Button variant={int.s==='Connected'?'secondary':'primary'} size="sm">{int.s==='Connected'?'Configure':int.s==='Pending Setup'?'Complete':'Connect'}</Button>
            </div>
          </Card>
        ))}
      </div>
    );
    if(active==='appearance') return(
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:3}}>Appearance</h3><p style={{fontSize:13,color:'var(--text-muted)'}}>Customise the look and feel</p></div>
        <Card style={{padding:18}}><div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Theme</div><div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{['Light (Current)','Dark','System'].map(t=><div key={t} style={{padding:'10px 18px',borderRadius:9,cursor:'pointer',background:t==='Light (Current)'?'var(--accent-light)':'var(--bg-surface-2)',border:`1px solid ${t==='Light (Current)'?'var(--accent-mid)':'var(--border-light)'}`,fontSize:13,color:t==='Light (Current)'?'var(--accent)':'var(--text-muted)',display:'flex',alignItems:'center',gap:6}}>{t==='Light (Current)'&&<Check size={13} color="var(--accent)"/>}{t}</div>)}</div></Card>
        <Card style={{padding:18}}><div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Accent Colour</div><div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{['#2563EB','#059669','#7C3AED','#DC2626','#D97706','#0891B2'].map(c=><div key={c} style={{width:34,height:34,borderRadius:'50%',background:c,cursor:'pointer',border:c==='#2563EB'?'3px solid white':'3px solid transparent',boxShadow:c==='#2563EB'?`0 0 0 2px ${c}`:'none',transition:'var(--transition)'}}/>)}</div></Card>
      </div>
    );
    if(active==='data') return(
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:3}}>Data & Backup</h3><p style={{fontSize:13,color:'var(--text-muted)'}}>Manage exports and backup schedule</p></div>
        <Card style={{padding:18}}><div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Data Export</div><div style={{display:'flex',gap:9,flexWrap:'wrap'}}>{['All Clients (CSV)','Appointments (CSV)','Billing (XLSX)','Full Backup (JSON)'].map(e=><Button key={e} variant="secondary" size="sm">{e}</Button>)}</div></Card>
        <Card style={{padding:18}}><div style={{fontSize:14,fontWeight:600,marginBottom:10}}>Automatic Backups</div><Toggle label="Enable daily automatic backup" defaultChecked={true}/><div style={{marginTop:10}}><Select label="Frequency"><option>Daily</option><option>Weekly</option></Select></div><div style={{fontSize:12,color:'var(--text-muted)',marginTop:10}}>Last backup: May 16, 2025 — 11:00 PM</div></Card>
        <Card style={{padding:18,borderColor:'var(--danger-mid)'}}><div style={{fontSize:14,fontWeight:600,color:'var(--danger)',marginBottom:6}}>Danger Zone</div><p style={{fontSize:13,color:'var(--text-muted)',marginBottom:12}}>Irreversible actions — proceed with caution.</p><div style={{display:'flex',gap:9}}><Button variant="danger" size="sm">Clear Test Data</Button><Button variant="danger" size="sm">Delete Account</Button></div></Card>
      </div>
    );
    return null;
  };

  return(
    <div style={{display:'flex',gap:20,animation:'fadeIn 0.25s ease',flexWrap:'wrap'}}>
      <div style={{width:210,flexShrink:0}}>
        <Card style={{padding:8}}>
          {sections.map(s=>{
            const Icon=s.icon; const isA=active===s.id;
            return(
              <button key={s.id} onClick={()=>setActive(s.id)} style={{display:'flex',alignItems:'center',gap:9,width:'100%',padding:'9px 11px',borderRadius:7,border:'none',cursor:'pointer',background:isA?'var(--accent-light)':'transparent',color:isA?'var(--accent)':'var(--text-muted)',fontFamily:'var(--font-body)',fontSize:13.5,fontWeight:isA?600:400,transition:'var(--transition)',textAlign:'left',marginBottom:1}}
                onMouseEnter={e=>{if(!isA){e.currentTarget.style.background='var(--bg-surface-2)';e.currentTarget.style.color='var(--text-primary)';}}}
                onMouseLeave={e=>{if(!isA){e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--text-muted)';}}}
              ><Icon size={14} strokeWidth={isA?2.2:1.8}/>{s.label}{isA&&<ChevronRight size={13} style={{marginLeft:'auto'}}/>}</button>
            );
          })}
        </Card>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <Card style={{padding:26}}>
          {renderSection()}
          <div style={{marginTop:24,paddingTop:18,borderTop:'1px solid var(--border-light)',display:'flex',justifyContent:'flex-end',gap:9}}>
            <Button variant="secondary">Discard</Button>
            <Button variant="primary" icon={saved?Check:Save} onClick={save} style={{background:saved?'var(--success)':'var(--accent)'}}>{saved?'Saved!':'Save Changes'}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
