import React, { useState, useMemo, useEffect } from 'react';
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
          <Input label="Clinic Name" defaultValue="AFyalink Clinic"/>
          <Input label="Registration No." defaultValue="MED-2022-4571"/>
          <Input label="Primary Dietitian" defaultValue="Dr. Wanjiku Kariuki"/>
          <Input label="Contact Phone" defaultValue="+254 700 000 000"/>
          <Input label="Email" defaultValue="info@afyalink.co.ke"/>
          <Input label="Website" defaultValue="www.afyalink.co.ke"/>
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
        <div><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:3}}>Security Settings</h3><p style={{fontSize:13,color:'var(--text-muted)'}}>Manage your account security and access</p></div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Button variant="secondary" style={{justifyContent:'flex-start'}}>Change Password</Button>
          <Button variant="secondary" style={{justifyContent:'flex-start'}}>Two-Factor Authentication</Button>
          <Button variant="secondary" style={{justifyContent:'flex-start'}}>Active Sessions</Button>
          <Button variant="secondary" style={{justifyContent:'flex-start'}}>Login History</Button>
        </div>
      </div>
    );
    if(active==='integrations') return(
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:3}}>Integrations</h3><p style={{fontSize:13,color:'var(--text-muted)'}}>Connect third-party services and APIs</p></div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[{name:'WhatsApp Business',status:'Connected',icon:Smartphone},{name:'SMS Gateway',status:'Connected',icon:Smartphone},{name:'Email Service',status:'Not Connected',icon:Globe}].map(i=>(
            <Card key={i.name} style={{padding:14,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <i.icon size={20} color="var(--accent)"/>
                <div><div style={{fontSize:13,fontWeight:600}}>{i.name}</div><div style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{i.status}</div></div>
              </div>
              <Badge variant={i.status==='Connected'?'success':'default'}>{i.status}</Badge>
            </Card>
          ))}
        </div>
      </div>
    );
    if(active==='appearance') return(
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:3}}>Appearance</h3><p style={{fontSize:13,color:'var(--text-muted)'}}>Customize the look and feel</p></div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Toggle label="Dark Mode" defaultChecked={false}/>
          <Toggle label="Compact View" defaultChecked={false}/>
          <Toggle label="Reduce Motion" defaultChecked={false}/>
        </div>
      </div>
    );
    if(active==='data') return(
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <div><h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,marginBottom:3}}>Data & Backup</h3><p style={{fontSize:13,color:'var(--text-muted)'}}>Manage your data and backups</p></div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <Button variant="secondary" style={{justifyContent:'flex-start'}}>Export Data</Button>
          <Button variant="secondary" style={{justifyContent:'flex-start'}}>Create Backup</Button>
          <Button variant="secondary" style={{justifyContent:'flex-start'}}>Restore from Backup</Button>
          <Button variant="danger" style={{justifyContent:'flex-start',marginTop:10}}>Delete All Data</Button>
        </div>
      </div>
    );
  };

  return(
    <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gap:20,animation:'fadeIn 0.25s ease'}}>
      {/* Sidebar */}
      <div style={{display:'flex',flexDirection:'column',gap:3}}>
        {sections.map(s=>{
          const Icon=s.icon;
          const isA=active===s.id;
          return(
            <button key={s.id} onClick={()=>setActive(s.id)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:8,border:'none',cursor:'pointer',background:isA?'var(--accent-light)':'transparent',color:isA?'var(--accent)':'var(--text-secondary)',fontSize:13,fontWeight:isA?600:500,fontFamily:'var(--font-body)',transition:'var(--transition)'}}>
              <Icon size={16}/>
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        <Card style={{padding:24}}>
          {renderSection()}
        </Card>
        <div style={{display:'flex',gap:10}}>
          <Button variant="primary" icon={Save} onClick={save} style={{display:'flex',alignItems:'center',gap:8}}>
            {saved?<><Check size={16}/>Saved</>:<>Save Changes</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
