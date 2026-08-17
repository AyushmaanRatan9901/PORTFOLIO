import { useState, useEffect } from "react";
import { useProfileContext } from "../../context/ProfileContext";
import api from "../../services/api";
import {
  Save,
  RefreshCw,
  User,
  Globe,
  Layers,
  Award,
  Briefcase,
  GraduationCap,
  BookOpen,
  Plus,
  Trash2,
  Image,
  Video,
  ExternalLink,
  Code2,
  Trophy,
  Upload,
} from "lucide-react";

export default function ProfileAdmin() {
  const { profile, loading, refetchProfile, isLiveBackend } = useProfileContext();
  const [formData, setFormData] = useState({ ...profile });
  const [activeTab, setActiveTab] = useState("contact");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploadingState, setUploadingState] = useState({});

  const syncProjectToDatabase = async (projectObj) => {
    try {
      const payload = {
        title: projectObj.name,
        name: projectObj.name,
        concept: projectObj.concept,
        description: projectObj.description,
        technologies: typeof projectObj.technologies === "string"
          ? projectObj.technologies.split(",").map((s) => s.trim()).filter(Boolean)
          : Array.isArray(projectObj.technologies)
          ? projectObj.technologies
          : [],
        priority: Number(projectObj.priority) || 1,
        githubLink: projectObj.github,
        liveLink: projectObj.liveUrl,
        media: projectObj.media || [],
        images: (projectObj.media || []).filter((m) => m.type === "image").map((m) => ({ url: m.src })),
        videos: (projectObj.media || []).filter((m) => m.type === "video").map((m) => ({ url: m.src })),
      };

      if (projectObj._id && !projectObj._id.startsWith("temp_")) {
        await api.put(`/projects/${projectObj._id}`, payload);
      } else {
        const res = await api.post("/projects", payload);
        if (res.data?.project?._id) {
          projectObj._id = res.data.project._id;
        }
      }
    } catch (err) {
      console.warn("Sync project error:", err?.message || err);
    }
  };

  const handleFileUploadToCloudinary = async (projIndex, mediaIndex, file, type) => {
    if (!file) return;
    const key = `${projIndex}-${mediaIndex}`;
    setUploadingState((prev) => ({ ...prev, [key]: "Uploading to Cloudinary..." }));

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result;
          const res = await api.post("/upload", {
            file: base64Data,
            resource_type: type === "video" ? "video" : "image",
            folder: "portfolio/projects",
          });

          if (res.data?.url) {
            updateProjectMedia(projIndex, mediaIndex, "src", res.data.url);
            setUploadingState((prev) => ({ ...prev, [key]: "✓ Uploaded to Cloudinary" }));

            // Immediately save to MongoDB & refetch
            setFormData((latest) => {
              const currentProj = latest.projects?.[projIndex];
              if (currentProj) {
                syncProjectToDatabase(currentProj).then(() => {
                  api.put("/profile", latest).then(() => refetchProfile());
                });
              }
              return latest;
            });

            setTimeout(() => {
              setUploadingState((prev) => ({ ...prev, [key]: null }));
            }, 3000);
          }
        } catch (err) {
          setUploadingState((prev) => ({
            ...prev,
            [key]: "Upload error: " + (err.response?.data?.message || err.message),
          }));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadingState((prev) => ({ ...prev, [key]: "Error reading file" }));
    }
  };

  const handleMultipleFilesUploadToCloudinary = async (projIndex, files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const total = fileArray.length;

    setMsg(`Reading and processing ${total} media files...`);

    try {
      // Step 1: Read all files to base64 Data URLs locally first
      const readPromises = fileArray.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const isVideo = file.type.startsWith("video");
            resolve({
              fileObj: file,
              type: isVideo ? "video" : "image",
              src: reader.result,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const localMediaItems = await Promise.all(readPromises);

      // Step 2: Instantly add all items to formData so user sees them immediately in UI
      setFormData((prev) => {
        const updatedProjects = [...(prev.projects || [])];
        const existingMedia = updatedProjects[projIndex]?.media || [];
        const newMediaList = localMediaItems.map((item) => ({
          type: item.type,
          src: item.src,
        }));

        updatedProjects[projIndex] = {
          ...updatedProjects[projIndex],
          media: [...existingMedia, ...newMediaList],
        };
        return { ...prev, projects: updatedProjects };
      });

      setMsg(`✓ Added ${total} items locally. Uploading to Cloudinary CDN in background...`);

      // Step 3: Background Cloudinary upload to replace Data URLs with HTTPS URLs
      let successCount = 0;
      for (let i = 0; i < localMediaItems.length; i++) {
        const item = localMediaItems[i];
        try {
          const res = await api.post("/upload", {
            file: item.src,
            resource_type: item.type === "video" ? "video" : "image",
            folder: "portfolio/projects",
          });

          if (res.data?.url) {
            successCount++;
            setFormData((prev) => {
              const updatedProjects = [...(prev.projects || [])];
              const mediaList = [...(updatedProjects[projIndex]?.media || [])];
              const matchIndex = mediaList.findIndex((m) => (m.src || m) === item.src);
              if (matchIndex !== -1) {
                mediaList[matchIndex] = { type: item.type, src: res.data.url };
                updatedProjects[projIndex] = {
                  ...updatedProjects[projIndex],
                  media: mediaList,
                };
              }
              return { ...prev, projects: updatedProjects };
            });
          }
        } catch (uploadErr) {
          console.warn("Cloudinary background upload failed for item, keeping local media:", uploadErr);
        }
      }

      setMsg(`✓ Successfully added & uploaded ${total} media items to Cloudinary! Saving to database...`);
      setFormData((latest) => {
        const currentProj = latest.projects?.[projIndex];
        if (currentProj) {
          syncProjectToDatabase(currentProj).then(() => {
            api.put("/profile", latest).then(() => refetchProfile());
          });
        }
        return latest;
      });
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      setMsg("Error processing multiple files: " + (err.message || err));
    }
  };

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        projects: profile.projects || [],
        certifications: profile.certifications || [],
        experience: profile.experience || [],
        education: profile.education || [],
        coursework: profile.coursework || [],
        achievements: profile.achievements || [],
        languages: profile.languages || ["English", "Hindi"],
      });
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* Project Handlers */
  const addProject = () => {
    const newProj = {
      name: "New Project",
      concept: "Web / Mobile Application",
      description: "Detailed description of your new project...",
      technologies: ["React", "Node.js"],
      github: "https://github.com/",
      liveUrl: "https://",
      media: [{ type: "image", src: "https://placehold.co/390x844/1a1a1a/e5c158?text=Project+Preview" }],
    };
    setFormData((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), newProj],
    }));
  };

  const updateProject = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.projects || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const moveProjectUp = (index) => {
    if (index === 0) return;
    setFormData((prev) => {
      const updated = [...(prev.projects || [])];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      const reordered = updated.map((p, i) => ({ ...p, priority: i + 1 }));
      const newState = { ...prev, projects: reordered };

      // Auto-sync new priority order to MongoDB
      Promise.all(reordered.map((p) => syncProjectToDatabase(p)))
        .then(() => api.put("/profile", newState))
        .then(() => refetchProfile())
        .catch((e) => console.warn("Priority sync error:", e));

      return newState;
    });
  };

  const moveProjectDown = (index) => {
    setFormData((prev) => {
      const updated = [...(prev.projects || [])];
      if (index >= updated.length - 1) return prev;
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      const reordered = updated.map((p, i) => ({ ...p, priority: i + 1 }));
      const newState = { ...prev, projects: reordered };

      // Auto-sync new priority order to MongoDB
      Promise.all(reordered.map((p) => syncProjectToDatabase(p)))
        .then(() => api.put("/profile", newState))
        .then(() => refetchProfile())
        .catch((e) => console.warn("Priority sync error:", e));

      return newState;
    });
  };

  const removeProject = async (index) => {
    const projToDelete = formData.projects?.[index];
    if (projToDelete?._id && !projToDelete._id.startsWith("temp_")) {
      try {
        await api.delete(`/projects/${projToDelete._id}`);
      } catch (err) {
        console.warn("Delete project API error:", err);
      }
    }
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const addMediaToProject = (projIndex, type) => {
    setFormData((prev) => {
      const updated = [...(prev.projects || [])];
      const mediaList = updated[projIndex].media || [];
      updated[projIndex] = {
        ...updated[projIndex],
        media: [...mediaList, { type, src: "" }],
      };
      return { ...prev, projects: updated };
    });
  };

  const updateProjectMedia = (projIndex, mediaIndex, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.projects || [])];
      const mediaList = [...(updated[projIndex]?.media || [])];
      const existing = mediaList[mediaIndex];
      const currentObj =
        typeof existing === "string"
          ? { type: "image", src: existing }
          : existing || { type: "image", src: "" };
      mediaList[mediaIndex] = { ...currentObj, [field]: value };
      updated[projIndex] = { ...updated[projIndex], media: mediaList };
      return { ...prev, projects: updated };
    });
  };

  const removeProjectMedia = (projIndex, mediaIndex) => {
    setFormData((prev) => {
      const updated = [...(prev.projects || [])];
      updated[projIndex] = {
        ...updated[projIndex],
        media: updated[projIndex].media.filter((_, i) => i !== mediaIndex),
      };
      return { ...prev, projects: updated };
    });
  };

  /* Certification Handlers */
  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        { name: "New Certification", link: "https://" },
      ],
    }));
  };

  const updateCertification = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.certifications || [])];
      if (typeof updated[index] === "string") {
        updated[index] = { name: updated[index], link: "#" };
      }
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, certifications: updated };
    });
  };

  const removeCertification = (index) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  /* Education Handlers */
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          degree: "Degree / Course Name",
          college: "Institution / College Name",
          duration: "2022 – 2026",
          score: "CGPA: 8.0",
        },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.education || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  /* Achievement Handlers */
  const addAchievement = () => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), "New Key Achievement / Highlight"],
    }));
  };

  const updateAchievement = (index, value) => {
    setFormData((prev) => {
      const updated = [...(prev.achievements || [])];
      updated[index] = value;
      return { ...prev, achievements: updated };
    });
  };

  const removeAchievement = (index) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  /* Stats Handlers */
  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      stats: [
        ...(prev.stats || []),
        { label: "New Metric", value: "1+", color: "violet" },
      ],
    }));
  };

  const updateStat = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.stats || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, stats: updated };
    });
  };

  const removeStat = (index) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  /* Experience Handlers */
  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          role: "New Role",
          company: "Company Name",
          date: "2024 – Present",
          badge: "Full-Time",
          color: "violet",
          points: ["Responsible for building features."],
        },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.experience || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  /* Form Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("Saving live portfolio data to MongoDB...");
    try {
      const payload = {
        ...formData,
        projects: (formData.projects || [])
          .map((proj, idx) => ({
            ...proj,
            priority: Number(proj.priority) || idx + 1,
            media: (proj.media || []).map((m) => {
              if (typeof m === "string") return { type: "image", src: m };
              return {
                type: m.type || "image",
                src: typeof m.src === "string" ? m.src : m.src?.url || m.src?.src || "",
              };
            }),
            technologies: typeof proj.technologies === "string"
              ? proj.technologies.split(",").map((s) => s.trim()).filter(Boolean)
              : Array.isArray(proj.technologies)
              ? proj.technologies
              : [],
          }))
          .sort((a, b) => a.priority - b.priority),
      };

      await api.put("/profile", payload);

      // Sync individual projects directly into MongoDB projects collection
      for (const proj of payload.projects) {
        const projectDoc = {
          title: proj.name,
          concept: proj.concept,
          description: proj.description,
          technologies: proj.technologies,
          githubLink: proj.github,
          liveLink: proj.liveUrl,
          media: proj.media,
          images: (proj.media || []).filter((m) => m.type === "image").map((m) => ({ url: m.src })),
          videos: (proj.media || []).filter((m) => m.type === "video").map((m) => ({ url: m.src })),
        };

        try {
          if (proj._id && !proj._id.startsWith("temp_")) {
            await api.put(`/projects/${proj._id}`, projectDoc);
          } else {
            await api.post("/projects", projectDoc);
          }
        } catch (projSyncErr) {
          console.warn("Direct project collection sync notice:", projSyncErr?.message || projSyncErr);
        }
      }

      await refetchProfile();
      setMsg("✓ Live Portfolio & Projects Collection updated successfully!");
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      setMsg("Error saving live data: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <span>Portfolio Master Admin</span>
            <span
              className={`text-xs px-3 py-1 rounded-full font-mono font-medium ${
                loading
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30 animate-pulse"
                  : isLiveBackend
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {loading
                ? "● Connecting to Live MongoDB..."
                : isLiveBackend
                ? "● Live MongoDB Mode"
                : "○ Fallback Local Mode"}
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage projects, bio, photos, videos, education, certifications with URLs, and coursework in real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={refetchProfile}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
        >
          <RefreshCw size={14} />
          <span>Reload Live Data</span>
        </button>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl mb-6 text-sm font-medium ${
            msg.includes("✓")
              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
              : "bg-violet-500/15 border border-violet-500/30 text-violet-300"
          }`}
        >
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-3">
        {[
          { id: "contact", label: "Contact & Bio", icon: User },
          { id: "stats", label: `Quick Stats Cards (${formData.stats?.length || 0})`, icon: Trophy },
          { id: "projects", label: `Projects (${formData.projects?.length || 0})`, icon: Layers },
          { id: "education", label: `Education & Coursework (${formData.education?.length || 0})`, icon: GraduationCap },
          { id: "certifications", label: `Certifications & Highlights`, icon: Award },
          { id: "experience", label: `Experience (${formData.experience?.length || 0})`, icon: Briefcase },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: Contact & Social Info */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div className="card p-6 border border-slate-800 bg-slate-900/60 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User size={18} className="text-violet-400" />
                <span>Contact Details & Executive Bio</span>
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                  <input
                    className="input"
                    value={formData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Professional Title</label>
                  <input
                    className="input"
                    value={formData.role || ""}
                    onChange={(e) => handleChange("role", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Contact Email</label>
                  <input
                    className="input"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
                  <input
                    className="input"
                    value={formData.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
                  <input
                    className="input"
                    value={formData.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Languages Spoken (Comma Separated)</label>
                  <input
                    className="input"
                    value={Array.isArray(formData.languages) ? formData.languages.join(", ") : formData.languages || ""}
                    onChange={(e) =>
                      handleChange(
                        "languages",
                        e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                      )
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Bio Summary (About Me)</label>
                  <textarea
                    className="input min-h-24"
                    value={formData.summary || ""}
                    onChange={(e) => handleChange("summary", e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="card p-6 border border-slate-800 bg-slate-900/60 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Globe size={18} className="text-sky-400" />
                <span>Social Handles & Resume Link</span>
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub URL</label>
                  <input
                    className="input"
                    value={formData.github || ""}
                    onChange={(e) => handleChange("github", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">LinkedIn URL</label>
                  <input
                    className="input"
                    value={formData.linkedin || ""}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">LeetCode URL</label>
                  <input
                    className="input"
                    value={formData.leetcode || ""}
                    onChange={(e) => handleChange("leetcode", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Resume File Link / Path</label>
                  <input
                    className="input"
                    value={
                      typeof formData.resume === "object"
                        ? formData.resume?.url || ""
                        : formData.resume || ""
                    }
                    onChange={(e) => handleChange("resume", e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Profile Photo URL / Cloudinary Image Link
                  </label>
                  <input
                    className="input"
                    value={
                      typeof formData.avatar === "object"
                        ? formData.avatar?.url || formData.avatar?.src || ""
                        : formData.avatar || ""
                    }
                    onChange={(e) => handleChange("avatar", e.target.value)}
                    placeholder="https://res.cloudinary.com/... or /src/assets/..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Quick Stats Cards */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="text-amber-400" size={18} />
                <span>Quick Stats Metrics Cards</span>
              </h2>
              <button
                type="button"
                onClick={addStat}
                className="btn btn-primary text-xs flex items-center gap-1 py-2 px-3"
              >
                <Plus size={14} />
                <span>Add Metric Card</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {formData.stats?.map((st, sIdx) => (
                <div
                  key={sIdx}
                  className="card p-5 border border-slate-800 bg-slate-900/60 rounded-2xl space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-amber-300">
                      Metric #{sIdx + 1}: {st.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeStat(sIdx)}
                      className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Metric Name / Label
                      </label>
                      <input
                        className="input text-xs py-1.5"
                        placeholder="e.g. Experiences, Companies"
                        value={st.label || ""}
                        onChange={(e) => updateStat(sIdx, "label", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Value / Count
                      </label>
                      <input
                        className="input text-xs py-1.5"
                        placeholder="e.g. 5+, 2+, 10+"
                        value={st.value || ""}
                        onChange={(e) => updateStat(sIdx, "value", e.target.value)}
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Accent Theme Color
                      </label>
                      <select
                        className="input text-xs py-1.5"
                        value={st.color || "violet"}
                        onChange={(e) => updateStat(sIdx, "color", e.target.value)}
                      >
                        <option value="violet">Violet / Indigo</option>
                        <option value="amber">Amber / Orange</option>
                        <option value="emerald">Emerald / Teal</option>
                        <option value="sky">Sky / Blue</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Education & Coursework */}
        {activeTab === "education" && (
          <div className="space-y-6">
            <div className="card p-6 border border-slate-800 bg-slate-900/60 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="text-emerald-400" size={18} />
                <span>Core CS Coursework</span>
              </h2>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Subjects & Courses (Comma Separated)
                </label>
                <input
                  className="input"
                  value={Array.isArray(formData.coursework) ? formData.coursework.join(", ") : formData.coursework || ""}
                  onChange={(e) =>
                    handleChange(
                      "coursework",
                      e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="Data Structures, Algorithms, DBMS, Operating Systems"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="text-amber-400" size={18} />
                <span>Education Timeline Items</span>
              </h2>
              <button
                type="button"
                onClick={addEducation}
                className="btn btn-primary text-xs flex items-center gap-1 py-2 px-3"
              >
                <Plus size={14} />
                <span>Add Education Entry</span>
              </button>
            </div>

            {formData.education?.map((edu, eIdx) => (
              <div
                key={eIdx}
                className="card p-5 border border-slate-800 bg-slate-900/60 rounded-2xl space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-300">
                    Education #{eIdx + 1}: {edu.degree}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeEducation(eIdx)}
                    className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Degree Title</label>
                    <input
                      className="input text-xs py-1.5"
                      value={edu.degree || ""}
                      onChange={(e) => updateEducation(eIdx, "degree", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">College / Institution</label>
                    <input
                      className="input text-xs py-1.5"
                      value={edu.college || ""}
                      onChange={(e) => updateEducation(eIdx, "college", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Duration</label>
                    <input
                      className="input text-xs py-1.5"
                      value={edu.duration || ""}
                      onChange={(e) => updateEducation(eIdx, "duration", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Score / Percentage</label>
                    <input
                      className="input text-xs py-1.5"
                      value={edu.score || ""}
                      onChange={(e) => updateEducation(eIdx, "score", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Projects & Media Manager */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="text-amber-400" size={18} />
                <span>Live Projects List</span>
              </h2>
              <button
                type="button"
                onClick={addProject}
                className="btn btn-primary text-xs flex items-center gap-1 py-2 px-3"
              >
                <Plus size={14} />
                <span>Add New Project</span>
              </button>
            </div>

            {formData.projects?.map((proj, pIdx) => (
              <div
                key={pIdx}
                className="card p-6 border border-slate-800 bg-slate-900/60 rounded-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 text-xs font-black rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Order #{proj.priority || pIdx + 1}
                    </span>
                    <span className="text-sm font-bold text-violet-300">
                      {proj.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={pIdx === 0}
                      onClick={() => moveProjectUp(pIdx)}
                      className="px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg transition-colors flex items-center gap-1 font-bold"
                      title="Move Project Up"
                    >
                      ▲ Up
                    </button>
                    <button
                      type="button"
                      disabled={pIdx === (formData.projects?.length || 0) - 1}
                      onClick={() => moveProjectDown(pIdx)}
                      className="px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg transition-colors flex items-center gap-1 font-bold"
                      title="Move Project Down"
                    >
                      ▼ Down
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProject(pIdx)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-2"
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-400 mb-1">
                      Display Order (#1, #2, #3...)
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="input border-amber-500/40 text-amber-300 font-bold"
                      value={proj.priority || pIdx + 1}
                      onChange={(e) => updateProject(pIdx, "priority", parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Project Name</label>
                    <input
                      className="input"
                      value={proj.name || ""}
                      onChange={(e) => updateProject(pIdx, "name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Concept / Subtitle</label>
                    <input
                      className="input"
                      value={proj.concept || ""}
                      onChange={(e) => updateProject(pIdx, "concept", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">GitHub Repo Link</label>
                    <input
                      className="input"
                      value={proj.github || ""}
                      onChange={(e) => updateProject(pIdx, "github", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Live Demo Link</label>
                    <input
                      className="input"
                      value={proj.liveUrl || ""}
                      onChange={(e) => updateProject(pIdx, "liveUrl", e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Technologies (comma separated)
                    </label>
                    <input
                      className="input"
                      placeholder="React Native, Node.js, Express.js, MongoDB"
                      value={
                        typeof proj.technologies === "string"
                          ? proj.technologies
                          : Array.isArray(proj.technologies)
                          ? proj.technologies.join(", ")
                          : ""
                      }
                      onChange={(e) => updateProject(pIdx, "technologies", e.target.value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Project Description</label>
                    <textarea
                      className="input min-h-20"
                      value={proj.description || ""}
                      onChange={(e) => updateProject(pIdx, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Project Photos & Videos List */}
                <div className="border-t border-slate-800/80 pt-4 mt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-300">
                      Photos & Videos ({proj.media?.length || 0})
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 via-violet-600 to-sky-500 text-white shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer">
                        <Upload size={13} />
                        <span>Upload Multiple Files</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(e) =>
                            handleMultipleFilesUploadToCloudinary(pIdx, e.target.files)
                          }
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => addMediaToProject(pIdx, "image")}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1 hover:bg-sky-500/30"
                      >
                        <Image size={12} />
                        <span>Add Photo URL</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addMediaToProject(pIdx, "video")}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1 hover:bg-violet-500/30"
                      >
                        <Video size={12} />
                        <span>Add Video URL</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {proj.media?.map((m, mIdx) => {
                      const statusKey = `${pIdx}-${mIdx}`;
                      const statusMsg = uploadingState[statusKey];
                      const mediaSrc = typeof m === "string" ? m : m.src || "";
                      const mediaType = typeof m === "object" && m.type ? m.type : "image";

                      return (
                        <div key={mIdx} className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <select
                              className="input w-28 text-xs py-1.5"
                              value={mediaType}
                              onChange={(e) => updateProjectMedia(pIdx, mIdx, "type", e.target.value)}
                            >
                              <option value="image">Photo</option>
                              <option value="video">Video</option>
                            </select>

                            <input
                              className="input flex-1 min-w-[200px] text-xs py-1.5"
                              placeholder="Cloudinary / Image / Video URL or upload file below..."
                              value={mediaSrc}
                              onChange={(e) => updateProjectMedia(pIdx, mIdx, "src", e.target.value)}
                            />

                            <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold hover:bg-sky-500/30 flex items-center gap-1.5 shrink-0 transition-colors">
                              <Upload size={13} />
                              <span>Upload File</span>
                              <input
                                type="file"
                                accept={mediaType === "video" ? "video/*" : "image/*"}
                                className="hidden"
                                onChange={(e) =>
                                  handleFileUploadToCloudinary(pIdx, mIdx, e.target.files?.[0], mediaType)
                                }
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => removeProjectMedia(pIdx, mIdx)}
                              className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg shrink-0 transition-colors"
                              title="Delete Media Item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          {/* Uploading Status Message */}
                          {statusMsg && (
                            <p className={`text-[11px] font-medium font-mono ${statusMsg.includes("✓") ? "text-emerald-400" : "text-amber-400 animate-pulse"}`}>
                              {statusMsg}
                            </p>
                          )}

                          {/* Live Thumbnail Preview */}
                          {mediaSrc && (
                            <div className="flex items-center gap-3 pt-1 border-t border-slate-900">
                              {mediaType === "video" ? (
                                <video
                                  src={mediaSrc}
                                  className="w-16 h-16 rounded-lg object-cover border border-slate-800 bg-black"
                                  controls
                                />
                              ) : (
                                <img
                                  src={mediaSrc}
                                  alt="Preview"
                                  className="w-16 h-16 rounded-lg object-cover border border-slate-800 bg-black"
                                />
                              )}
                              <div className="text-[11px]">
                                <span className="block text-slate-300 font-semibold uppercase">
                                  {mediaType} PREVIEW
                                </span>
                                <span className="block text-slate-500 truncate max-w-md font-mono text-[10px]">
                                  {mediaSrc}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: Certifications & Key Highlights */}
        {activeTab === "certifications" && (
          <div className="space-y-6">
            {/* Certifications Manager */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="text-emerald-400" size={18} />
                  <span>Certifications & Verification Links</span>
                </h2>
                <button
                  type="button"
                  onClick={addCertification}
                  className="btn btn-primary text-xs flex items-center gap-1 py-2 px-3"
                >
                  <Plus size={14} />
                  <span>Add Certification</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.certifications?.map((cert, cIdx) => {
                  const certName = typeof cert === "string" ? cert : cert.name || "";
                  const certLink = typeof cert === "string" ? "#" : cert.link || "";

                  return (
                    <div
                      key={cIdx}
                      className="card p-4 border border-slate-800 bg-slate-900/60 rounded-xl flex flex-wrap sm:flex-nowrap items-center gap-3"
                    >
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Certification Title
                        </label>
                        <input
                          className="input text-xs py-1.5"
                          value={certName}
                          onChange={(e) => updateCertification(cIdx, "name", e.target.value)}
                          placeholder="Certification Title"
                          required
                        />
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Verification Link (URL)
                        </label>
                        <input
                          className="input text-xs py-1.5"
                          value={certLink}
                          onChange={(e) => updateCertification(cIdx, "link", e.target.value)}
                          placeholder="https://..."
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeCertification(cIdx)}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg self-end"
                        title="Remove Certification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Highlights / Achievements */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="text-amber-400" size={18} />
                  <span>Key Highlights & Achievements</span>
                </h2>
                <button
                  type="button"
                  onClick={addAchievement}
                  className="btn btn-primary text-xs flex items-center gap-1 py-2 px-3"
                >
                  <Plus size={14} />
                  <span>Add Highlight</span>
                </button>
              </div>

              <div className="space-y-2">
                {formData.achievements?.map((ach, aIdx) => (
                  <div key={aIdx} className="flex items-center gap-2">
                    <input
                      className="input text-xs py-1.5 flex-1"
                      value={ach}
                      onChange={(e) => updateAchievement(aIdx, e.target.value)}
                      placeholder="Highlight bullet point..."
                    />
                    <button
                      type="button"
                      onClick={() => removeAchievement(aIdx)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Experience Manager */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="text-violet-400" size={18} />
                <span>Work Experience Timeline</span>
              </h2>
              <button
                type="button"
                onClick={addExperience}
                className="btn btn-primary text-xs flex items-center gap-1 py-2 px-3"
              >
                <Plus size={14} />
                <span>Add Experience</span>
              </button>
            </div>

            {formData.experience?.map((exp, eIdx) => (
              <div
                key={eIdx}
                className="card p-5 border border-slate-800 bg-slate-900/60 rounded-2xl space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-300">
                    Experience #{eIdx + 1}: {exp.role} at {exp.company}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExperience(eIdx)}
                    className="p-1 text-rose-400 hover:bg-rose-500/10 rounded"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Job Title</label>
                    <input
                      className="input text-xs py-1.5"
                      value={exp.role || ""}
                      onChange={(e) => updateExperience(eIdx, "role", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Company Name</label>
                    <input
                      className="input text-xs py-1.5"
                      value={exp.company || ""}
                      onChange={(e) => updateExperience(eIdx, "company", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Date Duration</label>
                    <input
                      className="input text-xs py-1.5"
                      value={exp.date || ""}
                      onChange={(e) => updateExperience(eIdx, "date", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Badge Tag</label>
                    <input
                      className="input text-xs py-1.5"
                      value={exp.badge || ""}
                      onChange={(e) => updateExperience(eIdx, "badge", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save Bar */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-full justify-center gap-2 py-3.5 text-sm font-bold shadow-xl shadow-violet-600/20"
          >
            {saving ? <RefreshCw className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Saving All Live Portfolio Changes..." : "Save Live Portfolio Data to Backend"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
