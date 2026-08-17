import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import api from "../../services/api";
import ThemeToggle from "../../components/ThemeToggle";

const defaultForm = {
  email: "ayushmaanratan9901@gmail.com",
  password: "ayushmaan@9900",
};

export default function Login() {
  const [form, setForm] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      nav("/admin");
    } catch {
      setErr("Invalid admin login or backend not running");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>
      <form onSubmit={submit} className="card p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <span className="h-12 w-12 rounded-full bg-sky-400/10 text-sky-400 flex items-center justify-center">
            <LockKeyhole />
          </span>
          <div>
            <h1 className="text-3xl font-black">Admin Login</h1>
            <p className="text-slate-400 text-sm">
              Only Prince admin account allowed
            </p>
          </div>
        </div>

        <input
          className="input mb-4"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="input mb-4"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn btn-primary w-full justify-center">Login</button>
        {err && <p className="text-red-400 mt-4">{err}</p>}
        <Link to="/" className="block text-center text-sky-400 mt-5">
          Back to Portfolio
        </Link>
      </form>
    </div>
  );
}
