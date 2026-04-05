import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Crown,
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  LogOut,
  Pencil,
  User,
} from "lucide-react";

interface StoredPlan {
  tier: "basic" | "pro";
  code: "basic" | "1w" | "1m" | "6m";
  label: string;
  expiresAt?: string;
  firstOfferUsed?: boolean;
}

interface UserProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  onUpgradeClick: () => void;
  isPro?: boolean;
  currentPlan: StoredPlan;
}

export function UserProfileDrawer({
  open,
  onClose,
  onUpgradeClick,
  isPro = false,
  currentPlan,
}: UserProfileDrawerProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem("buddy_notifications") !== "off";
  });

  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem("buddy_profile_name") || "Raja";
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(profileName);

  const planExpiryText = useMemo(() => {
    if (!currentPlan.expiresAt) return "No expiry";
    return new Date(currentPlan.expiresAt).toLocaleDateString();
  }, [currentPlan.expiresAt]);

  const toggleNotifications = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    localStorage.setItem("buddy_notifications", next ? "on" : "off");
    alert(next ? "Notifications on panniten da 🔔" : "Notifications off panniten da");
  };

  const openPrivacy = () => {
    alert(
      "Privacy & Security:\n\n• Local chat history save aagum\n• Plan info localStorage la save aagum\n• Uploaded files server uploads folder la save aagum\n• Important personal info share panna careful ah iru da"
    );
  };

  const openHelp = () => {
    alert(
      "Help & Support:\n\n• File upload issue na browser refresh pannu\n• Voice issue na Chrome use pannu\n• Server start aagala na node server.js run pannu\n• Frontend ku npm run dev use pannu"
    );
  };

  const sendFeedback = () => {
    const feedback = prompt("Un feedback type pannu da:");
    if (!feedback?.trim()) return;

    const old = JSON.parse(localStorage.getItem("buddy_feedbacks") || "[]");
    const updated = [
      {
        text: feedback.trim(),
        createdAt: new Date().toISOString(),
      },
      ...old,
    ];
    localStorage.setItem("buddy_feedbacks", JSON.stringify(updated));
    alert("Feedback save panniten da 💙");
  };

  const handleLogout = () => {
    localStorage.removeItem("buddy_session");
    alert("Logout complete da");
    window.location.href = "/";
  };

  const saveName = () => {
    const finalName = draftName.trim();
    if (!finalName) return;
    setProfileName(finalName);
    localStorage.setItem("buddy_profile_name", finalName);
    setIsEditingName(false);
    alert("Profile name update panniten da ✅");
  };

  const settingRow = (
    icon: React.JSX.Element,
    title: string,
    subtitle: string,
    onClick: () => void
  ) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: "rgba(79,172,254,0.10)",
          border: "1px solid rgba(79,172,254,0.16)",
          color: "#7ecfff",
        }}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div style={{ color: "#ddeeff", fontSize: "13px", fontWeight: 700 }}>
          {title}
        </div>
        <div
          style={{
            color: "rgba(170,190,220,0.68)",
            fontSize: "11px",
            marginTop: 2,
          }}
        >
          {subtitle}
        </div>
      </div>

      <ChevronRight size={15} style={{ color: "rgba(170,190,220,0.5)" }} />
    </button>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-30"
            style={{
              background: "rgba(4,8,18,0.72)",
              backdropFilter: "blur(6px)",
            }}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute right-0 top-0 bottom-0 z-40 flex flex-col"
            style={{
              width: "84%",
              background: "linear-gradient(180deg, #0d1523 0%, #0a1020 100%)",
              borderLeft: "1px solid rgba(79, 172, 254, 0.12)",
              boxShadow: "-4px 0 40px rgba(0,0,0,0.6)",
            }}
          >
            <style>{`
              .buddy-hide-scrollbar {
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              .buddy-hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(79, 172, 254, 0.08)" }}
            >
              <div>
                <div
                  style={{
                    color: "#e2e8f0",
                    fontSize: "17px",
                    fontWeight: 800,
                  }}
                >
                  Profile
                </div>
                <div
                  style={{
                    color: "rgba(120,160,210,0.66)",
                    fontSize: "11px",
                    marginTop: 2,
                  }}
                >
                  User profile, settings, plan, support
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(150, 180, 220, 0.7)",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-4 buddy-hide-scrollbar">
              <div
                className="rounded-3xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(79,172,254,0.20), rgba(124,58,237,0.18))",
                      border: "1px solid rgba(79,172,254,0.18)",
                    }}
                  >
                    <User size={24} style={{ color: "#7ecfff" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    {!isEditingName ? (
                      <>
                        <div
                          style={{
                            color: "#ddeeff",
                            fontSize: "16px",
                            fontWeight: 800,
                          }}
                        >
                          {profileName}
                        </div>

                        <div
                          style={{
                            color: "rgba(180,200,230,0.70)",
                            fontSize: "11px",
                            marginTop: 3,
                          }}
                        >
                          Buddy AI user profile
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <input
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          placeholder="Enter name"
                          className="w-full px-3 py-2 rounded-xl outline-none"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "#ddeeff",
                            fontSize: "13px",
                          }}
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={saveName}
                            className="flex-1 py-2 rounded-xl"
                            style={{
                              background:
                                "linear-gradient(135deg, #7c3aed 0%, #4facfe 100%)",
                              color: "#fff",
                              fontSize: "12px",
                              fontWeight: 800,
                            }}
                          >
                            Save
                          </button>

                          <button
                            onClick={() => {
                              setDraftName(profileName);
                              setIsEditingName(false);
                            }}
                            className="flex-1 py-2 rounded-xl"
                            style={{
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              color: "#ddeeff",
                              fontSize: "12px",
                              fontWeight: 700,
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isEditingName && (
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "rgba(79,172,254,0.10)",
                        border: "1px solid rgba(79,172,254,0.16)",
                        color: "#7ecfff",
                      }}
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div
                className="rounded-3xl p-4"
                style={{
                  background: isPro
                    ? "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(79,172,254,0.14) 100%)"
                    : "linear-gradient(135deg, rgba(79,172,254,0.10) 0%, rgba(124,58,237,0.08) 100%)",
                  border: isPro
                    ? "1px solid rgba(167,139,250,0.24)"
                    : "1px solid rgba(79,172,254,0.15)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    {isPro ? (
                      <Crown size={22} style={{ color: "#c4b5fd" }} />
                    ) : (
                      <Sparkles size={22} style={{ color: "#7ecfff" }} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div
                      style={{
                        color: "#ddeeff",
                        fontSize: "15px",
                        fontWeight: 800,
                      }}
                    >
                      {isPro ? "Buddy Pro" : "Buddy Basic"}
                    </div>

                    <div
                      style={{
                        color: "rgba(180,200,230,0.72)",
                        fontSize: "11px",
                        marginTop: 2,
                      }}
                    >
                      {currentPlan.label} • {isPro ? `Valid till ${planExpiryText}` : "Free plan"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} style={{ color: "#22d3ee" }} />
                  <span style={{ color: "rgba(200,220,255,0.72)" }}>
                    {isPro ? "Unlimited chat history enabled" : "Basic plan: 10 chats max"}
                  </span>
                </div>

                {!isPro && (
                  <button
                    onClick={onUpgradeClick}
                    className="w-full mt-4 py-3 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed 0%, #4facfe 100%)",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 800,
                      border: "none",
                    }}
                  >
                    Upgrade to Pro
                  </button>
                )}
              </div>

              {settingRow(
                <Bell size={18} />,
                "Notifications",
                notificationsEnabled ? "On — updates and reminders active" : "Off — notifications muted",
                toggleNotifications
              )}

              {settingRow(
                <Shield size={18} />,
                "Privacy & Security",
                "Storage, safety, and data guide",
                openPrivacy
              )}

              {settingRow(
                <HelpCircle size={18} />,
                "Help & Support",
                "Troubleshooting and quick help",
                openHelp
              )}

              {settingRow(
                <MessageCircle size={18} />,
                "Send Feedback",
                "Tell what to improve in Buddy AI",
                sendFeedback
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl"
                style={{
                  background: "rgba(239,68,68,0.10)",
                  border: "1px solid rgba(239,68,68,0.16)",
                  color: "#fca5a5",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}