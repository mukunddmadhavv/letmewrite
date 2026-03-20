export default function SkeletonLoader({ count = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 10 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 14, width: '55%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 11, width: '30%' }} />
            </div>
            <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 999 }} />
          </div>
          <div className="skeleton" style={{ height: 1, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 24 }}>
            {[70, 60, 90].map((w, j) => (
              <div key={j}>
                <div className="skeleton" style={{ height: 10, width: w / 2, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 13, width: w }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
