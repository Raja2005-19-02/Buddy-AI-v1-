import { motion, AnimatePresence } from "motion/react";
import { X, Crown, Check, Sparkles, Tag } from "lucide-react";

type StoredPlan = {
  tier: "basic" | "pro";
  code: "basic" | "1w" | "1m" | "6m";
  label: string;
  expiresAt?: string;
  firstOfferUsed?: boolean;
};

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  currentPlan: StoredPlan;
  onPlanChange: (plan: StoredPlan) => void;
}

function createExpiry(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function UpgradeModal({
  open,
  onClose,
  currentPlan,
  onPlanChange,
}: UpgradeModalProps) {
  const firstTimeOfferAvailable = !currentPlan.firstOfferUsed;

  const activatePlan = (code: "1w" | "1m" | "6m") => {
    const days = code === "1w" ? 7 : code === "1m" ? 30 : 180;

    const plan: StoredPlan = {
      tier: "pro",
      code,
      label:
        code === "1w"
          ? "Pro Weekly"
          : code === "1m"
          ? "Pro Monthly"
          : "Pro 6 Months",
      expiresAt: createExpiry(days),
      firstOfferUsed:
        code === "1w"
          ? true
          : currentPlan.firstOfferUsed ?? false,
    };

    onPlanChange(plan);
    alert(`Pro plan active da 🚀\n\n${plan.label} started successfully.`);
  };

  const planCard = ({
    title,
    subtitle,
    currentPrice,
    oldPrice,
    highlight,
    onClick,
  }: {
    title: string;
    subtitle: string;
    currentPrice: string;
    oldPrice?: string;
    highlight?: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="w-full text-left rounded-3xl p-4"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div
            style={{
              color: "#ddeeff",
              fontSize: "16px",
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>

          <div
            style={{
              color: "rgba(180,200,230,0.72)",
              fontSize: "11px",
              marginTop: 6,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div className="flex flex-col items-end flex-shrink-0">
          {oldPrice && (
            <div
              style={{
                color: "rgba(180,200,230,0.45)",
                fontSize: "12px",
                fontWeight: 700,
                textDecoration: "line-through",
                marginBottom: 2,
              }}
            >
              {oldPrice}
            </div>
          )}

          <div
            style={{
              color: "#7ecfff",
              fontSize: "28px",
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {currentPrice}
          </div>

          {highlight && (
            <div
              style={{
                marginTop: 8,
                fontSize: "10px",
                fontWeight: 800,
                color: "#ffffff",
                background: "linear-gradient(135deg, #7c3aed, #4facfe)",
                padding: "5px 10px",
                borderRadius: 999,
                whiteSpace: "nowrap",
              }}
            >
              {highlight}
            </div>
          )}
        </div>
      </div>
    </button>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 flex items-end justify-center"
          style={{
            background: "rgba(4,8,18,0.88)",
            backdropFilter: "blur(10px)",
          }}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #0d1523 0%, #0a1020 100%)",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              borderTop: "1px solid rgba(79, 172, 254, 0.12)",
              maxHeight: "88%",
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

            <div className="p-5 overflow-y-auto buddy-hide-scrollbar">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(124,58,237,0.24), rgba(79,172,254,0.20))",
                      border: "1px solid rgba(167,139,250,0.18)",
                    }}
                  >
                    <Crown size={24} style={{ color: "#c4b5fd" }} />
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#f8fafc",
                        fontSize: "18px",
                        fontWeight: 900,
                      }}
                    >
                      Upgrade to Pro
                    </div>

                    <div
                      style={{
                        color: "rgba(180,200,230,0.72)",
                        fontSize: "12px",
                        marginTop: 2,
                        lineHeight: 1.4,
                      }}
                    >
                      Unlimited history, better experience, premium access
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#ddeeff",
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div
                className="mt-5 rounded-3xl p-4"
                style={{
                  background: "rgba(79,172,254,0.06)",
                  border: "1px solid rgba(79,172,254,0.10)",
                }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{
                    color: "#7ecfff",
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  <Sparkles size={16} />
                  Pro benefits
                </div>

                <div className="mt-3 grid gap-2">
                  {[
                    "Unlimited chat history",
                    "Better premium experience",
                    "Future pro tools access",
                    "Priority upgrades and features",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check size={14} style={{ color: "#22d3ee" }} />
                      <span
                        style={{
                          color: "rgba(220,235,255,0.84)",
                          fontSize: "12px",
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {planCard({
                  title: "Pro 1 Week",
                  subtitle: firstTimeOfferAvailable
                    ? "First time user offer"
                    : "Weekly access",
                  currentPrice: firstTimeOfferAvailable ? "₹1" : "₹49",
                  oldPrice: firstTimeOfferAvailable ? "₹49" : undefined,
                  highlight: firstTimeOfferAvailable
                    ? "FIRST TIME OFFER"
                    : undefined,
                  onClick: () => activatePlan("1w"),
                })}

                {planCard({
                  title: "Pro 1 Month",
                  subtitle: "Best for regular use",
                  currentPrice: "₹99",
                  highlight: "POPULAR",
                  onClick: () => activatePlan("1m"),
                })}

                {planCard({
                  title: "Pro 6 Months",
                  subtitle: "Offer plan",
                  currentPrice: "₹399",
                  highlight: "BEST VALUE",
                  onClick: () => activatePlan("6m"),
                })}
              </div>

              <div
                className="mt-5 rounded-2xl p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{
                    color: "#c4b5fd",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <Tag size={14} />
                  Basic vs Pro
                </div>

                <div
                  className="mt-3 text-xs"
                  style={{
                    color: "rgba(210,225,245,0.78)",
                    lineHeight: 1.8,
                  }}
                >
                  • Basic: 10 chat history limit
                  <br />
                  • Pro: unlimited history + premium access
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-5 py-3 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#ddeeff",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}