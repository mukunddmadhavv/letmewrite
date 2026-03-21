import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../services/auth';
import { uploadFile, getUserFiles } from '../services/files';
import { UploadCloud, LogOut, FileText, Clock, Printer, Truck, CheckCircle, RefreshCw } from 'lucide-react';

const STATUS_CONFIG = {
  'Pending':          { label: 'Pending',          color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   icon: Clock },
  'Printing':         { label: 'Printing',          color: '#1d9bf0', bg: 'rgba(29,155,240,0.1)',   icon: Printer },
  'Out for Delivery': { label: 'Out for Delivery',  color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',   icon: Truck },
  'Delivered':        { label: 'Delivered',         color: '#10b981', bg: 'rgba(16,185,129,0.1)',   icon: CheckCircle },
};

function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  const Icon = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 999,
      fontSize: 12, fontWeight: 600,
      color: cfg.color, background: cfg.bg,
    }}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function FileCard({ file }) {
  const date = new Date(file.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
  const size = (file.size / 1024).toFixed(1);
  return (
    <div style={s.fileCard}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={s.fileIcon}><FileText size={20} color="#1d9bf0" /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={s.fileName} title={file.originalName}>{file.originalName}</div>
          <div style={s.fileMeta}>{size} KB · {date}</div>
        </div>
        <StatusPill status={file.status} />
      </div>
    </div>
  );
}

export default function Dashboard({ session, setSession }) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const username = session?.user?.username || 'Student';

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    const { data } = await getUserFiles();
    setFiles(data || []);
    setLoading(false);
  };

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    const { data, error } = await uploadFile(file);
    setUploading(false);
    if (error) { setUploadError(error.message || 'Upload failed'); return; }
    setFiles(prev => [data, ...prev]);
  };

  const onFileChange = (e) => handleFile(e.target.files[0]);
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSignOut = async () => {
    await signOut();
    setSession(null);
    navigate('/');
  };

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <span style={{ fontSize: 18, fontWeight: 900, color: '#1d9bf0' }}>LetMeWrite</span>
          <span style={{ fontSize: 11, color: '#536471', marginTop: 2 }}>.in</span>
        </div>
        <nav style={s.nav}>
          {[
            { label: 'My Files', active: true },
            { label: 'Track Orders', active: false },
          ].map(item => (
            <div key={item.label} style={{ ...s.navItem, ...(item.active ? s.navActive : {}) }}>
              <FileText size={16} />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <button onClick={handleSignOut} style={s.signOut}>
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.greeting}>Good day, {username} 👋</h1>
            <p style={s.greetingSub}>Upload your assignment files and track their delivery status.</p>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            style={s.uploadBtn}
            disabled={uploading}
          >
            <UploadCloud size={16} />
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
          <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={onFileChange}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt" />
        </div>

        {/* Upload Error */}
        {uploadError && (
          <div style={s.errorBox}>{uploadError}</div>
        )}

        {/* Drop Zone */}
        <div
          style={{ ...s.dropzone, ...(dragOver ? s.dropzoneActive : {}) }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
        >
          <UploadCloud size={32} color={dragOver ? '#1d9bf0' : '#8b98a5'} />
          <p style={{ marginTop: 10, fontSize: 14, color: dragOver ? '#1d9bf0' : '#536471', fontWeight: 500 }}>
            {uploading ? 'Uploading...' : 'Drag & drop or click to upload'}
          </p>
          <p style={{ fontSize: 12, color: '#8b98a5', marginTop: 4 }}>PDF, Word, Images up to 10MB</p>
        </div>

        {/* Files List */}
        <div style={s.section}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={s.sectionTitle}>My Files ({files.length})</h2>
            <button onClick={loadFiles} style={s.refreshBtn} title="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ ...s.fileCard, height: 70, background: 'linear-gradient(90deg, #f7f9f9 25%, #eff3f4 50%, #f7f9f9 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.5s infinite' }} />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div style={s.emptyState}>
              <FileText size={40} color="#cfd9de" />
              <p style={{ marginTop: 12, fontSize: 14, color: '#8b98a5' }}>No files uploaded yet</p>
              <p style={{ fontSize: 13, color: '#b0bec5' }}>Click "Upload File" to get started</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {files.map(file => <FileCard key={file.id} file={file} />)}
            </div>
          )}
        </div>

        {/* Status Legend */}
        <div style={s.legend}>
          <p style={{ fontSize: 12, color: '#8b98a5', fontWeight: 600, marginBottom: 8 }}>STATUS GUIDE</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.keys(STATUS_CONFIG).map(status => (
              <StatusPill key={status} status={status} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

const s = {
  page: { display: 'flex', minHeight: '100vh', background: '#f7f9f9', fontFamily: "'Inter', system-ui, sans-serif" },
  sidebar: {
    width: 220, background: '#fff', borderRight: '1px solid #eff3f4',
    display: 'flex', flexDirection: 'column', padding: '24px 16px', flexShrink: 0,
  },
  sidebarLogo: { display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 32, paddingLeft: 8 },
  nav: { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 12px', borderRadius: 10, fontSize: 14,
    color: '#536471', cursor: 'pointer', fontWeight: 500,
  },
  navActive: { background: '#e8f5fe', color: '#1d9bf0', fontWeight: 700 },
  signOut: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 12px', borderRadius: 10, fontSize: 14,
    color: '#f4212e', cursor: 'pointer', border: 'none',
    background: 'none', fontFamily: 'inherit', fontWeight: 500,
    marginTop: 8,
  },
  main: { flex: 1, padding: '32px 28px', maxWidth: 860, margin: '0 auto', width: '100%' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24, flexWrap: 'wrap', gap: 12,
  },
  greeting: { fontSize: 22, fontWeight: 800, color: '#0f1419', marginBottom: 4 },
  greetingSub: { fontSize: 14, color: '#536471' },
  uploadBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#1d9bf0', color: '#fff', border: 'none',
    padding: '10px 18px', borderRadius: 10, fontSize: 14, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca',
    color: '#dc2626', borderRadius: 10, padding: '10px 14px',
    fontSize: 13, marginBottom: 16,
  },
  dropzone: {
    border: '2px dashed #cfd9de', borderRadius: 14,
    padding: '40px 24px', textAlign: 'center',
    cursor: 'pointer', transition: 'all 0.2s', background: '#fff',
    marginBottom: 24,
  },
  dropzoneActive: { borderColor: '#1d9bf0', background: '#e8f5fe' },
  section: { background: '#fff', border: '1px solid #eff3f4', borderRadius: 14, padding: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: '#0f1419' },
  refreshBtn: {
    background: 'none', border: '1px solid #eff3f4', borderRadius: 8,
    padding: '6px 8px', cursor: 'pointer', color: '#536471',
    display: 'flex', alignItems: 'center',
  },
  fileCard: {
    padding: '14px 16px',
    border: '1px solid #eff3f4',
    borderRadius: 10,
    background: '#fff',
    transition: 'box-shadow 0.2s, border-color 0.2s',
  },
  fileIcon: {
    width: 40, height: 40, background: '#e8f5fe', borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  fileName: { fontSize: 14, fontWeight: 600, color: '#0f1419', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  fileMeta: { fontSize: 12, color: '#8b98a5', marginTop: 2 },
  emptyState: { textAlign: 'center', padding: '48px 24px', color: '#8b98a5' },
  legend: { background: '#fff', border: '1px solid #eff3f4', borderRadius: 14, padding: '16px 20px' },
};
