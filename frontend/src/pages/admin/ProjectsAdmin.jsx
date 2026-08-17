import { useEffect, useState } from "react";
import api from "../../services/api";
import { Plus, Trash2, Edit3, Save, X, ExternalLink, Layers, RefreshCw } from "lucide-react";

export default function ProjectsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    concept: "",
    description: "",
    technologies: "React, Node.js, Express, MongoDB",
    githubLink: "#",
    liveLink: "#",
    image: "",
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/projects");
      const list = Array.isArray(data) ? data : data.projects || [];
      setItems(list);
    } catch {
      setMsg("Backend project API offline or connecting...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title || "",
      concept: p.concept || "",
      description: p.description || "",
      technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies || "",
      githubLink: p.githubLink || p.github || "#",
      liveLink: p.liveLink || p.liveUrl || "#",
      image: p.image || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      concept: "",
      description: "",
      technologies: "React, Node.js, Express, MongoDB",
      githubLink: "#",
      liveLink: "#",
      image: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Saving project...");
    const payload = {
      ...form,
      technologies: form.technologies
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
        setMsg("✓ Project updated successfully!");
      } else {
        await api.post("/projects", payload);
        setMsg("✓ New project created successfully!");
      }
      cancelEdit();
      await loadProjects();
      setTimeout(() => setMsg(""), 3500);
    } catch (err) {
      setMsg("Error saving project: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setMsg("Project deleted");
      await loadProjects();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("Error deleting project: " + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Layers className="text-amber-400" size={28} />
            <span>Manage Projects (CRUD)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create, Edit, or Delete standalone projects in MongoDB.
          </p>
        </div>

        <button
          onClick={loadProjects}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Projects</span>
        </button>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl text-sm font-medium ${
            msg.includes("✓")
              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
              : "bg-violet-500/15 border border-violet-500/30 text-violet-300"
          }`}
        >
          {msg}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="card p-6 border border-slate-800 bg-slate-900/60 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {editingId ? <Edit3 className="text-violet-400" size={16} /> : <Plus className="text-amber-400" size={16} />}
            <span>{editingId ? "Edit Project" : "Add New Project"}</span>
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <X size={14} />
              <span>Cancel Edit</span>
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Project Title</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Avorix Realty"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Concept / Subtitle</label>
            <input
              className="input"
              value={form.concept}
              onChange={(e) => setForm({ ...form, concept: e.target.value })}
              placeholder="e.g. Real Estate & Property Verification"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub Repo Link</label>
            <input
              className="input"
              value={form.githubLink}
              onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Live Demo Link</label>
            <input
              className="input"
              value={form.liveLink}
              onChange={(e) => setForm({ ...form, liveLink: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Preview Image URL</label>
            <input
              className="input"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://placehold.co/..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Technologies Used (Comma Separated)
            </label>
            <input
              className="input"
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
              placeholder="React Native, Expo Router, Node.js, MongoDB"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea
              className="input min-h-20"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detailed description of project functionality..."
              rows={3}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full justify-center gap-2 py-3 text-sm">
          {editingId ? <Save size={16} /> : <Plus size={16} />}
          <span>{editingId ? "Update Project in Database" : "Create Project in Database"}</span>
        </button>
      </form>

      {/* Projects List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Database Projects ({items.length})</h2>

        {items.length === 0 && !loading && (
          <p className="text-slate-400 text-sm italic">No standalone projects in database yet. Create one above!</p>
        )}

        <div className="grid gap-4">
          {items.map((p) => (
            <div
              key={p._id}
              className="card p-5 border border-slate-800 bg-slate-900/60 rounded-2xl flex flex-col sm:flex-row justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <b className="text-base text-white">{p.title}</b>
                  {p.concept && <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">{p.concept}</span>}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>

                {Array.isArray(p.technologies) && p.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-2 text-violet-400 hover:bg-violet-500/10 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Edit"
                  >
                    <Edit3 size={15} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
