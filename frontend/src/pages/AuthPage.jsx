import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, register, loading } = useAuth();

  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (tab === "admin") {
      if (!form.email || !form.password) return setError("Please fill in all fields.");
      const res = await login(form.email, form.password);
      if (!res.success) return setError(res.message);
      if (res.role !== "admin") return setError("Access denied. Not an authorised admin account.");
      setSuccess("Welcome, Admin! 🛡️ Redirecting...");
      setTimeout(() => navigate("/admin"), 1200);

    } else if (tab === "login") {
      if (!form.email || !form.password) return setError("Please fill in all fields.");
      const res = await login(form.email, form.password);
      if (!res.success) return setError(res.message);
      setSuccess("Welcome back! 🌸 Redirecting...");
      setTimeout(() => navigate(redirect), 1200);

    } else {
      if (!form.name || !form.email || !form.password) return setError("Please fill in all fields.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
      const res = await register(form.name, form.email, form.password);
      if (!res.success) return setError(res.message);
      setSuccess("Account created! 🌺 Welcome to Floriva!");
      setTimeout(() => navigate(redirect), 1200);
    }
  }

  function switchTab(t) {
    setTab(t);
    setForm({ name: "", email: "", password: "" });
    setError("");
    setSuccess("");
  }

  const isAdmin = tab === "admin";

  return (
    <div className="min-h-[calc(100vh-62px)] bg-gradient-to-br from-[#ffe8ed] via-[#f0e0ff] to-[#daefd4] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(201,132,138,0.2)] overflow-hidden" style={{ animation: "pageIn 0.4s ease both" }}>

        {/* Banner */}
        <div className={`px-8 pt-8 pb-6 text-center transition-all duration-300 ${isAdmin ? 'bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e]' : 'bg-gradient-to-br from-[#ffe8ed] to-[#eadcf7]'}`}>
          <div className="text-5xl mb-2">{isAdmin ? '🛡️' : '💐'}</div>
          <h1 className={`font-playfair font-bold text-2xl ${isAdmin ? 'text-white' : 'text-roseDD'}`}>
            {tab === "login" ? "Welcome Back 🌸" : tab === "register" ? "Join Floriva 🌺" : "Admin Portal 🛡️"}
          </h1>
          <p className={`text-sm mt-1 ${isAdmin ? 'text-purple-400' : 'text-gray-400'}`}>
            {tab === "login" ? "Sign in to your account" : tab === "register" ? "Create your account for free" : "Restricted — authorised admins only"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-pink-100">
          {["login", "register", "admin"].map((t) => (
            <button key={t} onClick={() => switchTab(t)}
              className={`flex-1 py-3.5 text-[.78rem] font-semibold transition-all ${
                tab === t
                  ? t === "admin"
                    ? "text-purple-700 border-b-2 border-purple-500 bg-purple-50/50"
                    : "text-roseDD border-b-2 border-rose bg-pink-50/50"
                  : "text-gray-400 hover:text-roseD"
              }`}>
              {t === "login" ? "🔑 Sign In" : t === "register" ? "✨ Register" : "🛡️ Admin"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-4">

          {/* Name — register only */}
          {tab === "register" && (
            <div className="flex flex-col gap-1.5" style={{ animation: "fadeSlideIn 0.3s ease both" }}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
              <div className="flex items-center gap-3 border-2 border-pink-100 rounded-xl px-4 py-3 focus-within:border-pink-400 transition-all bg-pink-50/30">
                <span className="text-pink-300">👤</span>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your name"
                  className="flex-1 outline-none text-sm bg-transparent text-gray-700 placeholder-gray-300" />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wide ${isAdmin ? 'text-purple-400' : 'text-gray-500'}`}>Email</label>
            <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-all ${isAdmin ? 'border-purple-800 bg-purple-900/10 focus-within:border-purple-500' : 'border-pink-100 bg-pink-50/30 focus-within:border-pink-400'}`}>
              <span className={isAdmin ? 'text-purple-400' : 'text-pink-300'}>✉️</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                className={`flex-1 outline-none text-sm bg-transparent placeholder-gray-300 ${isAdmin ? 'text-gray-800' : 'text-gray-700'}`} />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wide ${isAdmin ? 'text-purple-400' : 'text-gray-500'}`}>Password</label>
            <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-all ${isAdmin ? 'border-purple-800 bg-purple-900/10 focus-within:border-purple-500' : 'border-pink-100 bg-pink-50/30 focus-within:border-pink-400'}`}>
              <span className={isAdmin ? 'text-purple-400' : 'text-pink-300'}>🔒</span>
              <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange}
                placeholder={tab === "register" ? "Min. 6 characters" : "Your password"}
                className={`flex-1 outline-none text-sm bg-transparent placeholder-gray-300 ${isAdmin ? 'text-gray-800' : 'text-gray-700'}`} />
              <button type="button" onClick={() => setShowPass(v => !v)} className="text-gray-300 hover:text-pink-400 transition text-sm">
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Admin notice — no signup */}
          {isAdmin && (
            <p className="text-[.72rem] text-purple-400 bg-purple-50 border border-purple-100 rounded-xl px-4 py-2.5 text-center">
              🔐 Admin accounts are pre-authorised. No self-registration allowed.
            </p>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 text-xs px-4 py-3 rounded-xl" style={{ animation: "fadeSlideIn 0.2s ease both" }}>
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 text-xs px-4 py-3 rounded-xl" style={{ animation: "fadeSlideIn 0.2s ease both" }}>
              <span>✅</span> {success}
            </div>
          )}

          <button type="submit" disabled={loading}
            className={`w-full text-white font-semibold py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1 ${
              isAdmin
                ? 'bg-gradient-to-br from-purple-700 to-purple-900 hover:shadow-[0_8px_24px_rgba(107,33,168,0.4)]'
                : 'bg-gradient-to-br from-rose to-[#e09099] hover:shadow-[0_8px_24px_rgba(201,132,138,0.4)]'
            }`}>
            {loading
              ? <span className="flex items-center justify-center gap-2"><span className="animate-spin">{isAdmin ? '🛡️' : '🌸'}</span> Please wait...</span>
              : tab === "login" ? "Sign In 🌸" : tab === "register" ? "Create Account 🌺" : "Admin Sign In 🛡️"}
          </button>

          {/* Switch hint — not shown on admin tab */}
          {!isAdmin && (
            <p className="text-center text-xs text-gray-400 mt-1">
              {tab === "login" ? (
                <>Don't have an account?{" "}
                  <button type="button" onClick={() => switchTab("register")} className="text-roseD font-semibold hover:underline">Register here</button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button type="button" onClick={() => switchTab("login")} className="text-roseD font-semibold hover:underline">Sign in</button>
                </>
              )}
            </p>
          )}
        </form>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
