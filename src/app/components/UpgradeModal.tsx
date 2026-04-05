import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, Check, Sparkles, BadgePercent, Crown } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

type PlanId = "week" | "month" | "sixMonth";

const plans = [
  {
    id: "week" as PlanId,
    title: "Pro 1 Week",
    subtitle: "First time user offer",
    originalPrice: 49,
    discountedPrice: 1,
    badge: "FIRST TIME OFFER",
    badgeColor: "rgba(34,211,238,0.18)",
    badgeText: "#67e8f9",
    cardBg: "linear-gradient(135deg, rgba(28,78,140,0.22) 0%, rgba(17,39,74,0.36) 100%)",
    cardBorder: "1px solid rgba(79,172,254,0.28)",
    accent: "#7ecfff",
    ctaText: "Start for ₹1",
    trustLine: "Cancel anytime • Safe checkout",
    benefits: [
      "Unlimited chat history for 7 days",
      "Priority reply experience",
      "Premium look and smoother usage",
      "Best plan to test Pro access",
    ],
  },
  {
    id: "month" as PlanId,
    title: "Pro 1 Month",
    subtitle: "Best for regular users",
    originalPrice: 149,
    discountedPrice: 99,
    badge: "POPULAR",
    badgeColor: "rgba(124,58,237,0.18)",
    badgeText: "#c4b5fd",
    cardBg: "linear-gradient(135deg, rgba(55,24,106,0.26) 0%, rgba(28,21,74,0.34) 100%)",
    cardBorder: "1px solid rgba(167,139,250,0.26)",
    accent: "#a78bfa",
    ctaText: "Get Monthly Pro",
    trustLine: "Most chosen plan",
    benefits: [
      "Unlimited chat history",
      "Better premium experience",
      "Priority improvements and access",
      "Good balance of price and features",
    ],
  },
  {
    id: "sixMonth" as PlanId,
    title: "Pro 6 Months",
    subtitle: "Offer plan",
    originalPrice: 699,
    discountedPrice: 399,
    badge: "BEST VALUE",
    badgeColor: "rgba(16,185,129,0.16)",
    badgeText: "#6ee7b7",
    cardBg: "linear-gradient(135deg, rgba(5,76,71,0.28) 0%, rgba(8,49,47,0.34) 100%)",
    cardBorder: "1px solid rgba(16,185,129,0.24)",
    accent: "#34d399",
    ctaText: "Save More with 6 Months",
    trustLine: "Lowest monthly cost",
    benefits: [
      "Unlimited history and premium access",
      "Best savings for long-term use",
      "Priority upgrades and features",
      "Perfect for daily Buddy AI usage",
    ],
  },
];

