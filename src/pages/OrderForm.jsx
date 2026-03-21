import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orders';
import Sidebar from '../components/Sidebar';
import { Send, BookOpen, FileText, Calendar, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

const RATE = 10;

const subjects = [
  'Engineering', 'Law', 'Management / MBA', 'Commerce / Finance',
  'Science', 'Arts / Humanities', 'Medical', 'Computer Science', 'Other',
];

export default function OrderForm({ session }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', subject: '', pages: 5, deadline: '', instructions: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const total = form.pages * RATE;
  const minDate = new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 16);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.pages || !form.deadline) {
      setError('Please fill in all required fields.'); return;
    }
    setLoading(true); setError('');
    const { error: err } = await createOrder({
      ...form,
      pages: Number(form.pages),
      userId: session.user.id,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    navigate('/payment');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />

      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {/* Header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px',
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>New Order</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Fill in your assignment details below</p>
        </div>

        <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 20, fontSize: 14, color: '#ef4444' }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Title */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} color="var(--accent)" /> Assignment Details
              </h2>
              <div className="form-group">
                <label className="form-label">Assignment Title *</label>
                <input type="text" placeholder="e.g. Marketing Case Study on Apple Inc."
                  value={form.title} onChange={set('title')} className="form-input" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Subject *</label>
                <select value={form.subject} onChange={set('subject')} className="form-input">
                  <option value="">Select subject…</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Pages + Deadline */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={16} color="var(--accent)" /> Scope & Timeline
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Number of Pages *</label>
                  <input
                    type="number" min={1} max={200}
                    value={form.pages}
                    onChange={e => setForm({ ...form, pages: Math.max(1, Number(e.target.value)) })}
                    className="form-input"
                  />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>1 page = 250–300 words</span>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Deadline *</label>
                  <input type="datetime-local" min={minDate}
                    value={form.deadline} onChange={set('deadline')} className="form-input" />
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageSquare size={16} color="var(--accent)" /> Instructions
              </h2>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Special Instructions / Requirements</label>
                <textarea
                  placeholder="Describe your assignment in detail — topic, word limit, citation style (APA/MLA), specific points to cover, etc."
                  value={form.instructions} onChange={set('instructions')}
                  className="form-input" style={{ minHeight: 120 }}
                />
              </div>
            </div>

            {/* Cost summary & Submit */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Order Total</div>
                  <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--accent)' }}>
                    ₹{total.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {form.pages} page{form.pages !== 1 ? 's' : ''} × ₹{RATE}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                  {['Plagiarism-free', 'Free revisions', 'On-time delivery'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={13} color="var(--success)" /> {f}
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={loading}
              >
                {loading ? 'Submitting…' : <><Send size={16} /> Place Order — ₹{total.toLocaleString('en-IN')}</>}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
