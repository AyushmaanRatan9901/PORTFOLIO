import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { profile as defaultProfile } from "../data/profile";
import { downloadResume } from "../utils/downloadResume";

const ProfileContext = createContext({
  profile: defaultProfile,
  loading: true,
  isLiveBackend: false,
  refetchProfile: async () => {},
  downloadResume: async () => {},
});

export function ProfileProvider({ children }) {
  const [profileData, setProfileData] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [isLiveBackend, setIsLiveBackend] = useState(false);

  const fetchProfile = async (retryCount = 0) => {
    try {
      setLoading(true);
      const [profileRes, projectsRes, resumeRes] = await Promise.allSettled([
        api.get("/profile"),
        api.get("/projects"),
        api.get("/resumes/active"),
      ]);

      let profileObj = defaultProfile;
      let isLive = false;

      if (profileRes.status === "fulfilled" && profileRes.value?.data?.name) {
        profileObj = { ...profileRes.value.data };
        isLive = true;
      }

      if (resumeRes.status === "fulfilled" && resumeRes.value?.data?.fileUrl) {
        profileObj.resume = resumeRes.value.data.fileUrl;
        isLive = true;
      }

      if (projectsRes.status === "fulfilled" && projectsRes.value?.data?.projects) {
        const rawProjectsList = projectsRes.value.data.projects;
        if (Array.isArray(rawProjectsList) && rawProjectsList.length > 0) {
          const normalizedProjects = rawProjectsList.map((p) => {
            const rawMediaItems = [];

            if (Array.isArray(p.media) && p.media.length > 0) {
              p.media.forEach((m) => {
                const src = typeof m === "string" ? m : m?.src || m?.url || "";
                if (src) {
                  const isVid = (typeof m === "object" && m.type === "video") || Boolean(src.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) || src.includes("/video/upload/"));
                  rawMediaItems.push({
                    type: isVid ? "video" : "image",
                    src,
                  });
                }
              });
            } else {
              (p.images || []).forEach((img) => {
                const src = typeof img === "string" ? img : img?.url || img?.src || "";
                if (src) rawMediaItems.push({ type: "image", src });
              });
              (p.videos || []).forEach((vid) => {
                const src = typeof vid === "string" ? vid : vid?.url || vid?.src || "";
                if (src) rawMediaItems.push({ type: "video", src });
              });
            }

            const seenUrls = new Set();
            const uniqueMedia = [];

            for (const item of rawMediaItems) {
              const urlKey = item.src.trim();
              if (urlKey && !seenUrls.has(urlKey)) {
                seenUrls.add(urlKey);
                uniqueMedia.push(item);
              }
            }

            return {
              _id: p._id,
              name: p.title || p.name,
              concept: p.concept || p.category || "Featured Project",
              year: p.year || "2026",
              role: p.role || "Developer",
              description: p.description,
              technologies: p.technologies || [],
              priority: Number(p.priority) || 0,
              github: p.githubLink || p.github || "",
              liveUrl: p.liveLink || p.liveUrl || "",
              media: uniqueMedia.length > 0
                ? uniqueMedia
                : (p.image ? [{ type: "image", src: p.image }] : []),
            };
          });

          normalizedProjects.sort((a, b) => (Number(a.priority) || 999) - (Number(b.priority) || 999));

          profileObj.projects = normalizedProjects;
          isLive = true;
        }
      }

      setProfileData(profileObj);
      setIsLiveBackend(isLive);

      if (!isLive && retryCount < 2) {
        setTimeout(() => fetchProfile(retryCount + 1), 1000);
      }
    } catch (err) {
      console.warn("Backend API offline or unavailable, using local default profile.");
      setProfileData(defaultProfile);
      setIsLiveBackend(false);
      if (retryCount < 2) {
        setTimeout(() => fetchProfile(retryCount + 1), 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    await downloadResume(profileData.resume);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile: profileData,
        loading,
        isLiveBackend,
        refetchProfile: fetchProfile,
        downloadResume: handleDownload,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  return useContext(ProfileContext);
}
