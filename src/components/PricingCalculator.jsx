import { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function PricingCalculator() {
  const [pages, setPages] = useState(5);
  const RATE = 10;
  const total = pages * RATE;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Calculator size={18} color="var(--accent)" />
        <span style={{ fontWeight: 600, fontSize: 15 }}>Price Calculator</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="range"
          min={1} max={100}
          value={pages}
          onChange={e => setPages(Number(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--accent)', height: 4, cursor: 'pointer' }}
        />
        <input
          type="number"
          min={1} max={200}
          value={pages}
          onChange={e => setPages(Math.max(1, Number(e.target.value)))}
          className="form-input"
          style={{ width: 70, textAlign: 'center' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--accent-subtle)', border: '1px solid rgba(124,92,252,0.2)', borderRadius: 'var(--radius-md)', padding: '14px 18px' }}>
        <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          {pages} page{pages !== 1 ? 's' : ''} × ₹{RATE}
        </span>
        <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em' }}>
          ₹{total.toLocaleString('en-IN')}
        </span>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        * Standard page = 250–300 words. Prices inclusive of all revisions.
      </p>
    </div>
  );
}
