import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Chrome } from "lucide-react";
import { BuddyAvatar } from "../components/BuddyAvatar";

const features = [
  "Unlimited conversations",
  "Advanced AI reasoning",
  "Code, images & voice",
];

function AppleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (tab === "signup" && !name.trim()) e.name = "Your name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/chat");
    }, 1600);
  };

  const handleSocial = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/chat");
    }, 1200);
  };

  return (
    <div
      className="size-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #060d1a 0%, #0b1322 50%, #080f1e 100%)",
      }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute"
          style={{
            width: 500,
            height: 500,
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(79,172,254,0.07) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute"
          style={{
            width: 400,
            height: 400,
            bottom: "-5%",
            left: "30%",
            background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute"
          style={{
            width: 300,
            height: 300,
            top: "40%",
            right: "10%",
            background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(79,172,254,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,172,254,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Phone frame */}
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: "100%",
          maxWidth: 420,
          height: "100%",
          maxHeight: 860,
          background: "linear-gradient(180deg, #0d1624 0%, #0a1018 100%)",
          boxShadow:
            "0 30px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(79,172,254,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
          borderRadius: "clamp(0px, 2vw, 36px)",
          zIndex: 1,
        }}
      >
        {/* Inner grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(79,172,254,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79,172,254,0.025) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            zIndex: 0,
          }}
        />

        {/* Orbs inside */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 300,
            height: 300,
            top: -60,
            right: -80,
            background: "radial-gradient(circle, rgba(79,172,254,0.07) 0%, transparent 65%)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 250,
            height: 250,
            bottom: 80,
            left: -60,
            background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        {/* Scrollable content */}
        <div
          className="flex-1 overflow-y-auto relative z-10 flex flex-col"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Logo section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center pt-10 pb-6 px-6"
          >
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 20 }}
              className="relative mb-4"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #1a2a4a 0%, #0f1f3d 100%)",
                  border: "2px solid rgba(79,172,254,0.35)",
                  boxShadow:
                    "0 0 30px rgba(79,172,254,0.2), 0 0 60px rgba(79,172,254,0.07), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <BuddyAvatar size={60} />
              </div>
              {/* Pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ border: "2px solid rgba(79,172,254,0.3)" }}
              />
            </motion.div>

            {/* App name */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="text-center"
            >
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  background: "linear-gradient(90deg, #7ecfff 0%, #a78bfa 55%, #4facfe 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.1,
                }}
              >
                Buddy AI
              </h1>
              <p
                className="mt-1.5"
                style={{ fontSize: "13px", color: "rgba(100,140,190,0.7)", lineHeight: 1.4 }}
              >
                Your intelligent AI companion
              </p>
            </motion.div>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="flex gap-2 mt-3 flex-wrap justify-center"
            >
              {features.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(79,172,254,0.07)",
                    border: "1px solid rgba(79,172,254,0.14)",
                  }}
                >
                  <Sparkles size={9} style={{ color: "rgba(79,172,254,0.7)" }} />
                  <span style={{ fontSize: "10px", color: "rgba(120,170,230,0.75)", fontWeight: 500 }}>
                    {f}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-5 mb-6 rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(79,172,254,0.1)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Tab switcher */}
            <div
              className="flex relative"
              style={{ borderBottom: "1px solid rgba(79,172,254,0.08)" }}
            >
              {(["login", "signup"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setErrors({}); }}
                  className="flex-1 py-3.5 relative"
                  style={{ fontSize: "14px", fontWeight: 600 }}
                >
                  <span
                    style={{
                      color:
                        tab === t
                          ? "transparent"
                          : "rgba(120,150,190,0.55)",
                      background:
                        tab === t
                          ? "linear-gradient(90deg, #7ecfff 0%, #a78bfa 100%)"
                          : "none",
                      WebkitBackgroundClip: tab === t ? "text" : "unset",
                      WebkitTextFillColor: tab === t ? "transparent" : "unset",
                      backgroundClip: tab === t ? "text" : "unset",
                    }}
                  >
                    {t === "login" ? "Sign In" : "Create Account"}
                  </span>
                  {tab === t && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-4 right-4 rounded-full"
                      style={{
                        height: 2,
                        background: "linear-gradient(90deg, #4facfe 0%, #a78bfa 100%)",
                        boxShadow: "0 0 8px rgba(79,172,254,0.5)",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-5 pt-5 pb-5">
              <AnimatePresence mode="wait">
                {tab === "signup" && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <InputField
                      icon={
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                      }
                      placeholder="Your full name"
                      value={name}
                      onChange={setName}
                      error={errors.name}
                      type="text"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-3">
                <InputField
                  icon={<Mail size={15} />}
                  placeholder="Email address"
                  value={email}
                  onChange={setEmail}
                  error={errors.email}
                  type="email"
                />
              </div>

              <div className="mb-4">
                <InputField
                  icon={<Lock size={15} />}
                  placeholder="Password"
                  value={password}
                  onChange={setPassword}
                  error={errors.password}
                  type={showPass ? "text" : "password"}
                  rightEl={
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      style={{ color: "rgba(100,140,180,0.6)", padding: "2px" }}
                    >
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  }
                />
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between mb-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setRemember((v) => !v)}
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                    style={{
                      background: remember
                        ? "linear-gradient(135deg, #4facfe 0%, #a78bfa 100%)"
                        : "rgba(255,255,255,0.05)",
                      border: remember
                        ? "1px solid rgba(79,172,254,0.5)"
                        : "1px solid rgba(255,255,255,0.12)",
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                  >
                    {remember && (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: "12px", color: "rgba(120,150,190,0.65)" }}>
                    Remember me
                  </span>
                </label>
                {tab === "login" && (
                  <button
                    type="button"
                    style={{ fontSize: "12px", color: "rgba(79,172,254,0.75)", fontWeight: 500 }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className="w-full py-3.5 rounded-xl relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #4facfe 0%, #7c3aed 100%)",
                  boxShadow: "0 0 28px rgba(79,172,254,0.3), 0 4px 16px rgba(124,58,237,0.2)",
                  border: "none",
                  opacity: loading ? 0.85 : 1,
                }}
              >
                {/* Shimmer */}
                <motion.div
                  animate={{ x: ["-120%", "220%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                    transform: "skewX(-15deg)",
                  }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <LoadingDots />
                  ) : (
                    <>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff", letterSpacing: "0.1px" }}>
                        {tab === "login" ? "Sign In to Buddy AI" : "Create My Account"}
                      </span>
                      <ArrowRight size={16} style={{ color: "rgba(255,255,255,0.85)" }} />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 px-5 pb-4">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize: "11px", color: "rgba(100,130,170,0.5)", fontWeight: 500 }}>
                or continue with
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Social */}
            <div className="flex gap-3 px-5 pb-5">
              <SocialButton icon={<Chrome size={16} />} label="Google" onClick={handleSocial} />
              <SocialButton icon={<AppleIcon />} label="Apple" onClick={handleSocial} />
            </div>
          </motion.div>

          {/* Footer switch tab link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-center pb-8 px-6"
            style={{ fontSize: "13px", color: "rgba(100,130,170,0.6)" }}
          >
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setTab(tab === "login" ? "signup" : "login"); setErrors({}); }}
              style={{ color: "rgba(79,172,254,0.85)", fontWeight: 600 }}
            >
              {tab === "login" ? "Sign up free" : "Sign in"}
            </button>
          </motion.p>

          {/* Legal */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center pb-6 px-8"
            style={{ fontSize: "10px", color: "rgba(80,110,150,0.45)", lineHeight: 1.5 }}
          >
            By continuing you agree to our{" "}
            <span style={{ color: "rgba(79,172,254,0.5)" }}>Terms of Service</span> and{" "}
            <span style={{ color: "rgba(79,172,254,0.5)" }}>Privacy Policy</span>
          </motion.p>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function InputField({
  icon,
  placeholder,
  value,
  onChange,
  error,
  type,
  rightEl,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type: string;
  rightEl?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div
        className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: error
            ? "1px solid rgba(239,68,68,0.4)"
            : focused
            ? "1px solid rgba(79,172,254,0.4)"
            : "1px solid rgba(255,255,255,0.08)",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: focused
            ? error
              ? "0 0 0 3px rgba(239,68,68,0.08)"
              : "0 0 0 3px rgba(79,172,254,0.08)"
            : "none",
        }}
      >
        <span style={{ color: error ? "rgba(239,68,68,0.6)" : focused ? "rgba(79,172,254,0.7)" : "rgba(100,130,170,0.5)", transition: "color 0.2s", flexShrink: 0 }}>
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent outline-none"
          style={{
            fontSize: "14px",
            color: "#c8d8f0",
            caretColor: "#4facfe",
          }}
        />
        {rightEl}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="mt-1.5 px-1"
            style={{ fontSize: "11px", color: "rgba(239,68,68,0.75)" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      type="button"
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(180,210,255,0.75)",
        fontSize: "13px",
        fontWeight: 500,
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      {icon}
      {label}
    </motion.button>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.9)" }}
        />
      ))}
    </div>
  );
}
