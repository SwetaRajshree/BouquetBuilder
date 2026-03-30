import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

const ORDER_STATUSES = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

// ── Reusable confirm delete button ──
function DeleteBtn({ onDelete }) {
  const [confirm, setConfirm] = useState(false);
  return confirm
    ? <span className="flex gap-1">
        <button onClick={onDelete} className="text-[.7rem] bg-red-500 text-white px-2 py-0.5 rounded-full">Yes</button>
        <button onClick={() => setConfirm(false)} className="text-[.7rem] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">No</button>
      </span>
    : <button onClick={() => setConfirm(true)} className="text-[.7rem] text-red-400 hover:text-red-600 border border-red-200 px-2 py-0.5 rounded-full">Delete</button>;
}

// ── Flowers Tab ──
function FlowersTab({ token }) {
  const [flowers, setFlowers] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', color: '', pricePerStem: '', city: '', inStock: true, image: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(`${API}/api/admin/flowers`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setFlowers).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async (e) => {
    e.preventDefault();
    const url    = editing ? `${API}/api/admin/flowers/${editing}` : `${API}/api/admin/flowers`;
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...form, pricePerStem: Number(form.pricePerStem) }) });
    setForm({ name: '', category: '', color: '', pricePerStem: '', city: '', inStock: true, image: '' });
    setEditing(null);
    load();
  };

  const del = async (id) => {
    await fetch(`${API}/api/admin/flowers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const startEdit = (f) => {
    setEditing(f._id);
    setForm({ name: f.name || '', category: f.category || '', color: f.color || '', pricePerStem: f.pricePerStem || '', city: f.city || '', inStock: f.inStock ?? true, image: f.image || '' });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form */}
      <form onSubmit={save} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-soft-s">
        <h3 className="font-playfair font-bold text-roseDD mb-4">{editing ? '✏️ Edit Flower' : '➕ Add Flower'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[['name','Name *'],['category','Category'],['color','Color'],['pricePerStem','Price/Stem'],['city','City'],['image','Image URL']].map(([k, label]) => (
            <div key={k} className="flex flex-col gap-1">
              <label className="text-[.7rem] font-semibold text-gray-400 uppercase">{label}</label>
              <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                className="border border-pink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-rose" />
            </div>
          ))}
          <div className="flex flex-col gap-1 justify-end">
            <label className="text-[.7rem] font-semibold text-gray-400 uppercase">In Stock</label>
            <select value={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.value === 'true' }))}
              className="border border-pink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-rose">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-gradient-to-br from-rose to-[#e09099] text-white text-sm font-semibold px-5 py-2 rounded-full">
            {editing ? 'Update' : 'Add Flower'} 🌸
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name:'',category:'',color:'',pricePerStem:'',city:'',inStock:true,image:'' }); }}
            className="text-sm text-gray-400 border border-gray-200 px-4 py-2 rounded-full">Cancel</button>}
        </div>
      </form>

      {/* List */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-soft-s overflow-hidden">
        <div className="px-5 py-3 border-b border-pink-50 flex items-center justify-between">
          <p className="font-semibold text-roseDD text-sm">All Flowers ({flowers.length})</p>
        </div>
        {loading ? <p className="text-center py-8 text-gray-400 text-sm">Loading...</p> : (
          <div className="divide-y divide-pink-50">
            {flowers.map(f => (
              <div key={f._id} className="flex items-center gap-3 px-5 py-3 hover:bg-pink-50/40 transition-all">
                <span className="text-2xl">{f.image && !f.image.startsWith('http') ? f.image : '🌸'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-roseDD truncate">{f.name}</p>
                  <p className="text-[.72rem] text-gray-400">{f.category} · {f.color} · {f.city} · ₹{f.pricePerStem}</p>
                </div>
                <span className={`text-[.65rem] font-bold px-2 py-0.5 rounded-full ${f.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                  {f.inStock ? 'In Stock' : 'Out'}
                </span>
                <button onClick={() => startEdit(f)} className="text-[.7rem] text-roseD border border-pink-200 px-2 py-0.5 rounded-full hover:bg-pink-50">Edit</button>
                <DeleteBtn onDelete={() => del(f._id)} />
              </div>
            ))}
            {flowers.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No flowers yet</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Plants Tab ──
function PlantsTab({ token }) {
  const PLANT_CATEGORIES = ['Flower Plants','Indoor Plants','Outdoor Plants','Succulents','Air Purifying'];
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState({ name:'', category:'Flower Plants', nursery:'', price:'', original:'', discount:'', img:'🌿', image:'', color:'', city:'Bhubaneswar', inStock:true });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(`${API}/api/admin/plants`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => setPlants(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async (e) => {
    e.preventDefault();
    const url    = editing ? `${API}/api/admin/plants/${editing}` : `${API}/api/admin/plants`;
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, price: Number(form.price), original: Number(form.original), discount: Number(form.discount) }) });
    setForm({ name:'', category:'Flower Plants', nursery:'', price:'', original:'', discount:'', img:'🌿', image:'', color:'', city:'Bhubaneswar', inStock:true });
    setEditing(null);
    load();
  };

  const del = async (id) => {
    await fetch(`${API}/api/admin/plants/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name||'', category: p.category||'Flower Plants', nursery: p.nursery||'', price: p.price||'', original: p.original||'', discount: p.discount||'', img: p.img||'🌿', image: p.image||'', color: p.color||'', city: p.city||'', inStock: p.inStock??true });
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={save} className="bg-white rounded-2xl border border-green-100 p-5 shadow-soft-s">
        <h3 className="font-playfair font-bold text-green-700 mb-4">{editing ? '✏️ Edit Plant' : '➕ Add Plant'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[['name','Name *'],['nursery','Nursery'],['price','Price'],['original','Original Price'],['discount','Discount %'],['img','Emoji'],['image','Image URL'],['color','Color'],['city','City']].map(([k, label]) => (
            <div key={k} className="flex flex-col gap-1">
              <label className="text-[.7rem] font-semibold text-gray-400 uppercase">{label}</label>
              <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                className="border border-green-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" />
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label className="text-[.7rem] font-semibold text-gray-400 uppercase">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="border border-green-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500">
              {PLANT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[.7rem] font-semibold text-gray-400 uppercase">In Stock</label>
            <select value={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.value === 'true' }))}
              className="border border-green-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-gradient-to-br from-green-600 to-green-500 text-white text-sm font-semibold px-5 py-2 rounded-full">
            {editing ? 'Update' : 'Add Plant'} 🌿
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name:'',category:'Flower Plants',nursery:'',price:'',original:'',discount:'',img:'🌿',image:'',color:'',city:'Bhubaneswar',inStock:true }); }}
            className="text-sm text-gray-400 border border-gray-200 px-4 py-2 rounded-full">Cancel</button>}
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-green-100 shadow-soft-s overflow-hidden">
        <div className="px-5 py-3 border-b border-green-50">
          <p className="font-semibold text-green-700 text-sm">All Plants ({plants.length})</p>
        </div>
        {loading ? <p className="text-center py-8 text-gray-400 text-sm">Loading...</p> : (
          <div className="divide-y divide-green-50">
            {plants.map(p => (
              <div key={p._id} className="flex items-center gap-3 px-5 py-3 hover:bg-green-50/40 transition-all">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-green-50 flex items-center justify-center flex-shrink-0">
                  {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-xl">{p.img || '🌿'}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-700 truncate">{p.name}</p>
                  <p className="text-[.72rem] text-gray-400">{p.category} · {p.nursery} · ₹{p.price}</p>
                </div>
                <span className={`text-[.65rem] font-bold px-2 py-0.5 rounded-full ${p.inStock ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                  {p.inStock ? 'In Stock' : 'Out'}
                </span>
                <button onClick={() => startEdit(p)} className="text-[.7rem] text-green-700 border border-green-200 px-2 py-0.5 rounded-full hover:bg-green-50">Edit</button>
                <DeleteBtn onDelete={() => del(p._id)} />
              </div>
            ))}
            {plants.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No plants yet</p>}
          </div>
        )}
      </div>
    </div>
  );
}
function ShopsTab({ token }) {
  const [shops, setShops] = useState([]);
  const [form, setForm] = useState({ name: '', area: '', city: '', type: 'flower', keywords: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(`${API}/api/admin/shops`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setShops).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async (e) => {
    e.preventDefault();
    const url    = editing ? `${API}/api/admin/shops/${editing}` : `${API}/api/admin/shops`;
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean) }) });
    setForm({ name: '', area: '', city: '', type: 'flower', keywords: '' });
    setEditing(null);
    load();
  };

  const del = async (id) => {
    await fetch(`${API}/api/admin/shops/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const startEdit = (s) => {
    setEditing(s._id);
    setForm({ name: s.name || '', area: s.area || '', city: s.city || '', type: s.type || 'flower', keywords: (s.keywords || []).join(', ') });
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={save} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-soft-s">
        <h3 className="font-playfair font-bold text-roseDD mb-4">{editing ? '✏️ Edit Shop' : '➕ Add Shop'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[['name','Shop Name *'],['area','Area'],['city','City'],['keywords','Keywords (comma separated)']].map(([k, label]) => (
            <div key={k} className="flex flex-col gap-1">
              <label className="text-[.7rem] font-semibold text-gray-400 uppercase">{label}</label>
              <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                className="border border-pink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-rose" />
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <label className="text-[.7rem] font-semibold text-gray-400 uppercase">Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="border border-pink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-rose">
              <option value="flower">🌸 Flower Shop</option>
              <option value="plant">🌿 Plant Nursery</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-gradient-to-br from-rose to-[#e09099] text-white text-sm font-semibold px-5 py-2 rounded-full">
            {editing ? 'Update' : 'Add Shop'} 🏪
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name:'',area:'',city:'',type:'flower',keywords:'' }); }}
            className="text-sm text-gray-400 border border-gray-200 px-4 py-2 rounded-full">Cancel</button>}
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-pink-100 shadow-soft-s overflow-hidden">
        <div className="px-5 py-3 border-b border-pink-50">
          <p className="font-semibold text-roseDD text-sm">All Shops ({shops.length})</p>
        </div>
        {loading ? <p className="text-center py-8 text-gray-400 text-sm">Loading...</p> : (
          <div className="divide-y divide-pink-50">
            {shops.map(s => (
              <div key={s._id} className="flex items-center gap-3 px-5 py-3 hover:bg-pink-50/40 transition-all">
                <span className="text-2xl">{s.type === 'plant' ? '🌿' : '🏪'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-roseDD truncate">{s.name}</p>
                  <p className="text-[.72rem] text-gray-400">{s.area} · {s.city} · <span className={s.type === 'plant' ? 'text-green-600' : 'text-pink-500'}>{s.type === 'plant' ? '🌿 Nursery' : '🌸 Flower Shop'}</span></p>
                </div>
                <button onClick={() => startEdit(s)} className="text-[.7rem] text-roseD border border-pink-200 px-2 py-0.5 rounded-full hover:bg-pink-50">Edit</button>
                <DeleteBtn onDelete={() => del(s._id)} />
              </div>
            ))}
            {shops.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No shops yet</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Orders Tab ──
function OrdersTab({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(`${API}/api/admin/orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(data => setOrders(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await fetch(`${API}/api/admin/orders/${id}/status`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const STATUS_COLORS = { placed:'bg-blue-100 text-blue-600', preparing:'bg-yellow-100 text-yellow-600', out_for_delivery:'bg-orange-100 text-orange-600', delivered:'bg-green-100 text-green-600', cancelled:'bg-red-100 text-red-500' };

  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-soft-s overflow-hidden">
      <div className="px-5 py-3 border-b border-pink-50">
        <p className="font-semibold text-roseDD text-sm">All Orders ({orders.length})</p>
      </div>
      {loading ? <p className="text-center py-8 text-gray-400 text-sm">Loading...</p> : (
        <div className="divide-y divide-pink-50">
          {orders.map(o => (
            <div key={o._id} className="flex items-center gap-3 px-5 py-3 flex-wrap hover:bg-pink-50/40 transition-all">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-roseDD truncate">#{o._id.slice(-6).toUpperCase()}</p>
                <p className="text-[.72rem] text-gray-400">{o.items?.length} item(s) · ₹{o.total?.toLocaleString()}</p>
                <p className="text-[.7rem] text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                className={`text-[.72rem] font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-500'}`}>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ').toUpperCase()}</option>)}
              </select>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No orders yet</p>}
        </div>
      )}
    </div>
  );
}

// ── Users Tab ──
function UsersTab({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setUsers).finally(() => setLoading(false));
  }, []);

  const ROLE_COLORS = { customer: 'bg-blue-100 text-blue-600', admin: 'bg-purple-100 text-purple-600', retailer: 'bg-green-100 text-green-600' };

  return (
    <div className="bg-white rounded-2xl border border-pink-100 shadow-soft-s overflow-hidden">
      <div className="px-5 py-3 border-b border-pink-50">
        <p className="font-semibold text-roseDD text-sm">All Users ({users.length})</p>
      </div>
      {loading ? <p className="text-center py-8 text-gray-400 text-sm">Loading...</p> : (
        <div className="divide-y divide-pink-50">
          {users.map(u => (
            <div key={u._id} className="flex items-center gap-3 px-5 py-3 hover:bg-pink-50/40 transition-all">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blush to-lavender flex items-center justify-center text-sm font-bold text-roseD flex-shrink-0">
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-roseDD truncate">{u.name}</p>
                <p className="text-[.72rem] text-gray-400">{u.email}</p>
              </div>
              <span className={`text-[.65rem] font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-500'}`}>
                {u.role}
              </span>
            </div>
          ))}
          {users.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">No users yet</p>}
        </div>
      )}
    </div>
  );
}

// ── Main Admin Page ──
const TABS = [
  { key: 'flowers', label: '🌸 Flowers' },
  { key: 'plants',  label: '🌿 Plants'  },
  { key: 'shops',   label: '🏪 Shops'   },
  { key: 'orders',  label: '📦 Orders'  },
  { key: 'users',   label: '👥 Users'   },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [tab, setTab] = useState('flowers');

  if (!user || user.role !== 'admin') {
    return (
      <div className="page-enter flex flex-col items-center justify-center min-h-[calc(100vh-62px)] gap-4">
        <div className="text-6xl">🛡️</div>
        <h2 className="font-playfair font-bold text-roseDD text-2xl">Admin Access Only</h2>
        <button onClick={() => navigate('/admin-login')} className="bg-gradient-to-br from-rose to-[#e09099] text-white px-6 py-2.5 rounded-full text-sm font-semibold">
          Go to Admin Login
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen bg-pink-50">
      <div className="max-w-[1100px] mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="font-playfair font-bold text-[clamp(1.5rem,3vw,2rem)] text-roseDD">🛡️ Admin Dashboard</h2>
            <p className="text-sm text-textL mt-0.5">Welcome, {user.name} · Full access</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }}
            className="border-2 border-rose text-roseD text-sm font-semibold px-4 py-2 rounded-full hover:bg-rose hover:text-white transition-all">
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                tab === t.key
                  ? 'bg-gradient-to-br from-rose to-[#e09099] text-white shadow-soft-s'
                  : 'bg-white border border-pink-100 text-roseD hover:border-rose'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'flowers' && <FlowersTab token={token} />}
        {tab === 'plants'  && <PlantsTab  token={token} />}
        {tab === 'shops'   && <ShopsTab   token={token} />}
        {tab === 'orders'  && <OrdersTab  token={token} />}
        {tab === 'users'   && <UsersTab   token={token} />}
      </div>
    </div>
  );
}
