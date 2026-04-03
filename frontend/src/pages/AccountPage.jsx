import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

const TABS = [
  { key: 'profile',   icon: '👤', label: 'My Profile'  },
  { key: 'addresses', icon: '📍', label: 'Addresses'    },
  { key: 'orders',    icon: '📦', label: 'My Orders'    },
  { key: 'wishlist',  icon: '💖', label: 'Wishlist'     },
  { key: 'wallet',    icon: '👛', label: 'Wallet'       },
  { key: 'settings',  icon: '⚙️',  label: 'Settings'    },
  { key: 'contact',   icon: '💬', label: 'Contact Us'   },
];

const STATUS_COLORS = {
  placed:           'bg-blue-100 text-blue-600',
  preparing:        'bg-yellow-100 text-yellow-600',
  out_for_delivery: 'bg-orange-100 text-orange-600',
  delivered:        'bg-green-100 text-green-600',
  cancelled:        'bg-red-100 text-red-500',
};

function Field({ label, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-3 border-2 border-pink-100 rounded-xl px-4 py-3 focus-within:border-pink-400 transition-all bg-pink-50/30">
        <span className="text-pink-300">{icon}</span>
        {children}
      </div>
    </div>
  );
}

// ── Profile ──
function ProfileTab({ token, user, onUserUpdate }) {
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res  = await fetch(`${API}/api/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) { onUserUpdate(data.user); setMsg('✅ Profile updated!'); }
    else setMsg('⚠️ ' + data.message);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-gradient-to-br from-[#ffe8ed] to-[#eadcf7] rounded-2xl p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose to-lavender flex items-center justify-center text-3xl font-bold text-white shadow-soft-m flex-shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-playfair font-bold text-roseDD text-xl">{user?.name}</p>
          <p className="text-sm text-textL">{user?.email}</p>
          <span className="inline-block mt-1 text-[.7rem] font-bold px-2.5 py-0.5 rounded-full bg-white/70 text-roseD border border-blush/30 capitalize">{user?.role}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-soft-s">
        <h3 className="font-playfair font-bold text-roseDD mb-5">Edit Profile</h3>
        <form onSubmit={save} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" icon="👤">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="flex-1 outline-none text-sm bg-transparent text-gray-700" placeholder="Your name" />
            </Field>
            <Field label="Phone Number" icon="📞">
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="flex-1 outline-none text-sm bg-transparent text-gray-700" placeholder="+91 XXXXX XXXXX" />
            </Field>
          </div>
          <Field label="Email (cannot be changed)" icon="✉️">
            <input value={user?.email} disabled className="flex-1 outline-none text-sm bg-transparent text-gray-400 cursor-not-allowed" />
          </Field>
          {msg && <p className="text-xs px-3 py-2 rounded-xl bg-pink-50 text-roseD">{msg}</p>}
          <button type="submit" disabled={saving}
            className="self-start bg-gradient-to-br from-rose to-[#e09099] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:-translate-y-0.5 transition-all disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes 🌸'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-soft-s flex items-center gap-4">
        <span className="text-3xl">🌸</span>
        <div>
          <p className="text-sm font-semibold text-roseDD">Member since</p>
          <p className="text-xs text-textL">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Addresses ──
function AddressesTab({ token }) {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [saving, setSaving]       = useState(false);
  const emptyForm = { label: 'Home', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false };
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const res  = await fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setAddresses(data.addresses || []);
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setForm(emptyForm); setEditing(null); setShowForm(false); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const url    = editing ? `${API}/api/auth/addresses/${editing}` : `${API}/api/auth/addresses`;
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    setSaving(false);
    reset();
    load();
  };

  const del = async (id) => {
    await fetch(`${API}/api/auth/addresses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const startEdit = (a) => {
    setEditing(a._id);
    setForm({ label: a.label, fullName: a.fullName, phone: a.phone, line1: a.line1, line2: a.line2 || '', city: a.city, state: a.state, pincode: a.pincode, isDefault: a.isDefault });
    setShowForm(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-playfair font-bold text-roseDD">Saved Addresses</h3>
        <button onClick={() => { reset(); setShowForm(true); }}
          className="bg-gradient-to-br from-rose to-[#e09099] text-white text-xs font-semibold px-4 py-2 rounded-full hover:-translate-y-0.5 transition-all">
          + Add New
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-2xl border-2 border-pink-200 p-5 shadow-soft-s flex flex-col gap-3" style={{ animation: 'pageIn 0.25s ease both' }}>
          <h4 className="font-semibold text-roseDD text-sm">{editing ? 'Edit Address' : 'New Address'}</h4>
          <div className="flex gap-2">
            {['Home', 'Work', 'Other'].map(l => (
              <button key={l} type="button" onClick={() => setForm(f => ({ ...f, label: l }))}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.label === l ? 'bg-rose text-white border-rose' : 'border-pink-200 text-roseD hover:border-rose'}`}>
                {l === 'Home' ? '🏠' : l === 'Work' ? '💼' : '📍'} {l}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[['fullName','Full Name'],['phone','Phone'],['line1','Address Line 1'],['line2','Line 2 (optional)'],['city','City'],['state','State'],['pincode','Pincode']].map(([k, lbl]) => (
              <div key={k} className="flex flex-col gap-1">
                <label className="text-[.68rem] font-semibold text-gray-400 uppercase">{lbl}</label>
                <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="border border-pink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-rose" />
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} className="accent-rose" />
            Set as default address
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="bg-gradient-to-br from-rose to-[#e09099] text-white text-sm font-semibold px-5 py-2 rounded-full disabled:opacity-60">
              {saving ? 'Saving...' : editing ? 'Update' : 'Save Address'}
            </button>
            <button type="button" onClick={reset} className="text-sm text-gray-400 border border-gray-200 px-4 py-2 rounded-full">Cancel</button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm && (
        <div className="text-center py-12 bg-white rounded-2xl border border-pink-100">
          <p className="text-4xl mb-3">📍</p>
          <p className="text-sm text-textL">No saved addresses yet</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map(a => (
          <div key={a._id} className={`bg-white rounded-2xl border-2 p-5 shadow-soft-s relative ${a.isDefault ? 'border-rose' : 'border-pink-100'}`}>
            {a.isDefault && <span className="absolute top-3 right-3 text-[.65rem] font-bold bg-rose text-white px-2 py-0.5 rounded-full">Default</span>}
            <p className="text-xs font-bold text-roseD mb-2">{a.label === 'Home' ? '🏠' : a.label === 'Work' ? '💼' : '📍'} {a.label}</p>
            <p className="text-sm font-semibold text-roseDD">{a.fullName}</p>
            <p className="text-xs text-gray-500 mt-0.5">📞 {a.phone}</p>
            <p className="text-xs text-gray-500 mt-0.5">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
            <p className="text-xs text-gray-500">{a.city}, {a.state} — {a.pincode}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => startEdit(a)} className="text-xs text-roseD border border-pink-200 px-3 py-1 rounded-full hover:bg-pink-50">Edit</button>
              <button onClick={() => del(a._id)} className="text-xs text-red-400 border border-red-100 px-3 py-1 rounded-full hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Orders ──
function OrdersTab({ token }) {
  const navigate = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/orders/my-orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400 text-sm">Loading...</div>;

  if (!orders.length) return (
    <div className="text-center py-16 bg-white rounded-2xl border border-pink-100">
      <p className="text-5xl mb-3">📦</p>
      <p className="font-playfair font-bold text-roseDD text-lg mb-1">No orders yet</p>
      <p className="text-sm text-textL mb-5">Your order history will appear here</p>
      <button onClick={() => navigate('/flowers')} className="bg-gradient-to-br from-rose to-[#e09099] text-white px-6 py-2.5 rounded-full text-sm font-semibold">Browse Flowers 🌸</button>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {orders.map(o => (
        <div key={o._id} onClick={() => navigate('/tracking')}
          className="bg-white rounded-2xl border border-pink-100 p-4 shadow-soft-s flex items-center gap-4 hover:border-pink-300 transition-all cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-2xl flex-shrink-0 border border-pink-100">🌸</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-roseDD truncate">
              {o.items?.[0]?.name}{o.items?.length > 1 ? ` +${o.items.length - 1} more` : ''}
            </p>
            <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <p className="font-playfair font-bold text-roseD text-sm">₹{o.total?.toLocaleString()}</p>
            <span className={`text-[.65rem] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-500'}`}>
              {o.status?.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Wishlist ──
function WishlistTab({ user }) {
  const navigate = useNavigate();
  const key = user ? `floriva_wishlist_${user.id}` : 'floriva_wishlist_guest';
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  });

  const remove = (id) => {
    const next = items.filter(w => w._id !== id);
    setItems(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  if (!items.length) return (
    <div className="text-center py-16 bg-white rounded-2xl border border-pink-100">
      <p className="text-5xl mb-3">💖</p>
      <p className="font-playfair font-bold text-roseDD text-lg mb-1">Your Wishlist is Empty</p>
      <p className="text-sm text-textL mb-5">Heart flowers on the flowers page to save them here</p>
      <button onClick={() => navigate('/flowers')} className="bg-gradient-to-br from-rose to-[#e09099] text-white px-6 py-2.5 rounded-full text-sm font-semibold">Browse Flowers 🌸</button>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map(f => (
        <div key={f._id} className="bg-white rounded-2xl border border-pink-100 p-4 shadow-soft-s relative hover:-translate-y-1 transition-all">
          <button onClick={() => remove(f._id)} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-rose text-white text-xs flex items-center justify-center hover:scale-110 transition-all">❤️</button>
          {f.image && f.image !== 'PASTE_LINK_HERE'
            ? <img src={f.image} alt={f.name} className="w-full h-24 object-cover rounded-xl mb-3" />
            : <div className="text-4xl text-center mb-3">🌸</div>}
          <p className="font-playfair font-semibold text-sm text-roseDD truncate">{f.name}</p>
          {f.color    && <p className="text-xs text-gray-400">🎨 {f.color}</p>}
          {f.category && <p className="text-xs text-gray-400">🏷 {f.category}</p>}
          <p className="text-xs font-bold text-roseD mt-1">₹{f.pricePerStem}/stem</p>
        </div>
      ))}
    </div>
  );
}

// ── Wallet ──
function WalletTab({ token, user }) {
  const [wallet, setWallet]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [addAmount, setAddAmount] = useState('');
  const [adding, setAdding]     = useState(false);
  const [msg, setMsg]           = useState('');

  const load = async () => {
    try {
      const res  = await fetch(`${API}/api/wallet`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setWallet(data);
    } catch {
      // fallback mock if endpoint not ready
      setWallet({ balance: 0, transactions: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAddMoney = async (e) => {
    e.preventDefault();
    const amt = parseFloat(addAmount);
    if (!amt || amt < 1) return setMsg('⚠️ Enter a valid amount.');
    setAdding(true);
    try {
      const res  = await fetch(`${API}/api/wallet/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: amt }),
      });
      const data = await res.json();
      if (res.ok) { setMsg('✅ Money added successfully!'); setAddAmount(''); load(); }
      else setMsg('⚠️ ' + data.message);
    } catch {
      setMsg('⚠️ Could not add money. Try again.');
    }
    setAdding(false);
  };

  const QUICK_AMOUNTS = [100, 250, 500, 1000];

  const txnIcon = (type) => {
    if (type === 'credit')   return '⬆️';
    if (type === 'debit')    return '⬇️';
    if (type === 'refund')   return '↩️';
    return '💳';
  };

  if (loading) return <div className="text-center py-12 text-gray-400 text-sm">Loading wallet...</div>;

  return (
    <div className="flex flex-col gap-5">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-[#f8c8d4] via-[#f0d6f0] to-[#ddd0f7] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/10 rounded-full" />
        <p className="text-xs font-semibold text-roseDD/70 uppercase tracking-widest mb-1 relative z-10">Wallet Balance</p>
        <p className="font-playfair font-bold text-4xl text-roseDD relative z-10">
          ₹{(wallet?.balance ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-roseDD/60 mt-2 relative z-10">👛 {user?.name}'s BouquetBuilder Wallet</p>
      </div>

      {/* Add Money */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-soft-s">
        <h3 className="font-playfair font-bold text-roseDD mb-4">➕ Add Money</h3>
        <div className="flex gap-2 flex-wrap mb-4">
          {QUICK_AMOUNTS.map(amt => (
            <button key={amt} type="button"
              onClick={() => setAddAmount(String(amt))}
              className={`text-xs px-4 py-2 rounded-full border font-semibold transition-all ${addAmount === String(amt) ? 'bg-rose text-white border-rose' : 'border-pink-200 text-roseD hover:border-rose hover:bg-pink-50'}`}>
              ₹{amt}
            </button>
          ))}
        </div>
        <form onSubmit={handleAddMoney} className="flex flex-col gap-3">
          <Field label="Enter Amount" icon="₹">
            <input
              type="number"
              min="1"
              value={addAmount}
              onChange={e => setAddAmount(e.target.value)}
              placeholder="Enter custom amount"
              className="flex-1 outline-none text-sm bg-transparent text-gray-700"
            />
          </Field>
          {msg && <p className={`text-xs px-3 py-2 rounded-xl ${msg.startsWith('✅') ? 'bg-green-50 text-green-600' : 'bg-pink-50 text-roseD'}`}>{msg}</p>}
          <button type="submit" disabled={adding}
            className="self-start bg-gradient-to-br from-rose to-[#e09099] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:-translate-y-0.5 transition-all disabled:opacity-60">
            {adding ? 'Processing...' : 'Add to Wallet 👛'}
          </button>
        </form>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-soft-s">
        <h3 className="font-playfair font-bold text-roseDD mb-4">🧾 Transaction History</h3>
        {(!wallet?.transactions || wallet.transactions.length === 0) ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">🧾</p>
            <p className="text-sm text-gray-400">No transactions yet</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-pink-50">
            {wallet.transactions.slice().reverse().map((txn, i) => (
              <div key={txn._id || i} className="flex items-center gap-3 py-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 ${txn.type === 'credit' || txn.type === 'refund' ? 'bg-green-50' : 'bg-red-50'}`}>
                  {txnIcon(txn.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">{txn.description || 'Wallet transaction'}</p>
                  <p className="text-xs text-gray-400">{txn.createdAt ? new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p>
                </div>
                <p className={`text-sm font-bold flex-shrink-0 ${txn.type === 'credit' || txn.type === 'refund' ? 'text-green-600' : 'text-red-500'}`}>
                  {txn.type === 'credit' || txn.type === 'refund' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Settings ──
function SettingsTab({ token, onLogout }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]       = useState({ text: '', ok: true });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  const changePass = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return setMsg({ text: '⚠️ Passwords do not match.', ok: false });
    if (form.newPassword.length < 6) return setMsg({ text: '⚠️ Min. 6 characters required.', ok: false });
    setSaving(true);
    const res  = await fetch(`${API}/api/auth/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
    });
    const data = await res.json();
    setSaving(false);
    setMsg({ text: (res.ok ? '✅ ' : '⚠️ ') + data.message, ok: res.ok });
    if (res.ok) setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const passFields = [
    { key: 'currentPassword', label: 'Current Password', showKey: 'current' },
    { key: 'newPassword',     label: 'New Password',     showKey: 'new'     },
    { key: 'confirmPassword', label: 'Confirm New Password', showKey: 'confirm' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-soft-s">
        <h3 className="font-playfair font-bold text-roseDD mb-1">🔒 Change Password</h3>
        <p className="text-xs text-gray-400 mb-5">Keep your account secure by using a strong password.</p>
        <form onSubmit={changePass} className="flex flex-col gap-4">
          {passFields.map(({ key, label, showKey }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
              <div className="flex items-center gap-3 border-2 border-pink-100 rounded-xl px-4 py-3 focus-within:border-pink-400 transition-all bg-pink-50/30">
                <span className="text-pink-300">🔒</span>
                <input
                  type={showPass[showKey] ? 'text' : 'password'}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder="••••••••"
                  className="flex-1 outline-none text-sm bg-transparent text-gray-700"
                />
                <button type="button"
                  onClick={() => setShowPass(s => ({ ...s, [showKey]: !s[showKey] }))}
                  className="text-gray-300 hover:text-gray-500 text-xs transition-colors flex-shrink-0">
                  {showPass[showKey] ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          ))}
          {msg.text && <p className={`text-xs px-3 py-2 rounded-xl ${msg.ok ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{msg.text}</p>}
          <button type="submit" disabled={saving}
            className="self-start bg-gradient-to-br from-rose to-[#e09099] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:-translate-y-0.5 transition-all disabled:opacity-60">
            {saving ? 'Updating...' : 'Update Password 🔐'}
          </button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-soft-s">
        <h3 className="font-playfair font-bold text-roseDD mb-1">🔔 Notifications</h3>
        <p className="text-xs text-gray-400 mb-4">Manage what updates you'd like to receive.</p>
        <div className="flex flex-col gap-3">
          {[
            { label: 'Order updates & tracking', desc: 'Get notified when your order status changes', default: true },
            { label: 'Offers & promotions',      desc: 'Exclusive discounts and seasonal deals',    default: true },
            { label: 'Wishlist restock alerts',  desc: 'Know when wishlisted items are available',  default: false },
          ].map(item => (
            <NotifToggle key={item.label} label={item.label} desc={item.desc} defaultOn={item.default} />
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-soft-s">
        <h3 className="font-playfair font-bold text-red-500 mb-2">Account Actions</h3>
        <p className="text-xs text-gray-400 mb-4">Sign out from your account on this device.</p>
        <button onClick={onLogout} className="border-2 border-red-200 text-red-400 text-sm font-semibold px-5 py-2 rounded-full hover:bg-red-50 transition-all">
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}

function NotifToggle({ label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
      <button
        onClick={() => setOn(v => !v)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-rose' : 'bg-gray-200'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

// ── Contact Us ──
const FAQS = [
  {
    q: 'How do I track my order?',
    a: 'Go to My Orders and click on any order to view real-time tracking. You\'ll also receive SMS and email updates at every step of delivery.',
  },
  {
    q: 'Can I cancel or modify my order?',
    a: 'Orders can be cancelled or modified within 1 hour of placing them. After that, the flowers may already be in preparation. Contact us immediately if you need changes.',
  },
  {
    q: 'What is the delivery time?',
    a: 'We offer same-day delivery for orders placed before 2 PM. Standard delivery slots are morning (9 AM–1 PM) and evening (4 PM–8 PM). Express delivery is also available.',
  },
  {
    q: 'How does the wallet work?',
    a: 'Your BouquetBuilder wallet lets you store money for faster checkouts. You can add money anytime and use it to pay for orders. Refunds are also credited directly to your wallet.',
  },
  {
    q: 'Are the flowers fresh?',
    a: 'Absolutely! We source flowers daily from local farms and trusted suppliers. All bouquets are assembled fresh on the day of delivery to ensure maximum freshness.',
  },
  {
    q: 'What if I receive damaged flowers?',
    a: 'We\'re so sorry if that happened! Please take a photo and contact us within 24 hours of delivery. We\'ll arrange a replacement or full refund — no questions asked.',
  },
  {
    q: 'Do you offer bulk or wedding orders?',
    a: 'Yes! We specialize in wedding décor and bulk floral arrangements. Reach out to us via email or phone at least 5–7 days in advance for custom bulk orders.',
  },
  {
    q: 'How do I use a promo code?',
    a: 'During checkout, you\'ll find a "Apply Coupon" field. Enter your promo code there and the discount will be applied automatically to your order total.',
  },
];

function ContactUsTab() {
  const [openFaq, setOpenFaq]   = useState(null);
  const [form, setForm]         = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Replace with your actual contact API endpoint
    await new Promise(r => setTimeout(r, 1200)); // Simulated delay
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-[#ffe8ed] to-[#eadcf7] rounded-2xl p-6 flex items-center gap-4">
        <span className="text-4xl">💬</span>
        <div>
          <h3 className="font-playfair font-bold text-roseDD text-lg">We're here to help!</h3>
          <p className="text-sm text-textL mt-0.5">Reach out anytime — we usually respond within a few hours.</p>
        </div>
      </div>

      {/* Quick contact info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: '📞', label: 'Call Us',    value: '+91 98765 43210',         sub: 'Mon–Sat, 9 AM – 7 PM' },
          { icon: '✉️', label: 'Email Us',   value: 'support@bouquetbuilder.in', sub: 'Reply within 24 hrs' },
          { icon: '💬', label: 'WhatsApp',   value: '+91 98765 43210',         sub: 'Quick responses' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-2xl border border-pink-100 p-4 shadow-soft-s flex flex-col items-center text-center gap-1">
            <span className="text-2xl mb-1">{item.icon}</span>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.label}</p>
            <p className="text-sm font-semibold text-roseDD">{item.value}</p>
            <p className="text-[.65rem] text-gray-400">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-soft-s">
        <h3 className="font-playfair font-bold text-roseDD mb-1">❓ Frequently Asked Questions</h3>
        <p className="text-xs text-gray-400 mb-5">Quick answers to common questions.</p>
        <div className="flex flex-col gap-2">
          {FAQS.map((faq, i) => (
            <div key={i} className={`rounded-xl border transition-all overflow-hidden ${openFaq === i ? 'border-pink-300 bg-pink-50/40' : 'border-pink-100 bg-white'}`}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3">
                <span className="text-sm font-semibold text-gray-700">{faq.q}</span>
                <span className={`text-pink-300 flex-shrink-0 text-xs transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-pink-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-soft-s">
        <h3 className="font-playfair font-bold text-roseDD mb-1">📝 Have a Question?</h3>
        <p className="text-xs text-gray-400 mb-5">Fill out the form below and we'll get back to you shortly.</p>

        {sent ? (
          <div className="text-center py-8 flex flex-col items-center gap-3">
            <span className="text-5xl">🌸</span>
            <p className="font-playfair font-bold text-roseDD text-lg">Message Sent!</p>
            <p className="text-sm text-textL">Thanks for reaching out. We'll reply to you soon.</p>
            <button onClick={() => setSent(false)}
              className="mt-2 text-sm text-roseD border border-pink-200 px-4 py-2 rounded-full hover:bg-pink-50 transition-all">
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Your Name" icon="👤">
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="Sakshi Rani"
                  className="flex-1 outline-none text-sm bg-transparent text-gray-700"
                />
              </Field>
              <Field label="Email Address" icon="✉️">
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="you@email.com"
                  className="flex-1 outline-none text-sm bg-transparent text-gray-700"
                />
              </Field>
            </div>
            <Field label="Subject" icon="📌">
              <input
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                required
                placeholder="e.g. Issue with my order"
                className="flex-1 outline-none text-sm bg-transparent text-gray-700"
              />
            </Field>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Message</label>
              <div className="border-2 border-pink-100 rounded-xl px-4 py-3 focus-within:border-pink-400 transition-all bg-pink-50/30">
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                  rows={4}
                  placeholder="Tell us how we can help you..."
                  className="w-full outline-none text-sm bg-transparent text-gray-700 resize-none"
                />
              </div>
            </div>
            <button type="submit" disabled={sending}
              className="self-start bg-gradient-to-br from-rose to-[#e09099] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:-translate-y-0.5 transition-all disabled:opacity-60">
              {sending ? 'Sending...' : 'Send Message 💌'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main ──
export default function AccountPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

  function switchTab(key) { setActiveTab(key); setSearchParams({ tab: key }); }

  function handleLogout() { logout(); navigate('/'); }

  function handleUserUpdate(updated) {
    const merged = { ...user, ...updated };
    localStorage.setItem('floriva_user', JSON.stringify(merged));
    window.dispatchEvent(new Event('storage'));
  }

  if (!user) return (
    <div className="page-enter flex flex-col items-center justify-center min-h-[calc(100vh-62px)] gap-4">
      <div className="text-6xl">🔐</div>
      <h2 className="font-playfair font-bold text-roseDD text-2xl">Sign in to view your account</h2>
      <button onClick={() => navigate('/auth')} className="bg-gradient-to-br from-rose to-[#e09099] text-white px-6 py-2.5 rounded-full text-sm font-semibold">Sign In 🌸</button>
    </div>
  );

  return (
    <div className="page-enter min-h-screen bg-pink-50">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <h2 className="font-playfair font-bold text-[clamp(1.5rem,3vw,2rem)] text-roseDD mb-6">My Account</h2>

        <div className="flex gap-6 flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="md:w-[220px] flex-shrink-0">
            <div className="bg-white rounded-2xl border border-pink-100 shadow-soft-s overflow-hidden">
              {TABS.map(t => (
                <button key={t.key} onClick={() => switchTab(t.key)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-all text-left ${
                    activeTab === t.key
                      ? 'bg-gradient-to-r from-pink-50 to-lavL text-roseDD font-semibold border-l-[3px] border-rose'
                      : 'text-gray-500 hover:bg-pink-50 hover:text-roseD border-l-[3px] border-transparent'
                  }`}>
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {activeTab === 'profile'   && <ProfileTab   token={token} user={user} onUserUpdate={handleUserUpdate} />}
            {activeTab === 'addresses' && <AddressesTab token={token} />}
            {activeTab === 'orders'    && <OrdersTab    token={token} />}
            {activeTab === 'wishlist'  && <WishlistTab  user={user} />}
            {activeTab === 'wallet'    && <WalletTab    token={token} user={user} />}
            {activeTab === 'settings'  && <SettingsTab  token={token} onLogout={handleLogout} />}
            {activeTab === 'contact'   && <ContactUsTab />}
          </main>
        </div>
      </div>
    </div>
  );
}
