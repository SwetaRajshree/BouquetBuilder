import { useEffect, useMemo, useRef, useState } from "react";

/* -------------------- UI Components -------------------- */

function Spinner({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-pink-200 rounded-full animate-bounce"></div>
    </div>
  );
}

/* -------------------- Utils -------------------- */

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
}

function createId() {
  return crypto.randomUUID();
}

function getOrCreateSessionId() {
  const key = "chat_session_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const fresh = createId();
  localStorage.setItem(key, fresh);
  return fresh;
}

/* -------------------- CHATBOT UI -------------------- */

function ChatbotUI() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [sessionId, setSessionId] = useState(getOrCreateSessionId());
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          session_id: sessionId,
        }),
      });

      const data = await res.json();

      setSessionId(data.session_id);

      const botMsg = { role: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-3 bg-pink-500 text-white font-semibold">
        🌸 Flower Assistant
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-3 py-2 rounded-xl text-sm ${
              msg.role === "user"
                ? "bg-pink-500 text-white"
                : "bg-gray-200 text-black"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && <TypingIndicator />}
        <div ref={scrollRef}></div>
      </div>

      <div className="p-2 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-xl px-3 py-2 text-sm"
          placeholder="Ask about flowers..."
        />
        <button
          onClick={sendMessage}
          className="bg-pink-500 text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* -------------------- FLOATING WIDGET -------------------- */

function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-[450px] shadow-2xl rounded-2xl overflow-hidden">
          <ChatbotUI />
        </div>
      )}
    </>
  );
}

/* -------------------- MAIN WEBSITE -------------------- */

export default function App() {
  return (
    <div className="min-h-screen bg-pink-50">
      
      {/* 🌸 Website UI */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-pink-600">
          🌸 Bouquet Builder
        </h1>
        <p className="text-gray-600 mt-2">
          Create your perfect flower bouquet 💐
        </p>
      </div>

      {/* 💬 Chatbot */}
      <ChatWidget />
    </div>
  );
}