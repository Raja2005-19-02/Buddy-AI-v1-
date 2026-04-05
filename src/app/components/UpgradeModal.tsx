import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(5, 10, 20, 0.75)",
              backdropFilter: "blur(6px)",
            }}
          />

          {/* Modal wrapper (SCROLL FIX HERE) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-3 py-6"
          >
            {/* Card container */}
            <div
              className="w-full max-w-md rounded-2xl"
              style={{
                maxHeight: "92vh",
                overflowY: "auto",
                background:
                  "linear-gradient(180deg, rgba(6,13,26,0.98) 0%, rgba(11,19,34,0.98) 100%)",
                border: "1px solid rgba(79,172,254,0.18)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                padding: "18px",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#ddeeff",
                  }}
                >
                  Upgrade to Pro 🚀
                </h2>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(180,200,230,0.7)",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Plans */}
              <div className="flex flex-col gap-3">
                {/* 1 week */}
                <div
                  className="px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(79,172,254,0.10)",
                    border: "1px solid rgba(79,172,254,0.25)",
                  }}
                >
                  <p style={{ color: "#ddeeff", fontWeight: 600 }}>
                    1 Week Plan
                  </p>

                  <p style={{ fontSize: "14px", marginTop: "4px" }}>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "rgba(180,200,230,0.6)",
                        marginRight: "6px",
                      }}
                    >
                      ₹49
                    </span>

                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "#7ecfff",
                      }}
                    >
                      ₹1
                    </span>

                    <span
                      style={{
                        fontSize: "12px",
                        marginLeft: "6px",
                        color: "#22d3ee",
                      }}
                    >
                      First time offer
                    </span>
                  </p>
                </div>

                {/* 1 month */}
                <div
                  className="px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(124,58,237,0.10)",
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}
                >
                  <p style={{ color: "#ddeeff", fontWeight: 600 }}>
                    1 Month Plan
                  </p>

                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#a78bfa",
                      marginTop: "4px",
                    }}
                  >
                    ₹99
                  </p>
                </div>

                {/* 6 month */}
                <div
                  className="px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(16,185,129,0.10)",
                    border: "1px solid rgba(16,185,129,0.25)",
                  }}
                >
                  <p style={{ color: "#ddeeff", fontWeight: 600 }}>
                    6 Month Plan
                  </p>

                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#34d399",
                      marginTop: "4px",
                    }}
                  >
                    ₹399
                  </p>
                </div>
              </div>

              {/* Button */}
              <button
                className="w-full mt-4 py-3 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #4facfe, #7c3aed)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "15px",
                }}
              >
                Upgrade Now
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}