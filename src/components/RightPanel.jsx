import { Lightbulb, Tag, Gift } from 'lucide-react';

const tips = [
  { icon: Lightbulb, text: 'Submit your brief early to get priority processing.' },
  { icon: Tag,       text: 'Order 10+ pages and save more per page.' },
  { icon: Gift,      text: 'Refer a friend and earn ₹50 bonus credits.' },
];

export default function RightPanel() {
  return (
    <aside style={{
      width: 'var(--right-panel-width)',
      minWidth: 'var(--right-panel-width)',
      height: '100vh',
      position: 'sticky', top: 0,
      padding: '24px 16px',
      overflowY: 'auto',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      {/* Promo */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(29, 155, 240, 0.15) 0%, rgba(29, 155, 240, 0.05) 100%)',
        border: '1px solid rgba(29, 155, 240, 0.2)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
      }}>
        <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>🔥 Limited Offer</div>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>₹10 / page</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Flat rate for every assignment. No hidden charges.
        </div>
      </div>

      {/* Tips */}
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Tips & Rewards</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tips.map(({ icon: Icon, text }, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={15} color="var(--accent)" />
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, paddingTop: 6 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
        LetMeWrite.in · Made for students
      </p>
    </aside>
  );
}
