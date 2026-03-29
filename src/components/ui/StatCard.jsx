import React from 'react';

export default function StatCard({ icon, label, value, unit, sub, color, delay = 0 }) {
  return (
    <div className="fade-up" style={{
      animationDelay: `${delay}ms`,
      background:'var(--bg-card)', border:'1px solid var(--border)',
      borderRadius:'var(--radius)', padding:'16px 18px',
      display:'flex', flexDirection:'column', gap:'6px',
      transition:'border-color 0.2s, transform 0.2s',
      cursor:'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-bright)'; e.currentTarget.style.transform='translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)'; }}
    >
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:'0.7rem', fontFamily:'var(--font-mono)', color:'var(--text-muted)', letterSpacing:'0.1em', textTransform:'uppercase' }}>
          {label}
        </span>
        <span style={{ fontSize:'1.1rem' }}>{icon}</span>
      </div>
      <div style={{ display:'flex', alignItems:'baseline', gap:'4px' }}>
        <span style={{ fontSize:'1.6rem', fontWeight:800, color: color || 'var(--text-primary)', lineHeight:1 }}>
          {value ?? '—'}
        </span>
        {unit && <span style={{ fontSize:'0.75rem', color:'var(--text-secondary)', fontFamily:'var(--font-mono)' }}>{unit}</span>}
      </div>
      {sub && <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{sub}</span>}
    </div>
  );
}
