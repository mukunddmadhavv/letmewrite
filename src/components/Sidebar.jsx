import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, PlusCircle, User, PenLine } from 'lucide-react';

const links = [
  { to: '/dashboard', icon: Home,          label: 'Home'      },
  { to: '/order',     icon: PlusCircle,    label: 'New Order' },
  { to: '/orders',    icon: ClipboardList, label: 'My Orders' },
  { to: '/profile',   icon: User,          label: 'Profile'   },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      minWidth: 'var(--sidebar-width)',
      height: '100vh',
      position: 'sticky', top: 0,
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 12px',
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 24, textDecoration: 'none' }}>
        <div style={{ background: 'var(--accent)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <PenLine size={16} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
          LetMe<span style={{ color: 'var(--accent)' }}>Write</span>
        </span>
      </Link>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: active ? 'var(--bg-hover)' : 'transparent',
                fontWeight: active ? 600 : 400,
                fontSize: 15,
                transition: 'all var(--transition)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* New Order CTA */}
      <div style={{ marginTop: 'auto' }}>
        <Link to="/order" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          <PlusCircle size={16} />
          Place Order
        </Link>
      </div>
    </aside>
  );
}
