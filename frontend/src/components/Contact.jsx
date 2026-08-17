import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { useProfileContext } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";
import SectionTitle from "./SectionTitle";

export default function Contact() {
  const { profile } = useProfileContext();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Portfolio Contact",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus("Sending...");
    try {
      await api.post("/messages", form);
      setStatus("Message sent successfully");
      setForm({
        name: "",
        email: "",
        subject: "Portfolio Contact",
        message: "",
      });
    } catch {
      setStatus("Backend not connected. Start backend server.");
    } finally {
      setSending(false);
    }
  };

  const infoRows = [
    {
      icon: FaEnvelope,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      icon: FaPhoneAlt,
      label: "Phone",
      value: profile.phone,
      href: `tel:${profile.phone}`,
    },
  ];

  return (
    <section
      id="contact"
      className={`relative py-16 md:py-24 overflow-hidden transition-colors duration-300 ${
        isLight ? "bg-[#F2F3F5] text-[#111827]" : "bg-slate-950/80 text-slate-300"
      }`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionTitle
          tag="Contact"
          title="Let's Work Together"
          desc="Have a project in mind or an opportunity to discuss? I'd love to hear from you."
        />

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-5">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`flex flex-col gap-5 rounded-2xl border p-6 backdrop-blur-md lg:col-span-2 ${
              isLight
                ? "bg-white border-slate-200 shadow-xl text-[#111827]"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            {infoRows.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    isLight
                      ? "bg-amber-500/15 text-amber-600 border border-amber-500/20"
                      : "bg-sky-400/15 text-sky-400 shadow-[0_0_20px_-4px_rgba(14,165,233,0.6)]"
                  }`}
                >
                  <Icon size={16} />
                </span>
                <div>
                  <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
                  <a
                    href={href}
                    className={`text-sm font-semibold transition ${
                      isLight ? "text-black hover:text-amber-600" : "text-slate-200 hover:text-sky-400"
                    }`}
                  >
                    {value}
                  </a>
                </div>
              </div>
            ))}

            <div>
              <p className={`mb-2 text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Find me on</p>
              <div className="flex gap-3">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                    isLight
                      ? "border-slate-300 text-slate-700 hover:border-slate-400 hover:text-black hover:bg-slate-100"
                      : "border-white/10 text-slate-300 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <FaGithub size={18} />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                    isLight
                      ? "border-slate-300 text-slate-700 hover:border-slate-400 hover:text-black hover:bg-slate-100"
                      : "border-white/10 text-slate-300 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <FaLinkedin size={18} />
                </a>
              </div>
            </div>

            <p className={`mt-auto flex items-center gap-2 text-sm ${isLight ? "text-slate-600 font-medium" : "text-slate-400"}`}>
              <FaMapMarkerAlt className="shrink-0 text-amber-500" />
              {profile.location}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`grid gap-4 rounded-2xl border p-6 backdrop-blur-md lg:col-span-3 ${
              isLight
                ? "bg-white border-slate-200 shadow-xl"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <input
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                isLight
                  ? "border-slate-200 bg-slate-50 text-black placeholder:text-slate-400 focus:border-amber-500 focus:bg-white"
                  : "border-white/10 bg-white/[0.04] text-slate-200 placeholder:text-slate-500 focus:border-violet-400/50 focus:bg-white/[0.06]"
              }`}
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                isLight
                  ? "border-slate-200 bg-slate-50 text-black placeholder:text-slate-400 focus:border-amber-500 focus:bg-white"
                  : "border-white/10 bg-white/[0.04] text-slate-200 placeholder:text-slate-500 focus:border-violet-400/50 focus:bg-white/[0.06]"
              }`}
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                isLight
                  ? "border-slate-200 bg-slate-50 text-black placeholder:text-slate-400 focus:border-amber-500 focus:bg-white"
                  : "border-white/10 bg-white/[0.04] text-slate-200 placeholder:text-slate-500 focus:border-violet-400/50 focus:bg-white/[0.06]"
              }`}
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <textarea
              className={`min-h-36 rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
                isLight
                  ? "border-slate-200 bg-slate-50 text-black placeholder:text-slate-400 focus:border-amber-500 focus:bg-white"
                  : "border-white/10 bg-white/[0.04] text-slate-200 placeholder:text-slate-500 focus:border-violet-400/50 focus:bg-white/[0.06]"
              }`}
              placeholder="Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={sending}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r
                         from-amber-500 via-violet-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white
                         transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 shadow-lg shadow-amber-500/20"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
            {status && (
              <p className={`text-center text-sm font-medium ${isLight ? "text-amber-600" : "text-sky-300"}`}>
                {status}
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
