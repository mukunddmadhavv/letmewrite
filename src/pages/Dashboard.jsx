import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import RightPanel from '../components/RightPanel';
import OrderCard from '../components/OrderCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { getUserOrders } from '../services/orders';
import { signOut } from '../services/auth';
import { PlusCircle, LogOut, ClipboardX } from 'lucide-react';

export default function Dashboard({ session }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;
    getUserOrders(session.user.id).then(({ data }) => {
      setOrders(data || []);
      setLoading(false);
    });
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userName = session?.user?.user_metadata?.full_name || session?.user?.email || 'Student';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main feed */}
      <main style={{ flex: 1, borderRight: '1px solid var(--border)', overflowY: 'auto', minWidth: 0 }}>
        {/* Header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>My Orders</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              Welcome back, {userName.split(' ')[0]} 👋
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/order" className="btn btn-primary">
              <PlusCircle size={15} />
              New Order
            </Link>
            <button onClick={handleSignOut} className="btn btn-ghost" title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Feed */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {loading ? (
            <SkeletonLoader count={3} />
          ) : orders.length === 0 ? (
            <EmptyState />
          ) : (
            orders.map((order, i) => (
              <div key={order.id} style={{ animation: `slideUp 0.3s ease ${i * 0.05}s both` }}>
                <OrderCard order={order} />
              </div>
            ))
          )}
        </div>
      </main>

      {/* Right panel — hidden on smaller screens via CSS var */}
      <div style={{ display: 'var(--right-panel-display, flex)' }}>
        <RightPanel />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <ClipboardX size={28} color="var(--text-muted)" />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No orders yet</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 280, margin: '0 auto 24px' }}>
        Place your first order and get a high-quality assignment at just ₹10/page.
      </p>
      <Link to="/order" className="btn btn-primary">
        <PlusCircle size={16} />
        Place First Order
      </Link>
    </div>
  );
}
