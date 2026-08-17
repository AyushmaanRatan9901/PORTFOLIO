import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useProfileContext } from "../../context/ProfileContext";
import { Layers, MessageSquare, User, Server, ExternalLink, RefreshCw, Activity, FileText } from "lucide-react";

export default function Dashboard() {
  const { profile, isLiveBackend, refetchProfile } = useProfileContext();
  const [projectCount, setProjectCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [projRes, msgRes] = await Promise.allSettled([
        api.get("/projects"),
        api.get("/messages"),
      ]);

      if (projRes.status === "fulfilled") {
        const data = projRes.value.data;
        const list = Array.isArray(data) ? data : data.projects || [];
        setProjectCount(list.length || profile.projects?.length || 0);
      } else {
        setProjectCount(profile.projects?.length || 0);
      }

      if (msgRes.status === "fulfilled") {
        const data = msgRes.value.data;
        const list = Array.isArray(data) ? data : data.messages || [];
        setMessageCount(list.length);
      }
    } catch {
      setProjectCount(profile.projects?.length || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [profile]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Overview</h1>
          <p className="text-sm text-slate-400 mt-1">
            Welcome back, <span className="text-violet-300 font-semibold">{profile.name}</span>. Monitor live messages, manage projects, upload resumes, and update profile data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              loadStats();
              refetchProfile();
            }}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-violet-600/20"
          >
            <span>Live Site</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-3 gap-5">
        <Link
          to="/admin/projects"
          className="card p-6 border border-slate-800 bg-slate-900/60 hover:border-violet-500/40 rounded-2xl transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Projects</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Layers size={20} />
            </div>
          </div>
          <p className="text-4xl font-black text-white">{loading ? "..." : projectCount}</p>
          <span className="text-xs text-slate-500 mt-2 inline-block">Manage projects & media →</span>
        </Link>

        <Link
          to="/admin/messages"
          className="card p-6 border border-slate-800 bg-slate-900/60 hover:border-sky-500/40 rounded-2xl transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Messages</span>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
              <MessageSquare size={20} />
            </div>
          </div>
          <p className="text-4xl font-black text-white">{loading ? "..." : messageCount}</p>
          <span className="text-xs text-slate-500 mt-2 inline-block">View form submissions →</span>
        </Link>

        <div className="card p-6 border border-slate-800 bg-slate-900/60 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Backend System</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Server size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isLiveBackend ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-amber-400"}`} />
            <p className="text-xl font-bold text-white">{isLiveBackend ? "Connected" : "Local Mode"}</p>
          </div>
          <span className="text-xs text-slate-500 mt-2 inline-block">
            {isLiveBackend ? "Express & MongoDB API active" : "Using local static fallback data"}
          </span>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="card p-6 border border-slate-800 bg-slate-900/60 rounded-2xl">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Activity size={18} className="text-violet-400" />
          <span>Quick Admin Navigation</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/admin/resumes"
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-emerald-500/40 transition-colors"
          >
            <FileText className="text-emerald-400 mb-2" size={20} />
            <h3 className="text-sm font-bold text-white">Resumes & Downloads</h3>
            <p className="text-xs text-slate-400 mt-1">Upload resumes, toggle Active status & manage PDF downloads.</p>
          </Link>

          <Link
            to="/admin/profile"
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-violet-500/40 transition-colors"
          >
            <User className="text-violet-400 mb-2" size={20} />
            <h3 className="text-sm font-bold text-white">Live Profile Editor</h3>
            <p className="text-xs text-slate-400 mt-1">Edit name, bio, social handles, certifications & education.</p>
          </Link>

          <Link
            to="/admin/projects"
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-amber-500/40 transition-colors"
          >
            <Layers className="text-amber-400 mb-2" size={20} />
            <h3 className="text-sm font-bold text-white">Manage Projects</h3>
            <p className="text-xs text-slate-400 mt-1">Add, edit, or delete standalone projects and media links.</p>
          </Link>

          <Link
            to="/admin/messages"
            className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-sky-500/40 transition-colors"
          >
            <MessageSquare className="text-sky-400 mb-2" size={20} />
            <h3 className="text-sm font-bold text-white">Contact Submissions</h3>
            <p className="text-xs text-slate-400 mt-1">Read and manage inquiries sent through the contact form.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
