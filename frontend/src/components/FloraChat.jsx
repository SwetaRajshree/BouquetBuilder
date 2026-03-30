import { useState, useRef, useCallback, useEffect } from 'react';

const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL || 'http://127.0.0.1:8000';

export default function FloraChat() {
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
