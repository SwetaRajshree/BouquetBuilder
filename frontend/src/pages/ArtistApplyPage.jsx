import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const CATEGORIES = [
  'Handloom & Weaving', 'Paintings & Fine Art', 'Pottery & Ceramics',
  'Wooden Sculpting', 'Stone Art', 'Embroidery & Spotri',
  'Jewellery & Accessories', 'Leather Craft', 'Bamboo & Cane Work',
  'Terracotta', 'Block Printing', 'Other',
];

const EXPERIENCE = ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years'];
const PRICE_RANGES = ['₹100–₹500', '₹500–₹2,000', '₹2,000–₹10,000', '₹10,000–₹50,000', '₹50,000+'];

const STEPS = [
  { icon: '👤', label: 'Personal Info' },
  { icon: '🎨', label: 'Your Craft' },
  { icon: '📦', label: 'Products' },
  { icon: '✅', label: 'Submit' },
];

const PERKS = [
  { icon: '🌍', title: 'Global Reach', desc: 'Sell to customers across India and worldwide' },
  { icon: '💰', title: 'Keep 85%', desc: 'You set your price and keep most of the earnings' },
  { icon: '📦', title: 'We Handle Logistics', desc: 'Packaging, shipping and returns managed for you' },
  { icon: '📣', title: 'Marketing Support', desc: 'We promote your work on social media and campaigns' },
  { icon: '🛡️', title: 'Secure Payments', desc: 'Get paid on time, every time — no delays' },
  { icon: '🤝', title: 'Dedicated Support', desc: 'A personal account manager to help you grow' },
];

function FloatingPetal({ style }) {
  return (
    <div style={{
      position: 'absolute', width: 12, height: 18, borderRadius: '60% 40% 60% 40%',
      background: 'rgba(201,116,138,0.18)', pointerEvents: 'none', ...style,
    }} />
  );
}

function StepIndicator({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, transition: 'all 0.4s ease',
              background: i < current ? 'linear-gradient(135deg,#c9748a,#a85570)' : i === current ? 'linear-gradient(135deg,#c9748a,#e8b4c0)' : 'rgba(255,255,255,0.6)',
              color: i <= current ? 'white' : '#9b7b8a',
              boxShadow: i === current ? '0 4px 20px rgba(201,116,138,0.5)' : 'none',
              border: i < current ? 'none' : i === current ? '2px solid #c9748a' : '2px solid #e8c4cd',
              transform: i === current ? 'scale(1.15)' : 'scale(1)',
            }}>
              {i < current ? '✓' : s.icon}
            </div>
            <span style={{ fontSize: 10, color: i === current ? '#a85570' : '#9b7b8a', fontWeight: i === current ? 700 : 400, whiteSpace: 'nowrap' }}>{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: 48, height: 2, margin: '0 4px', marginBottom: 22, background: i < current ? 'linear-gradient(90deg,#c9748a,#a85570)' : '#e8c4cd', transition: 'background 0.4s' }} />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({ label, required, children, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#6b4a5a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}{required && <span style={{ color: '#c9748a', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: 11, color: '#9b7b8a', fontStyle: 'italic' }}>{hint}</span>}
    </div>
  );
}

const inputStyle = {
  padding: '12px 16px', borderRadius: 12, border: '2px solid #f0d8e0',
  fontSize: 14, color: '#3a2530', outline: 'none', background: 'rgba(255,255,255,0.8)',
  transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
};

