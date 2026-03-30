import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import PricingCalculator from '../components/PricingCalculator';
import {
  ArrowRight, CheckCircle2, Upload, FileText, Download,
  Star, ChevronDown, ChevronUp, Sparkles, Shield, Zap, Clock
} from 'lucide-react';

const steps = [
  { icon: Upload, title: 'Submit', desc: 'Fill in your assignment details — subject, pages, deadline, and any special instructions.' },
  { icon: FileText, title: 'We Write', desc: 'Our expert writers craft your assignment with proper research, formatting, and citations.' },
  { icon: Download, title: 'You Download', desc: 'Review your completed assignment and download it. Free revisions if needed.' },
];

const faqs = [
  { q: 'Is this plagiarism-free?', a: 'Yes. Every assignment is written from scratch and passes standard plagiarism checks.' },
  { q: 'How fast can I get my assignment?', a: 'We offer delivery in less 24-48 hours.' },
  { q: 'What subjects are covered?', a: 'Engineering, Law, Management, Science, Arts, Commerce — all major streams.' },
  { q: 'Can I request revisions?', a: 'No,you cannot' },
  { q: 'How do I pay?', a: 'UPI, Net Banking, or card payment. 100% secure checkout.' },
];

const features = [
  { icon: Shield, title: 'Plagiarism-Free', desc: 'Every assignment verified clean.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Express delivery in 6–24 hours.' },
  { icon: Clock, title: 'On-Time Delivery', desc: 'Never miss a deadline again.' },
];

export default function LandingPage({ session }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      <Navbar session={session} />

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{
        minHeight: '90vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        background: 'radial-gradient(ellipse at 50% -10%, rgba(29, 155, 240, 0.15) 0%, transparent 60%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decorations */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
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

        <div style={{ maxWidth: 720, animation: 'slideUp 0.6s ease' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--accent-subtle)',
            border: '1px solid rgba(124,92,252,0.25)',
            borderRadius: 999, padding: '6px 14px',
            fontSize: 13, fontWeight: 600, color: 'var(--accent)',
            marginBottom: 28,
          }}>
            <Sparkles size={13} />
            From MAIT, To MAIT
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            marginBottom: 20,
          }}>
            We Write.
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #1d9bf0, #1a8cd8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>You Score.</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Get high-quality assignments at just <strong style={{ color: 'var(--text-primary)' }}>₹15 per page</strong>. Submit your brief, we handle the rest.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {session ? (
              <Link to="/order" className="btn btn-primary btn-lg" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
                Place an Order
                <ArrowRight size={18} />
              </Link>
            ) : (
              <Link to="/signup" className="btn btn-primary btn-lg" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
                Get Started Free
                <ArrowRight size={18} />
              </Link>
            )}
            <a href="#how-it-works" className="btn btn-outline btn-lg">
              How It Works
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {['✅ Plagiarism-Free', '⚡ 24-48 Hr Delivery', '🔁 Free Revisions', '₹10 / Page'].map(t => (
              <span key={t} style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionHeader label="Process" title="Simple as 1–2–3" subtitle="From brief to final draft in under 24 hours." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 48 }}>
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="card" style={{ padding: 32, textAlign: 'center', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: -14, left: 24,
                  background: 'var(--accent)', color: '#fff',
                  width: 28, height: 28, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                }}>
                  {i + 1}
                </div>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Icon size={26} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="card" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color="var(--accent)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────── */}
      <section id="pricing" style={{ padding: '100px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionHeader label="Pricing" title="Honest. Flat. Affordable." subtitle="No subscriptions. No hidden fees. Pay only for what you need." />

          <div style={{ maxWidth: 600, margin: '48px auto 0', padding: 40, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 8 }}>
                ₹10<span style={{ fontSize: 20, fontWeight: 400, color: 'var(--text-secondary)' }}>/page</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>1 page = 250–300 words. All subjects. All levels.</p>
            </div>

            <div className="divider" />
            <PricingCalculator />
            <div className="divider" />

            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
              {['Expert writers', 'Plagiarism-free guarantee', 'Free unlimited revisions', 'On-time delivery', '24/7 support'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={16} color="var(--success)" />
                  {f}
                </li>
              ))}
            </ul>

            <Link to="/order" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
              Place Your Order Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section id="faq" style={{ padding: '100px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <SectionHeader label="FAQ" title="Got Questions?" subtitle="Everything you need to know before ordering." />
          <div style={{ maxWidth: 640, margin: '48px auto 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <button
                  key={i}
                  onClick={() => setOpenFaq(open ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left',
                    background: open ? 'var(--bg-card)' : 'var(--bg-card)',
                    border: `1px solid ${open ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 600, fontSize: 15, color: open ? 'var(--text-primary)' : 'var(--text-primary)' }}>{faq.q}</span>
                    {open ? <ChevronUp size={18} color="var(--accent)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </div>
                  {open && (
                    <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {faq.a}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            textAlign: 'center',
            padding: '60px 40px',
            background: 'linear-gradient(135deg, rgba(29, 155, 240, 0.15) 0%, rgba(29, 155, 240, 0.05) 100%)',
            border: '1px solid rgba(29, 155, 240, 0.1)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16 }}>
              Start for just <span style={{ color: 'var(--accent)' }}>₹10</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 32 }}>
              Join thousands of students who trust LetMeWrite for their assignments.
            </p>
            {session ? (
              <Link to="/order" className="btn btn-primary btn-lg">
                Place an Order
                <ArrowRight size={18} />
              </Link>
            ) : (
              <Link to="/signup" className="btn btn-primary btn-lg">
                Create Free Account
                <ArrowRight size={18} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>
            LetMe<span style={{ color: 'var(--accent)' }}>Write</span>.in
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} LetMeWrite · From MAIT, To MAIT
          </span>
          <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            <a href="#" style={{ color: 'inherit' }}>Privacy</a>
            <a href="#" style={{ color: 'inherit' }}>Terms</a>
            <a href="#" style={{ color: 'inherit' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ label, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>{label}</div>
      <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>{subtitle}</p>}
    </div>
  );
}
