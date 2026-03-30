import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Please fill in all fields.");

    const res = await login(form.email, form.password);

    if (!res.success) return setError(res.message);

    if (res.role !== "admin") {
      return setError("Access denied. This portal is for admins only.");
    }

    navigate("/admin");
  }

  return (
    <div className="min-h-screen bg-[#1a0a2e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm" style={{ animation: "pageIn 0.4s ease both" }}>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-800 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(139,92,246,0.4)]">
            🛡️
          </div>
          <h1 className="font-playfair font-bold text-white text-2xl">Admin Portal</h1>
          <p className="text-purple-400 text-sm mt-1">Restricted access — authorised personnel only</p>
        </div>

        {/* Card */}
        <div className="bg-[#2d1b4e] rounded-2xl p-8 border border-purple-900/50 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-[.7rem] font-semibold text-purple-400 uppercase tracking-widest">Admin Email</label>
              <div className="flex items-center gap-3 border border-purple-700/50 rounded-xl px-4 py-3 focus-within:border-purple-500 transition-all bg-purple-900/20">
                <span className="text-purple-400">✉️</span>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="admin@floriva.com" autoComplete="off"
                  className="flex-1 outline-none text-sm bg-transparent text-white placeholder-purple-700" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[.7rem] font-semibold text-purple-400 uppercase tracking-widest">Password</label>
              <div className="flex items-center gap-3 border border-purple-700/50 rounded-xl px-4 py-3 focus-within:border-purple-500 transition-all bg-purple-900/20">
                <span className="text-purple-400">🔒</span>
                <input name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange}
                  placeholder="••••••••" autoComplete="off"
                  className="flex-1 outline-none text-sm bg-transparent text-white placeholder-purple-700" />
                <button type="button" onClick={() => setShowPass(v => !v)} className="text-purple-600 hover:text-purple-400 transition text-sm">
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 text-red-400 text-xs px-4 py-3 rounded-xl">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-br from-purple-600 to-purple-800 text-white font-semibold py-3.5 rounded-xl text-sm mt-1 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="animate-spin">🛡️</span> Verifying...</span>
                : "Access Dashboard 🛡️"}
            </button>
          </form>
        </div>

        <p className="text-center text-purple-800 text-xs mt-6">
          Not an admin?{" "}
          <button onClick={() => navigate("/auth")} className="text-purple-500 hover:text-purple-300 transition">
            Go to regular login
          </button>
        </p>
      </div>
    </div>
  );
}
