import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from '../services/auth';
import { createOrder, getUserOrders } from '../services/orders';
import { UploadCloud, FileText, CheckCircle2, Clock, Send, X, Package, Hash, AlertCircle, LogOut, PenLine, MessageCircle, ChevronDown } from 'lucide-react';

const RATE = 10;
const WHATSAPP_NUMBER = '916386660600';

const subjects = [
  'Engineering', 'Law', 'Management / MBA', 'Commerce / Finance',
  'Science', 'Arts / Humanities', 'Medical', 'Computer Science', 'Other',
];

const generateOrderId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'LMW-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function OrderForm({ session }) {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ 
    name: session?.user?.username || session?.user?.user_metadata?.name || '',
    phone: session?.user?.phone || session?.user?.user_metadata?.phone || '',
    email: session?.user?.email || '',
    title: '', 
    subject: '', 
    pages: 5, 
    deadline: '', 
    instructions: '' 
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const fileRef = useRef();

  const statusMap = { 'pending': 0, 'confirmed': 1, 'written': 2, 'delivered': 3 };
  const timelineSteps = [
    { label: 'Pending', color: '#ffd400' },
    { label: 'Confirmed', color: '#1d9bf0' },
    { label: 'Written', color: '#8b5cf6' },
    { label: 'Delivered', color: '#00ba7c' },
  ];

  const total = form.pages * RATE;
  const minDate = new Date(Date.now() + 6 * 3600 * 1000).toISOString().slice(0, 16);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await getUserOrders();
      if (data && data.length > 0) {
        setOrders(data);
        setExpandedOrderId(data[0].id);
      }
    };
    fetchOrders();
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleFile = (file) => {
    if (!file) return;
    setFiles(prev => [...prev, file]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const uploadToCloudinary = async (file) => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error('Cloudinary not configured. Please add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error.message || 'Upload failed');
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.title || !form.subject || !form.pages || !form.deadline) {
      setError('Please fill in all required fields.'); 
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      // 1. Upload files to Cloudinary if any
      const uploadedFileUrls = [];
      if (files.length > 0) {
        for (const file of files) {
          const url = await uploadToCloudinary(file);
          uploadedFileUrls.push({ name: file.name, url });
        }
      }

      // 2. Generate WhatsApp Order ID
      const orderId = generateOrderId();
      
      // 3. Save order to DataBase matching existing schema
      const { data: dbOrder, error: dbError } = await createOrder({
        title: form.title,
        subject: form.subject,
        pages: Number(form.pages),
        deadline: new Date(form.deadline),
        instructions: form.instructions || '',
      });

      if (dbError) {
        throw new Error(dbError.message || 'Failed to save order to database.');
      } else {
        setOrders(prev => [dbOrder, ...prev]);
        setExpandedOrderId(dbOrder.id);
      }

      // 4. Create WhatsApp message format
      const messageLines = [
        `*New Order Request*`,
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        `Email: ${form.email || 'N/A'}`,
        `Order ID: ${orderId} (DB: ${dbOrder?.id || 'New'})`,
        ``,
        `*Order Details*`,
        `Title: ${form.title}`,
        `Subject: ${form.subject}`,
        `Pages: ${form.pages} (₹${form.pages * RATE})`,
        `Deadline: ${new Date(form.deadline).toLocaleString('en-IN')}`,
        `Instructions: ${form.instructions || 'None'}`
      ];

      if (uploadedFileUrls.length > 0) {
        messageLines.push(``);
        messageLines.push(`*Attachments (${uploadedFileUrls.length})*`);
        uploadedFileUrls.forEach(f => {
          messageLines.push(`- ${f.name}: ${f.url}`);
        });
      }

      const encodedMessage = encodeURIComponent(messageLines.join('\n'));
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      // 5. Show success message briefly before redirect
      setSuccess(true);
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        setLoading(false);
      }, 1500);

    } catch (err) {
      setError(err.message || 'An error occurred during submission.');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .order-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .order-sidebar {
          width: 320px;
          height: 100%;
          overflow-y: auto;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border-right: 1px solid var(--border);
          padding: 32px 24px;
          z-index: 10;
        }
        .order-main {
          flex: 1;
          padding: 48px 40px;
          overflow-y: auto;
          z-index: 1;
        }
        .order-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 800px) {
          .order-layout {
            flex-direction: column;
            overflow: auto;
            height: auto;
            min-height: 100vh;
          }
          .order-sidebar {
            width: 100%;
            height: auto;
            overflow-y: visible;
            border-right: none;
            border-bottom: 1px solid var(--border);
            padding: 24px 20px;
            position: relative;
          }
          .order-main {
            padding: 32px 20px;
            overflow-y: visible;
          }
          .order-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="order-layout" style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(29, 155, 240, 0.15) 0%, transparent 60%), var(--bg-secondary)', position: 'relative', fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Background decorations */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 2, height: 2,
            background: 'var(--accent)',
            borderRadius: '50%',
            top: `${15 + i * 13}%`,
            left: `${8 + i * 15}%`,
            opacity: 0.3 + i * 0.05,
            animation: `float ${2 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>

      {/* ── LEFT SIDEBAR ───────────────────────────────────── */}
      <aside className="order-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Logo matching Landing Page */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, textDecoration: 'none' }}>
          <div style={{
            background: 'var(--accent)', borderRadius: 8,
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PenLine size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            LetMe<span style={{ color: 'var(--accent)' }}>Write</span>
          </span>
        </Link>

        {/* Track Order Section */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
            Track Order
          </h2>
          
          {orders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const currentStatusRaw = (order.status || 'pending').toLowerCase();
                const currentIndex = statusMap[currentStatusRaw] ?? 0;
                const currentStatusColor = timelineSteps[currentIndex]?.color || '#ffd400';

                return (
                  <div 
                    key={order.id}
                    className="card" 
                    style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s' }}
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <Package size={20} color="var(--accent)" />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{order.title || 'Assignment Order'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Created {new Date(order.createdAt || Date.now()).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Hash size={14} color="var(--text-muted)" />
                        <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'monospace' }}>LMW-{order.id}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, background: currentStatusColor, borderRadius: '50%', boxShadow: `0 0 8px ${currentStatusColor}66` }}></span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: currentStatusColor, textTransform: 'capitalize' }}>{order.status || 'Pending'}</span>
                      </div>
                      <ChevronDown size={18} color="var(--text-muted)" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                    </div>
                    
                    {/* Timeline Dropdown */}
                    <div style={{
                      maxHeight: isExpanded ? 400 : 0,
                      opacity: isExpanded ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      marginTop: isExpanded ? 20 : 0
                    }}>
                      <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Order Timeline</div>
                        
                        <div style={{ position: 'relative', paddingLeft: 12 }}>
                          {timelineSteps.map((stepInfo, idx) => {
                            const isCompleted = idx <= currentIndex;
                            const isCurrent = idx === currentIndex;
                            const isLast = idx === timelineSteps.length - 1;
                            const stepColor = stepInfo.color;
                            
                            return (
                              <div key={stepInfo.label} style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1, marginBottom: isLast ? 0 : 20, opacity: isCompleted ? 1 : 0.4 }}>
                                {!isLast && (
                                  <div style={{ position: 'absolute', left: 4, top: 18, bottom: -12, width: 2, background: 'var(--border)', zIndex: -1 }}></div>
                                )}
                                <div style={{ 
                                  width: 10, height: 10, borderRadius: '50%', background: isCompleted ? stepColor : 'var(--bg-card)',
                                  border: `2px solid ${isCompleted ? stepColor : 'var(--border)'}`, 
                                  marginTop: 5,
                                  boxShadow: isCurrent ? `0 0 0 4px ${stepColor}33` : 'none',
                                  transition: 'all 0.3s'
                                }}></div>
                                <div>
                                  <div style={{ fontSize: 14, fontWeight: isCurrent ? 700 : 600, color: isCompleted ? stepColor : 'var(--text-muted)' }}>{stepInfo.label}</div>
                                  {isCurrent && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>We are currently working on this step.</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card" style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Clock size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>No active orders</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Place an order to start tracking</p>
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, padding: '16px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Note:</strong> Future updates and timelines for your order will be reflected right here. For more details, talk to us directly.
            </p>
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`} 
              target="_blank" 
              rel="noreferrer"
              className="btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: '#fff', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', width: '100%' }}
            >
              <MessageCircle size={18} /> WhatsApp Support
            </a>
          </div>
        </div>

        {/* User Profile */}
        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', items: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, background: 'var(--accent-subtle)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent)' }}>
              {form.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{form.name || 'User'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{form.phone || 'Welcome'}</div>
            </div>
          </div>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger)', fontSize: 14, fontWeight: 600, padding: '8px 0', background: 'none', transition: 'opacity 0.2s', ':hover': { opacity: 0.8 } }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <main className="order-main">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 8 }}>Create New Order</h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Fill out the details below and proceed to WhatsApp to confirm.</p>
          </div>

          {error && (
            <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', borderRadius: 12, background: 'var(--destructive)', color: '#fff', marginBottom: 24, fontSize: 14, fontWeight: 500 }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {success && (
            <div className="slide-up" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderRadius: 12, background: '#25D366', color: '#fff', marginBottom: 24, fontSize: 15, fontWeight: 600, border: '1px solid rgba(0,0,0,0.1)' }}>
              <CheckCircle2 size={20} /> Order created successfully! Redirecting to WhatsApp...
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* User Details (Pre-filled) */}
            <div className="card" style={{ padding: 28, border: '1px solid var(--border)', borderRadius: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>Contact Details</h2>
              <div className="order-grid">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Name *</label>
                  <input type="text" value={form.name} onChange={set('name')} className="form-input" placeholder="Rahul Sharma" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Phone No. *</label>
                  <input type="tel" value={form.phone} onChange={set('phone')} className="form-input" placeholder="9876543210" />
                </div>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="card" style={{ padding: 28, border: '1px solid var(--border)', borderRadius: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>Assignment Information</h2>
              
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">Title / Topic *</label>
                <input type="text" placeholder="e.g. Marketing Case Study on Apple Inc."
                  value={form.title} onChange={set('title')} className="form-input" />
              </div>

              <div className="order-grid" style={{ marginBottom: 20 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Subject *</label>
                  <select value={form.subject} onChange={set('subject')} className="form-input">
                    <option value="">Select subject…</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Number of Pages *</label>
                  <input
                    type="number" min={1} max={200}
                    value={form.pages}
                    onChange={e => setForm({ ...form, pages: Math.max(1, Number(e.target.value)) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">Deadline *</label>
                <input type="datetime-local" min={minDate}
                  value={form.deadline} onChange={set('deadline')} className="form-input" />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Reference / Instructions</label>
                <textarea
                  placeholder="Any specific formatting, guidelines, or points to cover..."
                  value={form.instructions} onChange={set('instructions')}
                  className="form-input" style={{ minHeight: 100 }}
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div className="card" style={{ padding: 28, border: '1px solid var(--border)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Reference Files</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-subtle)', padding: '4px 10px', borderRadius: 999 }}>
                  <UploadCloud size={14} /> Cloudinary Sync
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Attach documents to automatically upload and include their links in the WhatsApp message.</p>
              
              <div
                style={{
                  border: '2px dashed #cfd9de', borderRadius: 14, padding: '32px 24px', textAlign: 'center',
                  cursor: 'pointer', transition: 'all 0.3s', background: dragOver ? 'var(--accent-subtle)' : 'rgba(255, 255, 255, 0.5)',
                  borderColor: dragOver ? 'var(--accent)' : '#cfd9de', marginBottom: files.length > 0 ? 20 : 0
                }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) Array.from(e.dataTransfer.files).forEach(handleFile); }}
                onClick={() => fileRef.current?.click()}
              >
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: dragOver ? 'var(--accent)' : 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', transition: 'all 0.3s' }}>
                  <UploadCloud size={24} color={dragOver ? '#fff' : 'var(--accent)'} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Click to upload or drag & drop</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>PDF, DOCX, JPG, PNG up to 10MB</p>
                <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={(e) => { if (e.target.files.length) Array.from(e.target.files).forEach(handleFile); e.target.value = null; }} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt" multiple />
              </div>

              {files.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {files.map((file, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', flexShrink: 0 }}>
                          <FileText size={16} color="var(--accent)" />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{file.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeFile(idx)} style={{ padding: 6, borderRadius: 8, background: '#fff', border: '1px solid var(--border)', color: 'var(--text-muted)', transition: 'all 0.2s', ':hover': { color: 'var(--danger)', borderColor: 'var(--danger)' } }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <div style={{ fontSize: 13, color: 'var(--success)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                    <CheckCircle2 size={16} /> These files will be uploaded and linked automatically.
                  </div>
                </div>
              )}
            </div>

            {/* Total & Submit */}
            <div className="card" style={{ padding: 32, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
                <div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 500 }}>Total Amount</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    ₹{total.toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {form.pages} page(s) at ₹{RATE}/page
                </div>
              </div>

              <button
                type="submit"
                className="btn"
                style={{ 
                  width: '100%', justifyContent: 'center', background: '#25D366', color: '#fff', 
                  padding: '18px', borderRadius: 14, fontSize: 16, fontWeight: 700, 
                  boxShadow: '0 8px 24px rgba(37, 211, 102, 0.25)', transition: 'all 0.2s',
                  opacity: loading || success ? 0.7 : 1, cursor: loading || success ? 'not-allowed' : 'pointer',
                  transform: (loading || success) ? 'none' : 'translateY(0)'
                }}
                disabled={loading || success}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {loading || success ? `Processing${files.length > 0 ? ' uploads' : ''}...` : (
                  <><Send size={18} /> Confirm Order on WhatsApp</>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </main>
    </div>
    </>
  );
}
