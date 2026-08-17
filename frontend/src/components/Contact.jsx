import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { Send, Sparkles, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

import { useProfileContext } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function Contact() {
  const { profile } = useProfileContext();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [sending, setSending] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    if (profile.email) {
      navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: "info", text: "Sending your message..." });

    try {
      await api.post("/messages", form);
      setStatus({
        type: "success",
        text: "Thank you! Your message has been sent successfully. I will get back to you soon.",
      });
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.warn("Message API fallback alert:", err);
      setStatus({
        type: "error",
        text: "Could not connect to live message server. Please send directly via email.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className={`relative pt-16 pb-24 overflow-hidden transition-colors duration-300 ${
        isLight ? "bg-[#F8F9FA] text-[#111827]" : "bg-slate-950/90 text-slate-300"
      }`}
    >
      {/* Background Ambient Glow Lights */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/10 via-violet-600/10 to-sky-500/10 blur-[130px] rounded-full" />

      {/* Full-width container matching max-w-7xl left-to-right grid */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-extrabold tracking-wider uppercase mb-3 ${
              isLight
                ? "border-amber-600/30 bg-amber-500/10 text-amber-700"
                : "border-amber-500/30 bg-amber-500/10 text-amber-300"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>GET IN TOUCH</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight ${
              isLight ? "text-black" : "text-white"
            }`}
          >
            Let's Build Something{" "}
            <span className="bg-gradient-to-r from-amber-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
              Extraordinary
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`mt-4 text-sm sm:text-base leading-relaxed ${
              isLight ? "text-slate-700 font-medium" : "text-slate-400"
            }`}
          >
            Have a project in mind, mobile app inquiry, or full-stack opportunity? Send me a message below.
          </motion.p>
        </div>

        {/* Full Edge-to-Edge 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* Contact Info Sidebar (Col Span 4) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`lg:col-span-4 flex flex-col justify-between space-y-6 rounded-3xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-300 ${
              isLight
                ? "bg-white border-slate-200 shadow-xl text-[#111827]"
                : "border-slate-800 bg-slate-900/60 shadow-2xl"
            }`}
          >
            <div>
              <h3 className={`text-xl font-black tracking-tight mb-2 ${isLight ? "text-black" : "text-white"}`}>
                Contact Details
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Feel free to reach out directly via email, phone, or connect on my social networks.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {/* Email Card */}
              <div
                onClick={handleCopyEmail}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  isLight
                    ? "bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-amber-500/5"
                    : "bg-slate-950/60 border-slate-800 hover:border-violet-500/40 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                    <FaEnvelope size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Email Address</p>
                    <p className={`text-xs sm:text-sm font-bold truncate ${isLight ? "text-slate-900" : "text-slate-200"}`}>
                      {profile.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-amber-500 transition-colors shrink-0"
                  title="Copy Email Address"
                >
                  {copiedEmail ? <FaCheck size={14} className="text-emerald-500" /> : <FaCopy size={14} />}
                </button>
              </div>

              {/* Phone Card */}
              <a
                href={`tel:${profile.phone}`}
                className={`p-4 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 group ${
                  isLight
                    ? "bg-slate-50 border-slate-200 hover:border-sky-400 hover:bg-sky-500/5"
                    : "bg-slate-950/60 border-slate-800 hover:border-sky-500/40 hover:bg-slate-900"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <FaPhoneAlt size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Phone & WhatsApp</p>
                  <p className={`text-xs sm:text-sm font-bold ${isLight ? "text-slate-900" : "text-slate-200"}`}>
                    {profile.phone}
                  </p>
                </div>
              </a>

              {/* Location Card */}
              <div
                className={`p-4 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 ${
                  isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-slate-800"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Current Location</p>
                  <p className={`text-xs sm:text-sm font-bold ${isLight ? "text-slate-900" : "text-slate-200"}`}>
                    {profile.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Handles */}
            <div className="pt-4 border-t border-slate-800/40">
              <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Connect on Socials</p>
              <div className="flex items-center gap-3">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 ${
                    isLight
                      ? "border-slate-300 bg-white text-slate-800 hover:border-black hover:bg-slate-100"
                      : "border-slate-800 bg-slate-950 text-slate-300 hover:border-white hover:text-white"
                  }`}
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 ${
                    isLight
                      ? "border-slate-300 bg-white text-slate-800 hover:border-sky-600 hover:text-sky-600"
                      : "border-slate-800 bg-slate-950 text-slate-300 hover:border-sky-400 hover:text-sky-400"
                  }`}
                >
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Full Width Contact Form (Col Span 8) */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`lg:col-span-8 flex flex-col justify-between space-y-6 rounded-3xl p-6 sm:p-8 backdrop-blur-xl border transition-all duration-300 w-full ${
              isLight
                ? "bg-white border-slate-200 shadow-xl"
                : "border-slate-800 bg-slate-900/60 shadow-2xl"
            }`}
          >
            <div>
              <h3 className={`text-xl font-black tracking-tight mb-2 ${isLight ? "text-black" : "text-white"}`}>
                Send a Direct Message
              </h3>
              <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                Fill out the fields below and I'll get back to you within 24 hours.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="space-y-4 w-full">
              {/* Row 1: Name & Email side by side spanning full width */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ayushmaan Ratan"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-medium outline-none transition duration-200 ${
                      isLight
                        ? "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                        : "border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 focus:border-violet-500 focus:bg-slate-950 focus:ring-2 focus:ring-violet-500/20"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-medium outline-none transition duration-200 ${
                      isLight
                        ? "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                        : "border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 focus:border-violet-500 focus:bg-slate-950 focus:ring-2 focus:ring-violet-500/20"
                    }`}
                  />
                </div>
              </div>

              {/* Row 2: Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Mobile App Inquiry / Full Stack Opportunity"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-medium outline-none transition duration-200 ${
                    isLight
                      ? "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                      : "border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 focus:border-violet-500 focus:bg-slate-950 focus:ring-2 focus:ring-violet-500/20"
                  }`}
                />
              </div>

              {/* Row 3: Message Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tell me about your project details, timeline, or requirements..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-medium outline-none transition duration-200 resize-none ${
                    isLight
                      ? "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20"
                      : "border-slate-800 bg-slate-950/80 text-white placeholder:text-slate-600 focus:border-violet-500 focus:bg-slate-950 focus:ring-2 focus:ring-violet-500/20"
                  }`}
                />
              </div>
            </div>

            {/* Status Alert Message */}
            {status.text && (
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm font-medium ${
                  status.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : status.type === "error"
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                    : "border-sky-500/30 bg-sky-500/10 text-sky-300"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{status.text}</span>
              </div>
            )}

            {/* Submit Button spanning full width */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r
                           from-amber-500 via-violet-600 to-sky-500 px-6 py-4 text-sm font-black text-white
                           transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 shadow-xl shadow-amber-500/20 cursor-pointer"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
