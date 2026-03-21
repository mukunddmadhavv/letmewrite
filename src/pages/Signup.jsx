import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../services/auth';

export default function Signup({ setSession }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.phone || !form.password) { setError('All fields are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    setError('');
    const { data, error: err } = await signUp(form);
    setLoading(false);

    if (err) { setError(err.message || 'Signup failed'); return; }
    setSession(data);
    navigate('/order');
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#1d9bf0' }}>LMW</span>
        </div>
        <h1 style={styles.title}>Create an account</h1>
        <p style={styles.sub}>Start ordering assignments at ₹10/page</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { field: 'username', label: 'Username', type: 'text', placeholder: 'RahulSharma' },
            { field: 'phone',    label: 'Phone Number (WhatsApp)', type: 'tel', placeholder: '9876543210' },
            { field: 'password', label: 'Password', type: 'password', placeholder: '6+ characters' },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field} style={styles.group}>
              <label style={styles.label}>{label}</label>
              <input
                style={styles.input}
                type={type}
                placeholder={placeholder}
                value={form[field]}
                onChange={set(field)}
              />
            </div>
          ))}

          <button type="submit" style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f7f9f9',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: '#fff',
    border: '1px solid #eff3f4',
    borderRadius: 16,
    padding: '40px 36px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  logo: {
    width: 48,
    height: 48,
    background: '#e8f5fe',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: 800, color: '#0f1419', marginBottom: 6 },
  sub: { fontSize: 14, color: '#536471', marginBottom: 28 },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    marginBottom: 18,
  },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  group: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: '#536471' },
  input: {
    padding: '11px 14px',
    border: '1px solid #eff3f4',
    borderRadius: 10,
    fontSize: 14,
    color: '#0f1419',
    background: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
  },
  btn: {
    marginTop: 4,
    background: '#1d9bf0',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '12px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  footer: { textAlign: 'center', marginTop: 24, fontSize: 14, color: '#536471' },
  link: { color: '#1d9bf0', fontWeight: 600, textDecoration: 'none' },
};
