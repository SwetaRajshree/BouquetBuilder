import { useState, useRef, useCallback, useEffect } from 'react';

const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL || 'http://127.0.0.1:8000';

function FloraChat() {
  const [msgs, setMsgs] = useState([
    { from: 'flora', text: "Hi! I'm Flora 🌸 Ask me anything about flowers!" }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [msgs]);

  const send = useCallback(async (text) => {
    if (!text.trim()) return;
    setMsgs(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${CHATBOT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionIdRef.current }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      sessionIdRef.current = data.session_id;
      setMsgs(prev => [...prev, { from: 'flora', text: data.reply }]);
    } catch (err) {
      setMsgs(prev => [...prev, { from: 'flora', text: '⚠️ Something went wrong. Try again.' }]);
    }
    setLoading(false);
  }, []);

  return (
    <div className="max-w-[680px] mx-auto px-4 py-8">
      <div className="text-center p-8 rounded-lg mb-5 bg-gradient-to-br from-[#ffe8ed] to-[#eadcf7]">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full text-5xl flex items-center justify-center bg-gradient-to-br from-blush to-lavender">🌸</div>
        <h2 className="font-playfair font-bold text-[1.7rem] text-roseDD">Meet Flora</h2>
        <p className="text-[.87rem] text-textL mt-1">Your AI bouquet assistant · Available 24/7</p>
      </div>
      <div ref={chatRef} className="bg-white rounded-lg shadow-soft-s border border-blush/20 min-h-[380px] max-h-[460px] overflow-y-auto p-5 flex flex-col gap-3.5 mb-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex items-end gap-2 ${m.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {m.from === 'flora' && <span className="text-2xl flex-shrink-0">🌸</span>}
            <div className={`max-w-[78%] px-4 py-3 rounded-[18px] text-[.88rem] leading-relaxed
              ${m.from === 'flora' ? 'bg-lavender text-text rounded-bl-[4px]' : 'bg-rose text-white rounded-br-[4px]'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-400">Flora is typing...</div>}
      </div>
      <div className="flex gap-2.5">
        <input
          className="flex-1 px-4 py-3 rounded-full border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.88rem]"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder="Ask Flora anything..."
        />
        <button onClick={() => send(input)} className="bg-gradient-to-br from-rose to-[#e09099] text-white text-[.85rem] font-semibold px-5 py-2.5 rounded-full">
          Send 🌸
        </button>
      </div>
    </div>
  );
}

// Floating chat bubble shown on every page
export function FloraWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: 'flora', text: "Hi! I'm Flora 🌸 Ask me anything about flowers!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (open) chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [msgs, open]);

  const send = useCallback(async (text) => {
    if (!text.trim()) return;
    setMsgs(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${CHATBOT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionIdRef.current }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      sessionIdRef.current = data.session_id;
      setMsgs(prev => [...prev, { from: 'flora', text: data.reply }]);
    } catch {
      setMsgs(prev => [...prev, { from: 'flora', text: '⚠️ Something went wrong. Try again.' }]);
    }
    setLoading(false);
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: 'Poppins, sans-serif' }}>
      {/* Chat panel */}
      {open && (
        <div style={{
          width: 340, background: '#fff', borderRadius: 20,
          boxShadow: '0 8px 40px rgba(201,132,138,0.25)',
          border: '1.5px solid #f5d0d8', marginBottom: 12,
          overflow: 'hidden', animation: 'floraSlideUp 0.25s ease both',
        }}>
          <style>{`@keyframes floraSlideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#f9a8b8,#c084fc)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>🌸</span>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Flora</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>AI Bouquet Assistant</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>✕</button>
          </div>
          {/* Messages */}
          <div ref={chatRef} style={{ height: 300, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 8, background: '#fff8fa' }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 6 }}>
                {m.from === 'flora' && <span style={{ fontSize: 18, flexShrink: 0 }}>🌸</span>}
                <div style={{
                  maxWidth: '80%', padding: '8px 12px', borderRadius: m.from === 'flora' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                  fontSize: 13, lineHeight: 1.5,
                  background: m.from === 'flora' ? '#f3e8ff' : 'linear-gradient(135deg,#f9a8b8,#e09099)',
                  color: m.from === 'flora' ? '#5b2d8e' : '#fff',
                }}>{m.text}</div>
              </div>
            ))}
            {loading && <div style={{ fontSize: 12, color: '#aaa', paddingLeft: 28 }}>Flora is typing...</div>}
          </div>
          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #f5d0d8', display: 'flex', gap: 8, background: '#fff' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Ask Flora..."
              style={{ flex: 1, border: '1.5px solid #f5d0d8', borderRadius: 20, padding: '8px 14px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            />
            <button
              onClick={() => send(input)}
              style={{ background: 'linear-gradient(135deg,#f9a8b8,#e09099)', border: 'none', borderRadius: 20, padding: '8px 14px', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            >Send</button>
          </div>
        </div>
      )}
      {/* Bubble button */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg,#f9a8b8,#c084fc)',
          border: 'none', cursor: 'pointer', fontSize: 26,
          boxShadow: '0 4px 20px rgba(201,132,138,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        title="Chat with Flora"
      >🌸</button>
    </div>
  );
}

export default FloraChat;
  const [msgs, setMsgs] = useState([
    { from: 'flora', text: "Hi! I'm Flora 🌸 Ask me anything about flowers!" }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [msgs]);

  const send = useCallback(async (text) => {
    if (!text.trim()) return;

    setMsgs(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${CHATBOT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_id: sessionIdRef.current,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      sessionIdRef.current = data.session_id;

      setMsgs(prev => [...prev, { from: 'flora', text: data.reply }]);
    } catch (err) {
      console.error('FloraChat error:', err);
      setMsgs(prev => [
        ...prev,
        { from: 'flora', text: '⚠️ Something went wrong. Try again.' }
      ]);
    }

    setLoading(false);
  }, []);

  return (
    <div className="max-w-[680px] mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="text-center p-8 rounded-lg mb-5 bg-gradient-to-br from-[#ffe8ed] to-[#eadcf7]">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full text-5xl flex items-center justify-center bg-gradient-to-br from-blush to-lavender">
          🌸
        </div>
        <h2 className="font-playfair font-bold text-[1.7rem] text-roseDD">
          Meet Flora
        </h2>
        <p className="text-[.87rem] text-textL mt-1">
          Your AI bouquet assistant · Available 24/7
        </p>
      </div>

      {/* Chat window */}
      <div
        ref={chatRef}
        className="bg-white rounded-lg shadow-soft-s border border-blush/20 min-h-[380px] max-h-[460px] overflow-y-auto p-5 flex flex-col gap-3.5 mb-4"
      >
        {msgs.map((m, i) => (
          <div key={i} className={`flex items-end gap-2 ${m.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            
            {m.from === 'flora' && (
              <span className="text-2xl flex-shrink-0">🌸</span>
            )}

            <div
              className={`max-w-[78%] px-4 py-3 rounded-[18px] text-[.88rem] leading-relaxed
              ${m.from === 'flora'
                ? 'bg-lavender text-text rounded-bl-[4px]'
                : 'bg-rose text-white rounded-br-[4px]'}`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="text-sm text-gray-400">Flora is typing...</div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2.5">
        <input
          className="flex-1 px-4 py-3 rounded-full border-[1.5px] border-blush/40 focus:border-rose outline-none text-[.88rem]"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder="Ask Flora anything..."
        />
        <button
          onClick={() => send(input)}
          className="bg-gradient-to-br from-rose to-[#e09099] text-white text-[.85rem] font-semibold px-5 py-2.5 rounded-full"
        >
          Send 🌸
        </button>
      </div>

    </div>
  );
}