function formatINR(value: number) {
  return `₹${value}`;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("week");

  const activePlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlan) || plans[0],
    [selectedPlan]
  );

  const savedAmount = activePlan.originalPrice - activePlan.discountedPrice;
  const monthlyEquivalent =
    activePlan.id === "sixMonth"
      ? `Just ₹${Math.round(activePlan.discountedPrice / 6)}/month`
      : activePlan.id === "month"
      ? "One month access"
      : "7 day access";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(3, 8, 20, 0.78)",
              backdropFilter: "blur(8px)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-3 py-6"
          >
            <div
              className="w-full max-w-[390px] rounded-[26px]"
              style={{
                maxHeight: "92vh",
                overflowY: "auto",
                background:
                  "linear-gradient(180deg, rgba(4,10,22,0.98) 0%, rgba(10,18,34,0.98) 100%)",
                border: "1px solid rgba(79,172,254,0.16)",
                boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
              }}
            >
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div
                      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(79,172,254,0.10)",
                        border: "1px solid rgba(79,172,254,0.15)",
                        marginBottom: "10px",
                      }}
                    >
                      <Crown size={13} style={{ color: "#7ecfff" }} />
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.4px",
                          color: "#a5d8ff",
                        }}
                      >
                        BUDDY AI PRO
                      </span>
                    </div>

                    <h2
                      style={{
                        fontSize: "28px",
                        lineHeight: 1.05,
                        fontWeight: 800,
                        color: "#eef6ff",
                        letterSpacing: "-0.6px",
                      }}
                    >
                      Upgrade with
                      <br />
                      confidence 🚀
                    </h2>

                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "12px",
                        color: "rgba(175,200,235,0.72)",
                        lineHeight: 1.55,
                      }}
                    >
                      Better experience, more history, cleaner premium access.
                      Pick the plan that suits you best.
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(210,225,245,0.72)",
                    }}
                  >
                    <X size={17} />
                  </button>
                </div>

                <div
                  className="mt-4 px-3 py-3 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(79,172,254,0.10) 0%, rgba(124,58,237,0.09) 100%)",
                    border: "1px solid rgba(79,172,254,0.16)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={15} style={{ color: "#7ecfff" }} />
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#e7f3ff",
                      }}
                    >
                      Why users upgrade
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {[
                      "Unlimited chat history",
                      "Better premium experience",
                      "Priority access to pro features",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Check size={13} style={{ color: "#34d399" }} />
                        <span
                          style={{
                            fontSize: "11px",
                            color: "rgba(205,220,240,0.82)",
                          }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-3">
                <div className="flex flex-col gap-3">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    const save = plan.originalPrice - plan.discountedPrice;

                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan.id)}
                        className="w-full text-left rounded-2xl px-4 py-4 transition-all"
                        style={{
                          background: plan.cardBg,
                          border: isSelected
                            ? `1.5px solid ${plan.accent}`
                            : plan.cardBorder,
                          boxShadow: isSelected
                            ? `0 0 0 1px ${plan.accent} inset, 0 10px 24px rgba(0,0,0,0.22)`
                            : "none",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p
                                style={{
                                  color: "#eef6ff",
                                  fontSize: "15px",
                                  fontWeight: 700,
                                }}
                              >
                                {plan.title}
                              </p>

                              <span
                                className="px-2 py-1 rounded-full"
                                style={{
                                  background: plan.badgeColor,
                                  color: plan.badgeText,
                                  fontSize: "9px",
                                  fontWeight: 800,
                                  letterSpacing: "0.3px",
                                }}
                              >
                                {plan.badge}
                              </span>
                            </div>

                            <p
                              style={{
                                marginTop: "4px",
                                fontSize: "10px",
                                color: "rgba(180,205,230,0.66)",
                              }}
                            >
                              {plan.subtitle}
                            </p>
                          </div>

                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                            style={{
                              border: isSelected
                                ? `1px solid ${plan.accent}`
                                : "1px solid rgba(255,255,255,0.16)",
                              background: isSelected
                                ? `${plan.accent}22`
                                : "transparent",
                            }}
                          >
                            {isSelected && (
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ background: plan.accent }}
                              />
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex items-end justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                style={{
                                  color: "rgba(160,180,210,0.52)",
                                  textDecoration: "line-through",
                                  fontSize: "14px",
                                  fontWeight: 700,
                                }}
                              >
                                {formatINR(plan.originalPrice)}
                              </span>

                              <span
                                style={{
                                  color: plan.accent,
                                  fontSize: "29px",
                                  fontWeight: 800,
                                  lineHeight: 1,
                                  letterSpacing: "-0.8px",
                                }}
                              >
                                {formatINR(plan.discountedPrice)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "rgba(210,225,245,0.74)",
                                }}
                              >
                                Save {formatINR(save)}
                              </span>

                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "rgba(145,220,255,0.82)",
                                }}
                              >
                                • {plan.id === "sixMonth"
                                  ? `₹${Math.round(plan.discountedPrice / 6)}/month`
                                  : plan.id === "month"
                                  ? "Monthly access"
                                  : "7 day access"}
                              </span>
                            </div>
                          </div>

                          {plan.id === "week" && (
                            <div
                              className="px-2 py-1 rounded-full"
                              style={{
                                background: "rgba(79,172,254,0.16)",
                                border: "1px solid rgba(79,172,254,0.18)",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "9px",
                                  fontWeight: 800,
                                  color: "#7ecfff",
                                }}
                              >
                                TRY NOW
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="px-4 pb-4">
                <div
                  className="rounded-2xl px-4 py-4 mb-3"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} style={{ color: activePlan.accent }} />
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#eef6ff",
                        }}
                      >
                        {activePlan.title} benefits
                      </span>
                    </div>

                    <span
                      className="px-2 py-1 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(205,220,240,0.76)",
                        fontSize: "9px",
                        fontWeight: 800,
                      }}
                    >
                      SELECTED
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {activePlan.benefits.map((benefit) => (
                      <div key={benefit} className="flex items-start gap-2">
                        <Check
                          size={13}
                          style={{ color: activePlan.accent, marginTop: "2px" }}
                        />
                        <span
                          style={{
                            fontSize: "11px",
                            lineHeight: 1.5,
                            color: "rgba(210,225,245,0.82)",
                          }}
                        >
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="mt-3 pt-3 flex items-center justify-between gap-3 flex-wrap"
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div>
                      <div
                        className="flex items-center gap-2"
                        style={{ color: "#eef6ff" }}
                      >
                        <BadgePercent size={14} style={{ color: activePlan.accent }} />
                        <span style={{ fontSize: "12px", fontWeight: 700 }}>
                          Pay {formatINR(activePlan.discountedPrice)} now
                        </span>
                      </div>
                      <p
                        style={{
                          marginTop: "4px",
                          fontSize: "10px",
                          color: "rgba(170,195,225,0.68)",
                        }}
                      >
                        Original {formatINR(activePlan.originalPrice)} • You save{" "}
                        {formatINR(savedAmount)} • {monthlyEquivalent}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full py-3.5 rounded-2xl"
                  style={{
                    background:
                      activePlan.id === "week"
                        ? "linear-gradient(135deg, #4facfe 0%, #7c3aed 100%)"
                        : activePlan.id === "month"
                        ? "linear-gradient(135deg, #7c3aed 0%, #5b6cff 100%)"
                        : "linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "15px",
                    boxShadow: "0 16px 34px rgba(0,0,0,0.26)",
                  }}
                >
                  {activePlan.ctaText}
                </button>

                <div
                  className="mt-3 flex items-center justify-center gap-2 flex-wrap"
                  style={{
                    fontSize: "10px",
                    color: "rgba(160,185,215,0.68)",
                  }}
                >
                  <ShieldCheck size={12} />
                  <span>{activePlan.trustLine}</span>
                  <span>•</span>
                  <span>Secure payment</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}