export default function ArtistApplyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [petals] = useState(() => Array.from({ length: 14 }, (_, i) => ({
    left: `${5 + Math.random() * 90}%`, top: `${Math.random() * 100}%`,
    animDur: `${8 + Math.random() * 10}s`, animDelay: `${-Math.random() * 15}s`,
    size: 8 + Math.random() * 10,
  })));

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', location: '',
    craftCategory: '', experience: '', description: '',
    priceRange: '', instagram: '', website: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 0) return form.fullName && form.email && form.phone && form.location;
    if (step === 1) return form.craftCategory && form.experience && form.description;
    if (step === 2) return true;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API}/api/artist-applications`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally { setSubmitting(false); }
  };

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#fdf0f3,#faeaef,#f0e8f8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 480, animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}`}</style>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🌸</div>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 32, color: '#a85570', marginBottom: 12 }}>Application Received!</h2>
        <p style={{ color: '#6b4a5a', fontSize: 16, lineHeight: 1.7, marginBottom: 8 }}>
          Thank you, <strong>{form.fullName}</strong>! We've received your application and our team will review it carefully.
        </p>
        <p style={{ color: '#9b7b8a', fontSize: 14, marginBottom: 32 }}>
          We'll get back to you at <strong>{form.email}</strong> within 3–5 business days. 💌
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/handcraft')} style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#c9748a,#a85570)', color: 'white', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            ← Back to Handcraft
          </button>
          <button onClick={() => navigate('/')} style={{ padding: '12px 28px', background: 'white', color: '#a85570', border: '2px solid #e8c4cd', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Go Home
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#fdf0f3 0%,#faeaef 50%,#f0e8f8 100%)', fontFamily: "'DM Sans',sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes floatPetal{0%{transform:translateY(0) rotate(0deg);opacity:0}8%{opacity:1}92%{opacity:0.5}100%{transform:translateY(-100vh) rotate(540deg);opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        input:focus,textarea:focus,select:focus{border-color:#c9748a !important;box-shadow:0 0 0 3px rgba(201,116,138,0.15) !important}
      `}</style>

      {/* Floating petals */}
      {petals.map((p, i) => (
        <div key={i} style={{ position: 'fixed', left: p.left, bottom: '-20px', animation: `floatPetal ${p.animDur} ${p.animDelay} linear infinite`, pointerEvents: 'none', zIndex: 0 }}>
          <FloatingPetal style={{ width: p.size, height: p.size * 1.4 }} />
        </div>
      ))}

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10, background: 'rgba(253,240,243,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(201,116,138,0.15)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/handcraft')} style={{ background: 'none', border: '1.5px solid #e8c4cd', borderRadius: 10, padding: '6px 14px', cursor: 'pointer', color: '#a85570', fontSize: 13, fontWeight: 600 }}>← Back</button>
        <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 700, color: '#a85570' }}>🌸 ArtisanWorld — Sell With Us</div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 52, animation: 'fadeUp 0.6s ease' }}>
          <div style={{ display: 'inline-block', background: 'rgba(201,116,138,0.12)', border: '1px solid rgba(201,116,138,0.3)', borderRadius: 100, padding: '6px 20px', fontSize: 12, fontWeight: 700, color: '#a85570', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            🎨 Join Our Artisan Community
          </div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 700, color: '#3a2530', lineHeight: 1.15, marginBottom: 16 }}>
            Turn Your Craft Into<br />
            <span style={{ background: 'linear-gradient(135deg,#c9748a,#a85570)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>a Livelihood</span>
          </h1>
          <p style={{ color: '#6b4a5a', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
            Join thousands of artisans already selling on ArtisanWorld. Fill in a few details and we'll get back to you within 3–5 days.
          </p>
        </div>

        {/* Perks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16, marginBottom: 52, animation: 'fadeUp 0.7s 0.1s ease both' }}>
          {PERKS.map((p, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: 16, padding: '18px 20px', border: '1.5px solid rgba(201,116,138,0.15)', display: 'flex', gap: 14, alignItems: 'flex-start', transition: 'transform 0.2s,box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(201,116,138,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <div style={{ fontSize: 26, flexShrink: 0 }}>{p.icon}</div>
              <div>
                <div style={{ fontWeight: 700, color: '#3a2530', fontSize: 14, marginBottom: 4 }}>{p.title}</div>
                <div style={{ color: '#9b7b8a', fontSize: 12, lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form card */}
        <div style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)', borderRadius: 28, padding: 'clamp(24px,5vw,48px)', border: '1.5px solid rgba(201,116,138,0.2)', boxShadow: '0 20px 60px rgba(201,116,138,0.12)', animation: 'fadeUp 0.8s 0.2s ease both' }}>

          <StepIndicator current={step} />

          {/* Step 0 — Personal Info */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s ease' }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#3a2530', margin: 0 }}>👤 Tell us about yourself</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Full Name" required>
                  <input style={inputStyle} placeholder="e.g. Rekha Devi" value={form.fullName} onChange={e => set('fullName', e.target.value)} />
                </Field>
                <Field label="Email Address" required>
                  <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </Field>
                <Field label="Phone Number" required>
                  <input style={inputStyle} placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </Field>
                <Field label="City / State" required>
                  <input style={inputStyle} placeholder="e.g. Varanasi, Uttar Pradesh" value={form.location} onChange={e => set('location', e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {/* Step 1 — Craft Details */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s ease' }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#3a2530', margin: 0 }}>🎨 About your craft</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Craft Category" required>
                  <select style={inputStyle} value={form.craftCategory} onChange={e => set('craftCategory', e.target.value)}>
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Years of Experience" required>
                  <select style={inputStyle} value={form.experience} onChange={e => set('experience', e.target.value)}>
                    <option value="">Select experience</option>
                    {EXPERIENCE.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Describe your work" required hint="Tell us what you make, your techniques, materials, and what makes your craft unique.">
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }} placeholder="I create hand-woven Banarasi silk sarees using traditional pit loom techniques passed down through generations..." value={form.description} onChange={e => set('description', e.target.value)} />
              </Field>
            </div>
          )}

          {/* Step 2 — Products & Links */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s ease' }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: '#3a2530', margin: 0 }}>📦 Products & Online Presence</h3>
              <Field label="Typical Price Range" hint="What price range do most of your products fall in?">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {PRICE_RANGES.map(p => (
                    <button key={p} type="button" onClick={() => set('priceRange', p)} style={{ padding: '8px 18px', borderRadius: 50, border: `2px solid ${form.priceRange === p ? '#c9748a' : '#e8c4cd'}`, background: form.priceRange === p ? 'linear-gradient(135deg,#c9748a,#a85570)' : 'white', color: form.priceRange === p ? 'white' : '#6b4a5a', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Instagram Handle" hint="Optional — helps us feature your work">
                  <input style={inputStyle} placeholder="@your_handle" value={form.instagram} onChange={e => set('instagram', e.target.value)} />
                </Field>
                <Field label="Website / Portfolio" hint="Optional — any existing online presence">
                  <input style={inputStyle} placeholder="https://yourshop.com" value={form.website} onChange={e => set('website', e.target.value)} />
                </Field>
              </div>
              {/* Summary card */}
              <div style={{ background: 'linear-gradient(135deg,#fdf0f3,#f0e8f8)', borderRadius: 16, padding: '20px 24px', border: '1.5px solid rgba(201,116,138,0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#a85570', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>📋 Your Application Summary</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[['Name', form.fullName], ['Email', form.email], ['Phone', form.phone], ['Location', form.location], ['Category', form.craftCategory], ['Experience', form.experience]].map(([k, v]) => (
                    <div key={k} style={{ fontSize: 13 }}>
                      <span style={{ color: '#9b7b8a' }}>{k}: </span>
                      <span style={{ color: '#3a2530', fontWeight: 600 }}>{v || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          {error && <p style={{ color: '#c0392b', fontSize: 13, marginTop: 8 }}>⚠️ {error}</p>}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
            <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/handcraft')}
              style={{ padding: '12px 24px', background: 'white', border: '2px solid #e8c4cd', borderRadius: 50, color: '#a85570', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              ← {step === 0 ? 'Back' : 'Previous'}
            </button>

            {step < 2 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                style={{ padding: '12px 32px', background: canNext() ? 'linear-gradient(135deg,#c9748a,#a85570)' : '#e8c4cd', color: 'white', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 700, cursor: canNext() ? 'pointer' : 'not-allowed', boxShadow: canNext() ? '0 6px 20px rgba(201,116,138,0.4)' : 'none', transition: 'all 0.2s' }}>
                Next Step →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}
                style={{ padding: '14px 36px', background: submitting ? '#e8c4cd' : 'linear-gradient(135deg,#c9748a,#a85570)', color: 'white', border: 'none', borderRadius: 50, fontSize: 15, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer', boxShadow: '0 6px 24px rgba(201,116,138,0.45)', transition: 'all 0.2s', animation: !submitting ? 'pulse 2s ease-in-out infinite' : 'none' }}>
                {submitting ? '🌸 Submitting...' : '🚀 Submit Application'}
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 24, height: 4, background: '#f0d8e0', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((step + 1) / STEPS.length) * 100}%`, background: 'linear-gradient(90deg,#c9748a,#a85570)', borderRadius: 2, transition: 'width 0.4s ease' }} />
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#9b7b8a', marginTop: 8 }}>Step {step + 1} of {STEPS.length}</p>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 40, flexWrap: 'wrap', animation: 'fadeUp 0.9s 0.3s ease both' }}>
          {[['🔒', 'Secure & Private'], ['✅', '500+ Artisans'], ['⭐', '4.9 Avg Rating'], ['🚀', 'Quick Onboarding']].map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9b7b8a', fontSize: 13, fontWeight: 600 }}>
              <span style={{ fontSize: 18 }}>{icon}</span>{label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
