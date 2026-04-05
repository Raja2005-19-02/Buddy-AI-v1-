import { motion } from "motion/react";
import { BuddyAvatar } from "./BuddyAvatar";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-end gap-2 px-4 py-1"
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #1a2a4a 0%, #0f1f3d 100%)",
          border: "1.5px solid rgba(79, 172, 254, 0.35)",
          boxShadow: "0 0 10px rgba(79, 172, 254, 0.15)",
        }}
      >
        <BuddyAvatar size={26} />
      </div>

      {/* Bubble */}
      <div
        className="flex flex-col items-start gap-2 px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{
          background: "rgba(21, 32, 53, 0.92)",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Dots */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "#4facfe" }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Text */}
        <span
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.6)",
            fontWeight: 500,
          }}
        >
          Buddy AI is thinking 🤔
        </span>
      </div>
    </motion.div>
  );
}