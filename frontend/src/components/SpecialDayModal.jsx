import { useState } from 'react';

const OCCASION_TYPES = ['Birthday', "Anniversary", "Valentine's Day", "Mother's Day", 'Just Because', 'Graduation', 'Wedding'];
const REMINDERS      = ['1', '3', '7', '14', '30'];

export default function SpecialDayModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', occasion: 'Birthday', date: '', reminder: '7' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-[rgba(61,44,53,.45)] backdrop-blur-md animate-[ovIn_.2s_ease]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 w-[90%] max-w-[460px] shadow-[0_24px_72px_rgba(61,44,53,.22)] animate-[moIn_.3s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="font-playfair font-bold text-[1.3rem] text-roseDD mb-5">🌸 Add Special Day</h3>

        <div className="mb-4">
          <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Person's Name</label>
          <input
            className="w-full px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.88rem] transition-all"
            placeholder="e.g. Ananya"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Occasion Type</label>
          <select
            className="w-full px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.88rem] bg-white transition-all"
            value={form.occasion}
            onChange={e => set('occasion', e.target.value)}
          >
            {OCCASION_TYPES.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Date</label>
          <input
            type="date"
            className="w-full px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.88rem] transition-all"
            value={form.date}
            onChange={e => set('date', e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-[.78rem] font-semibold text-textM mb-1.5 uppercase tracking-wide">Remind me</label>
          <select
            className="w-full px-4 py-2.5 rounded-sm border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.88rem] bg-white transition-all"
            value={form.reminder}
            onChange={e => set('reminder', e.target.value)}
          >
            {REMINDERS.map(d => <option key={d} value={d}>{d} day{d !== '1' ? 's' : ''} before</option>)}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border-[1.5px] border-rose text-roseD font-medium py-2.5 rounded-full hover:bg-rose hover:text-white transition-all text-[.85rem]"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (form.name && form.date) { onSave(form); onClose(); } }}
            className="flex-1 bg-gradient-to-br from-rose to-[#e09099] text-white font-semibold py-2.5 rounded-full hover:-translate-y-0.5 hover:shadow-soft-m transition-all text-[.85rem]"
          >
            Save 🌸
          </button>
        </div>
      </div>
    </div>
  );
}
