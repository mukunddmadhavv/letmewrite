import { Link, useNavigate } from 'react-router-dom';
import { PenLine, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';

export default function Navbar({ session }) {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            background: 'var(--accent)', borderRadius: 8,
            width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PenLine size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>
            LetMe<span style={{ color: 'var(--accent)' }}>Write</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {session ? (
            <Link to="/order" className="btn btn-primary">
              <LayoutDashboard size={15} />
              Place Order
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                <LogIn size={15} />
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                <UserPlus size={15} />
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
