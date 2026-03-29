import React from 'react';

export default function ChartCard({ title, children, height = 200 }) {
  return (
    <div className="fade-up" style={{
      background:'var(--bg-card)', border:'1px solid var(--border)',
      borderRadius:'var(--radius)', padding:'16px', marginBottom:'12px',
      overflowX:'auto',
    }}>
      <div style={{ fontSize:'0.75rem', fontFamily:'var(--font-mono)', color:'var(--text-secondary)', marginBottom:'12px', letterSpacing:'0.08em', textTransform:'uppercase' }}>
        {title}
      </div>
      <div style={{ minWidth:'500px' }}>
        {children}
      </div>
    </div>
  );
}
