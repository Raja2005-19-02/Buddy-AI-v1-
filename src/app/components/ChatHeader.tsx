import { History } from "lucide-react";
import { motion } from "motion/react";
import { BuddyAvatar } from "./BuddyAvatar";

interface ChatHeaderProps {
  onHistoryClick: () => void;
  onProfileClick: () => void;
  isPro?: boolean;
}

export function ChatHeader({
  onHistoryClick,
  onProfileClick,
  isPro = false,
}: ChatHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 relative z-10"
      style={{
        background:
          "linear-gradient(180deg, rgba(10,16,32,0.98) 0%, rgba(13,20,38,0.92) 100%)",
        borderBottom: "1px solid rgba(79, 172, 254, 0.1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
      }}
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onHistoryClick}
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{
          background: "rgba(79, 172, 254, 0.08)",
          border: "1px solid rgba(79, 172, 254, 0.18)",
          color: "rgba(79, 172, 254, 0.85)",
        }}
      >
        <History size={16} strokeWidth={2} />
        <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(200, 220, 255, 0.7)" }}>
          History
        </span>
      </motion.button>

      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1a2a4a 0%, #0f1f3d 100%)",
            border: "1.5px solid rgba(79, 172, 254, 0.4)",
            boxShadow: "0 0 16px rgba(79, 172, 254, 0.25)",
          }}
        >
          <BuddyAvatar size={26} />
        </div>

        <div className="flex flex-col items-center">
          <span
            className="leading-none"
            style={{
              fontSize: "17px",
              fontWeight: 800,
              letterSpacing: "-0.3px",
              background: "linear-gradient(90deg, #7ecfff 0%, #a78bfa 60%, #4facfe 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Buddy AI
          </span>

          <div className="flex items-center gap-1 mt-0.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isPro ? "#a78bfa" : "#22d3ee",
                boxShadow: isPro ? "0 0 6px #a78bfa" : "0 0 6px #22d3ee",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                color: isPro ? "rgba(196,181,253,0.9)" : "rgba(130, 200, 255, 0.7)",
                fontWeight: 700,
                letterSpacing: "0.3px",
              }}
            >
              {isPro ? "PRO" : "BASIC"}
            </span>
          </div>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onProfileClick}
        className="relative flex items-center justify-center"
        style={{ width: 38, height: 38 }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: isPro
              ? "linear-gradient(135deg, rgba(124,58,237,0.5) 0%, rgba(79,172,254,0.4) 100%)"
              : "linear-gradient(135deg, rgba(79,172,254,0.35) 0%, rgba(124,58,237,0.25) 100%)",
            padding: 1.5,
            borderRadius: "50%",
          }}
        />
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center relative z-10"
          style={{
            background: "linear-gradient(135deg, #1a2f50 0%, #0f1e38 100%)",
            border: isPro
              ? "1.5px solid rgba(167,139,250,0.5)"
              : "1.5px solid rgba(79,172,254,0.35)",
            boxShadow: isPro
              ? "0 0 14px rgba(124,58,237,0.3)"
              : "0 0 12px rgba(79,172,254,0.2)",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              background: isPro
                ? "linear-gradient(135deg, #c4b5fd 0%, #7ecfff 100%)"
                : "linear-gradient(135deg, #7ecfff 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AJ
          </span>
        </div>

        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full z-20"
          style={{
            background: isPro ? "#a78bfa" : "#22d3ee",
            boxShadow: isPro ? "0 0 6px #a78bfa" : "0 0 6px #22d3ee",
            border: "1.5px solid #0a1020",
          }}
        />
      </motion.button>
    </div>
  );
}