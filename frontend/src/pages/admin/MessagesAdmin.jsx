import { useEffect, useState } from "react";
import api from "../../services/api";
import { MessageSquare, Trash2, Mail, Calendar, RefreshCw, User, CheckCircle2 } from "lucide-react";

export default function MessagesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const loadMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/messages");
      const list = Array.isArray(data) ? data : data.messages || [];
      setItems(list);
    } catch {
      setMsg("Backend message API offline or connecting...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      setMsg("Message deleted successfully");
      await loadMessages();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("Error deleting message: " + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <MessageSquare className="text-sky-400" size={28} />
            <span>Contact Messages ({items.length})</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            View and manage inquiries sent through your portfolio contact form.
          </p>
        </div>

        <button
          onClick={loadMessages}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Messages</span>
        </button>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            msg.includes("successfully") || msg.includes("deleted")
              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
              : "bg-violet-500/15 border border-violet-500/30 text-violet-300"
          }`}
        >
          {msg}
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="card p-12 text-center border border-slate-800 bg-slate-900/40 rounded-2xl">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Messages Received Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            When users submit the contact form on your portfolio, their messages will appear here in real-time.
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {items.map((m) => (
          <div
            key={m._id}
            className="card p-6 border border-slate-800 bg-slate-900/60 rounded-2xl space-y-3 relative group"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold text-sm">
                  {m.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{m.name}</span>
                    {m.subject && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300">
                        {m.subject}
                      </span>
                    )}
                  </h3>
                  <a href={`mailto:${m.email}`} className="text-xs text-sky-400 hover:underline flex items-center gap-1">
                    <Mail size={12} />
                    <span>{m.email}</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {m.createdAt && (
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Calendar size={12} />
                    <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                  </span>
                )}

                <button
                  onClick={() => handleDelete(m._id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Delete Message"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap pt-1">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
