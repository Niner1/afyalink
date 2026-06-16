import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Send, Bot, User, Loader } from 'lucide-react';

const quickPrompts = [
  "Today's appointments",
  "Amara Osei summary",
  "Diabetes meal plan",
  "Iron deficiency diet",
  "May revenue report",
  "Who needs follow-up?",
];

export default function AiAssistant() {
  const { aiAssistantOpen, setAiAssistantOpen, aiMessages, sendAiMessage, aiLoading } = useApp();
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [aiMessages, aiLoading]);
  useEffect(() => { if (aiAssistantOpen) setTimeout(() => inputRef.current?.focus(), 100); }, [aiAssistantOpen]);

  const handleSend = () => { const m = input.trim(); if (!m || aiLoading) return; setInput(''); sendAiMessage(m); };
  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const fmt = text => text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color: 'var(--accent)', fontWeight: 600 }}>{p.slice(2,-2)}</strong>
      : <span key={i}>{p}</span>
  );

  if (!aiAssistantOpen) return null;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex', alignItems:'flex-end', justifyContent:'flex-end', padding:'16px', pointerEvents:'none' }}>
      <div onClick={() => setAiAssistantOpen(false)} style={{ position:'absolute', inset:0, background:'rgba(15,23,42,0.3)', backdropFilter:'blur(2px)', pointerEvents:'all' }} />
      <div style={{
        position:'relative', width:'min(420px, calc(100vw - 32px))',
        height:'min(680px, calc(100vh - 80px))',
        background:'var(--bg-surface)', border:'1px solid var(--border-default)',
        borderRadius:'var(--radius-xl)', display:'flex', flexDirection:'column',
        boxShadow:'var(--shadow-xl)', pointerEvents:'all',
        animation:'scaleIn 0.2s ease forwards', transformOrigin:'bottom right', overflow:'hidden',
      }}>
        {/* Header */}
        <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border-light)', background:'var(--accent)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Sparkles size={15} color="#fff" />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, color:'#fff' }}>AFyalinkAI Assistant</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:'#4ADE80', display:'inline-block' }} />
              AI-powered clinical support
            </div>
          </div>
          <button onClick={() => setAiAssistantOpen(false)} style={{ background:'rgba(255,255,255,0.2)', border:'none', cursor:'pointer', color:'#fff', borderRadius:6, padding:'4px 6px', display:'flex', alignItems:'center' }}>
            <X size={15} />
          </button>
        </div>

        {/* Quick prompts */}
        <div style={{ padding:'10px 14px', borderBottom:'1px solid var(--border-light)', background:'var(--bg-surface-2)', display:'flex', gap:6, overflowX:'auto', flexWrap:'nowrap' }}>
          {quickPrompts.map(p => (
            <button key={p} onClick={() => { setInput(p); inputRef.current?.focus(); }} style={{
              background:'var(--bg-surface)', border:'1px solid var(--border-default)',
              borderRadius:20, padding:'4px 10px', fontSize:11.5, color:'var(--text-muted)',
              cursor:'pointer', whiteSpace:'nowrap', fontFamily:'var(--font-body)', transition:'var(--transition)', flexShrink:0,
            }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--accent-light)'; e.currentTarget.style.color='var(--accent)'; e.currentTarget.style.borderColor='var(--accent-mid)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--bg-surface)'; e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.borderColor='var(--border-default)'; }}
            >{p}</button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>
          {aiMessages.map((msg, i) => (
            <div key={i} style={{ display:'flex', flexDirection:msg.role==='user'?'row-reverse':'row', gap:8, marginBottom:14, animation:'fadeIn 0.25s ease' }}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:msg.role==='user'?'#6366F1':'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                {msg.role==='user' ? <User size={12} color="#fff" /> : <Bot size={12} color="#fff" />}
              </div>
              <div style={{
                maxWidth:'82%', background:msg.role==='user'?'var(--accent)':'var(--bg-surface-2)',
                border:`1px solid ${msg.role==='user'?'transparent':'var(--border-light)'}`,
                borderRadius:msg.role==='user'?'14px 4px 14px 14px':'4px 14px 14px 14px',
                padding:'9px 13px', fontSize:13, lineHeight:1.6,
                color:msg.role==='user'?'#fff':'var(--text-primary)', whiteSpace:'pre-wrap',
              }}>{fmt(msg.content)}</div>
            </div>
          ))}
          {aiLoading && (
            <div style={{ display:'flex', gap:8, marginBottom:14 }}>
              <div style={{ width:26, height:26, borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Bot size={12} color="#fff" />
              </div>
              <div style={{ background:'var(--bg-surface-2)', border:'1px solid var(--border-light)', borderRadius:'4px 14px 14px 14px', padding:'12px 16px', display:'flex', alignItems:'center', gap:6 }}>
                <Loader size={13} color="var(--accent)" style={{ animation:'spin 1s linear infinite' }} />
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>Analysing…</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{ padding:'12px 14px', borderTop:'1px solid var(--border-light)', display:'flex', gap:8, alignItems:'flex-end', background:'var(--bg-surface)' }}>
          <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder="Ask AFyalinkAI anything…" rows={1}
            style={{ flex:1, background:'var(--bg-surface-2)', border:'1px solid var(--border-default)', borderRadius:10, padding:'9px 12px', color:'var(--text-primary)', fontSize:13, fontFamily:'var(--font-body)', resize:'none', outline:'none', lineHeight:1.5, maxHeight:90, overflowY:'auto', transition:'var(--transition)' }}
            onFocus={e => { e.target.style.borderColor='var(--border-focus)'; e.target.style.boxShadow='0 0 0 3px rgba(37,99,235,0.1)'; }}
            onBlur={e => { e.target.style.borderColor='var(--border-default)'; e.target.style.boxShadow='none'; }}
          />
          <button onClick={handleSend} disabled={!input.trim()||aiLoading} style={{
            width:36, height:36, borderRadius:9, background:input.trim()&&!aiLoading?'var(--accent)':'var(--bg-surface-3)',
            border:'1px solid', borderColor:input.trim()&&!aiLoading?'transparent':'var(--border-default)',
            cursor:input.trim()&&!aiLoading?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center',
            color:input.trim()&&!aiLoading?'#fff':'var(--text-placeholder)', flexShrink:0, transition:'var(--transition)',
          }}>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
