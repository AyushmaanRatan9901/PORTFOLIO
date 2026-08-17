import { useState, useEffect } from "react";
import api from "../../services/api";
import { useProfileContext } from "../../context/ProfileContext";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Download,
  Sparkles,
  Clock,
  HardDrive,
  AlertCircle,
  Loader2,
  Check,
  ExternalLink,
} from "lucide-react";

export default function ResumesAdmin() {
  const { refetchProfile } = useProfileContext();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const [fileTitle, setFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState("");
  const [fileSizeText, setFileSizeText] = useState("");

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/resumes");
      setResumes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setMessage({ type: "error", text: "Failed to load resumes list." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setFileTitle(file.name);

    // Format file size
    const kb = file.size / 1024;
    const mb = kb / 1024;
    const formattedSize =
      mb >= 1 ? `${mb.toFixed(2)} MB` : `${kb.toFixed(1)} KB`;
    setFileSizeText(formattedSize);

    // Read as Base64 string for upload
    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!fileBase64) {
      setMessage({ type: "error", text: "Please select a resume file (PDF or DOCX)." });
      return;
    }

    try {
      setUploading(true);
      setMessage({ type: "", text: "" });

      await api.post("/resumes/upload", {
        file: fileBase64,
        title: fileTitle || selectedFile?.name || "Ayushmaan_Ratan_Resume.pdf",
        fileSize: fileSizeText,
        fileType: selectedFile?.type || "application/pdf",
        makeActive: true,
      });

      setMessage({ type: "success", text: "Resume uploaded successfully & set as Active!" });
      setSelectedFile(null);
      setFileBase64("");
      setFileTitle("");
      setFileSizeText("");

      await fetchResumes();
      await refetchProfile();
    } catch (err) {
      console.error("Upload error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to upload resume.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id) => {
    try {
      setActionLoading(id);
      setMessage({ type: "", text: "" });
      await api.put(`/resumes/${id}/active`);
      setMessage({ type: "success", text: "Resume set as active!" });
      await fetchResumes();
      await refetchProfile();
    } catch (err) {
      console.error("Set active error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to activate resume.",
      });
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      setActionLoading(id);
      setMessage({ type: "", text: "" });
      await api.delete(`/resumes/${id}`);
      setMessage({ type: "success", text: "Resume deleted successfully." });
      await fetchResumes();
      await refetchProfile();
    } catch (err) {
      console.error("Delete error:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete resume.",
      });
    } finally {
      setActionLoading("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <FileText className="text-violet-400" size={32} />
            <span>Resume Management</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload new resume files, switch which resume is <strong className="text-emerald-400">Active</strong>, and manage download files.
          </p>
        </div>
      </div>

      {/* Alert Messages */}
      {message.text && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-rose-500/30 bg-rose-500/10 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={18} className="shrink-0" />
          ) : (
            <AlertCircle size={18} className="shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="card p-6 sm:p-8 border border-slate-800 bg-slate-900/60 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <UploadCloud className="text-violet-400" size={20} />
          <span>Upload New Resume</span>
        </h2>

        <form onSubmit={handleUploadSubmit} className="space-y-5">
          <div className="border-2 border-dashed border-slate-800 hover:border-violet-500/50 rounded-2xl p-6 sm:p-8 text-center transition-colors bg-slate-950/40">
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileSelect}
              className="hidden"
              id="resume-file-input"
            />
            <label
              htmlFor="resume-file-input"
              className="cursor-pointer flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                <UploadCloud size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {selectedFile ? selectedFile.name : "Click to select or drop resume file"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF, DOC, or DOCX (Max size ~10MB)
                </p>
              </div>
            </label>
          </div>

          {selectedFile && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Resume Title / Display Name
                </label>
                <input
                  type="text"
                  value={fileTitle}
                  onChange={(e) => setFileTitle(e.target.value)}
                  placeholder="e.g. Ayushmaan_Ratan_Resume.pdf"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-sm focus:border-violet-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Detected File Size
                </label>
                <div className="w-full px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 text-sm flex items-center gap-2">
                  <HardDrive size={16} className="text-slate-500" />
                  <span>{fileSizeText || "Calculating..."}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="btn btn-primary px-6 py-2.5 text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Uploading to Cloud...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span>Upload & Set Active</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Resumes List */}
      <div className="card p-6 sm:p-8 border border-slate-800 bg-slate-900/60 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="text-sky-400" size={20} />
            <span>Uploaded Resumes ({resumes.length})</span>
          </span>
          <span className="text-xs text-slate-400 font-normal">
            Active resume is downloaded when users click "Download Resume"
          </span>
        </h2>

        {loading ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <Loader2 size={24} className="animate-spin text-violet-400" />
            <p>Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="py-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-white">No resumes uploaded yet.</p>
            <p className="text-xs mt-1">Upload a PDF above to activate dynamic frontend downloads.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((item) => {
              const isActive = item.isActive;
              const isLoadingThis = actionLoading === item._id;

              return (
                <div
                  key={item._id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive
                      ? "border-emerald-500/40 bg-emerald-950/20 shadow-lg shadow-emerald-500/5"
                      : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-3 rounded-xl border shrink-0 ${
                        isActive
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-slate-900 border-slate-800 text-slate-400"
                      }`}
                    >
                      <FileText size={22} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-extrabold text-white">
                          {item.title}
                        </h3>

                        {isActive ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={12} />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400">
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-1.5 flex-wrap">
                        {item.fileSize && (
                          <span className="flex items-center gap-1">
                            <HardDrive size={13} />
                            {item.fileSize}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    {!isActive ? (
                      <button
                        onClick={() => handleSetActive(item._id)}
                        disabled={isLoadingThis}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-50"
                        title="Set as Active Resume for Download"
                      >
                        {isLoadingThis ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        <span>Set Active</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        <span>Currently Active</span>
                      </span>
                    )}

                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                      title="Preview / Download File"
                    >
                      <Download size={15} />
                    </a>

                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      disabled={isLoadingThis}
                      className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
                      title="Delete Resume"
                    >
                      {isLoadingThis ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
