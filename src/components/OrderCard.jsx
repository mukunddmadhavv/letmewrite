import { FileText, Calendar, Clock, CheckCircle2, CircleDot, Hourglass } from 'lucide-react';

const statusConfig = {
  'Pending':     { label: 'Pending',     class: 'badge-pending',   icon: Clock        },
  'In Progress': { label: 'In Progress', class: 'badge-progress',  icon: CircleDot    },
  'Completed':   { label: 'Completed',   class: 'badge-completed', icon: CheckCircle2 },
};

export default function OrderCard({ order }) {
  const cfg = statusConfig[order.status] || statusConfig['Pending'];
  const StatusIcon = cfg.icon;

  const deadline = new Date(order.deadline).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="card" style={{ padding: '20px 24px', animationFillMode: 'both' }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText size={18} color="var(--accent)" />
          </div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{order.title}</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.subject}</span>
          </div>
        </div>
        <span className={`badge ${cfg.class}`}>
          <StatusIcon size={11} />
          {cfg.label}
        </span>
      </div>

      {/* Divider */}
      <div className="divider" style={{ margin: '12px 0' }} />

      {/* Details row */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <Detail label="Pages" value={`${order.pages} pg`} />
        <Detail label="Cost"  value={`₹${order.cost || order.pages * 10}`} accent />
        <Detail label="Deadline" value={deadline} icon={<Calendar size={12} />} />
      </div>

      {/* Instructions preview */}
      {order.instructions && (
        <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, borderLeft: '2px solid var(--border)', paddingLeft: 10 }}>
          {order.instructions.slice(0, 120)}{order.instructions.length > 120 ? '…' : ''}
        </p>
      )}
    </div>
  );
}

function Detail({ label, value, accent, icon }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: accent ? 'var(--accent)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon}{value}
      </div>
    </div>
  );
}
