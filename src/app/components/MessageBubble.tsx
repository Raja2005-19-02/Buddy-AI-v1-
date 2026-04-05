import { motion, AnimatePresence } from "motion/react";
import { forwardRef, useEffect, useMemo, useState } from "react";
import {
  BuddyAvatar
} from "./BuddyAvatar";
import {
  FileText,
  X,
  ExternalLink,
  Volume2,
  Square,
  ChevronDown
} from "lucide-react";

export type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(size?: number) {
  if (!size) return "";
  return `${(size / 1024).toFixed(1)} KB`;
}

function isImageFile(message: Message) {
  const type = message.fileType?.toLowerCase() || "";
  const name = (message.fileName || "").toLowerCase().trim();
  if (type.startsWith("image/")) return true;
  return /\.(png|jpg|jpeg|webp|gif|bmp|svg)$/i.test(name);
}

interface MessageBubbleProps {
  message: Message;
  index: number;
}

declare global {
  interface Window {
    readonly speechSynthesis: SpeechSynthesis;
  }
}

export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  function MessageBubble({ message, index }, ref) {
    const isUser = message.role === "user";
    const isImage = isImageFile(message);
    const hasFile = !!(message.fileUrl && message.fileUrl !== "");
    const hasText = !!message.content?.trim();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voicePopupOpen, setVoicePopupOpen] = useState(false);
    const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");

    const availableVoices = useMemo(() => {
      if (!("speechSynthesis" in window)) return [];
      const voices = window.speechSynthesis.getVoices();
      return voices.filter(
        (voice) =>
          voice.lang.startsWith("en") ||
          voice.lang.startsWith("ta") ||
          voice.lang.startsWith("hi")
      );
    }, [voicePopupOpen]);

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setPreviewOpen(false);
          setVoicePopupOpen(false);
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, []);

    useEffect(() => {
      const fillVoices = () => {
        const voices = window.speechSynthesis?.getVoices?.() || [];
        if (!selectedVoiceName && voices.length > 0) {
          const preferred =
            voices.find((v) => v.lang === "en-IN") ||
            voices.find((v) => v.name.toLowerCase().includes("female")) ||
            voices.find((v) => v.lang.startsWith("en")) ||
            voices[0];
          if (preferred) setSelectedVoiceName(preferred.name);
        }
      };

      fillVoices();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = fillVoices;
      }

      return () => {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }, [selectedVoiceName]);

    useEffect(() => {
      return () => {
        if (window.speechSynthesis?.speaking) {
          window.speechSynthesis.cancel();
        }
      };
    }, []);

    const openFile = () => {
      if (!message.fileUrl) return;
      window.open(message.fileUrl, "_blank", "noopener,noreferrer");
    };

    const cleanSpeakText = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/`(.*?)`/g, "$1")
        .replace(/\n+/g, ". ")
        .trim();
    };

    const playVoice = () => {
      if (!hasText || message.role !== "ai") return;

      if (!("speechSynthesis" in window)) {
        alert("Voice reply is not supported in this browser.");
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(
        cleanSpeakText(message.content)
      );

      const voices = window.speechSynthesis.getVoices();
      const selected =
        voices.find((voice) => voice.name === selectedVoiceName) ||
        voices.find((voice) => voice.lang === "en-IN") ||
        voices.find((voice) => voice.lang.startsWith("en")) ||
        null;

      if (selected) {
        utterance.voice = selected;
      }

      utterance.rate = 0.98;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setVoicePopupOpen(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    const stopVoice = () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setVoicePopupOpen(false);
    };

    return (
      <>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: index * 0.04,
          }}
          className={`flex items-end gap-2 px-4 py-1 ${
            isUser ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {!isUser && (
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mb-1"
              style={{
                background: "linear-gradient(135deg, #1a2a4a 0%, #0f1f3d 100%)",
                border: "1.5px solid rgba(79, 172, 254, 0.35)",
                boxShadow: "0 0 12px rgba(79, 172, 254, 0.12)",
              }}
            >
              <BuddyAvatar size={26} />
            </div>
          )}

          {isUser && (
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mb-1"
              style={{
                background: "linear-gradient(135deg, #4facfe 0%, #7c3aed 100%)",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 700,
                boxShadow: "0 0 12px rgba(79, 172, 254, 0.22)",
              }}
            >
              U
            </div>
          )}

          <div
            className={`flex flex-col gap-1 max-w-[78%] ${
              isUser ? "items-end" : "items-start"
            }`}
          >
            <div
              className="px-4 py-3 text-sm relative"
              style={
                isUser
                  ? {
                      background: "rgba(79, 172, 254, 0.13)",
                      border: "1px solid rgba(79, 172, 254, 0.32)",
                      color: "#ddeeff",
                      borderRadius: "20px 20px 4px 20px",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                    }
                  : {
                      background: "rgba(21, 32, 53, 0.92)",
                      border: "1px solid rgba(255, 255, 255, 0.07)",
                      color: "#c8d8f0",
                      borderRadius: "20px 20px 20px 4px",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    }
              }
            >
              {hasFile && isImage && !imageFailed && (
                <img
                  src={message.fileUrl}
                  alt={message.fileName || "uploaded image"}
                  className="rounded-xl max-w-[220px] cursor-pointer"
                  onClick={() => setPreviewOpen(true)}
                  onError={() => setImageFailed(true)}
                  style={{
                    display: "block",
                    border: "1px solid rgba(255,255,255,0.08)",
                    marginBottom: hasText ? "10px" : "0px",
                  }}
                />
              )}

              {hasFile && (!isImage || imageFailed) && (
                <button
                  type="button"
                  onClick={openFile}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl w-full text-left"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    marginBottom: hasText ? "10px" : "0px",
                    minWidth: "190px",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(79, 172, 254, 0.12)",
                      border: "1px solid rgba(79, 172, 254, 0.16)",
                      color: "#7ecfff",
                    }}
                  >
                    <FileText size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className="truncate"
                      style={{
                        fontWeight: 600,
                        fontSize: "12px",
                        color: "#ddeeff",
                      }}
                    >
                      {message.fileName || "Attached file"}
                    </div>

                    <div
                      style={{
                        fontSize: "10px",
                        opacity: 0.72,
                      }}
                    >
                      {formatFileSize(message.fileSize)}
                    </div>
                  </div>

                  <ExternalLink size={14} style={{ opacity: 0.7 }} />
                </button>
              )}

              {hasText && (
                <span
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    lineHeight: 1.6,
                  }}
                >
                  {message.content}
                </span>
              )}

              <AnimatePresence>
                {voicePopupOpen && message.role === "ai" && hasText && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute bottom-[calc(100%+8px)] right-0 w-56 rounded-2xl p-3"
                    style={{
                      background: "rgba(10,16,30,0.98)",
                      border: "1px solid rgba(79,172,254,0.18)",
                      boxShadow: "0 14px 30px rgba(0,0,0,0.45)",
                      zIndex: 50,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#ddeeff",
                        marginBottom: 10,
                      }}
                    >
                      AI Voice Reply
                    </div>

                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        marginBottom: 10,
                      }}
                    >
                      <ChevronDown size={14} style={{ color: "#7ecfff" }} />
                      <select
                        value={selectedVoiceName}
                        onChange={(e) => setSelectedVoiceName(e.target.value)}
                        style={{
                          background: "transparent",
                          color: "#ddeeff",
                          fontSize: "12px",
                          outline: "none",
                          border: "none",
                          width: "100%",
                        }}
                      >
                        {availableVoices.length === 0 ? (
                          <option value="">Default Voice</option>
                        ) : (
                          availableVoices.map((voice) => (
                            <option key={voice.name} value={voice.name}>
                              {voice.name} ({voice.lang})
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={playVoice}
                        className="flex-1 py-2 rounded-xl"
                        style={{
                          background: "linear-gradient(135deg, #4facfe, #7c3aed)",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        Play
                      </button>

                      <button
                        type="button"
                        onClick={stopVoice}
                        className="flex-1 py-2 rounded-xl"
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "#ddeeff",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        Stop
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
              <span
                style={{
                  color: "rgba(130, 150, 180, 0.6)",
                  fontSize: "10.5px",
                }}
              >
                {formatTime(message.timestamp)}
              </span>

              {message.role === "ai" && hasText && (
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopVoice();
                    } else {
                      setVoicePopupOpen((prev) => !prev);
                    }
                  }}
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: isSpeaking
                      ? "rgba(239, 68, 68, 0.14)"
                      : "rgba(79, 172, 254, 0.10)",
                    border: isSpeaking
                      ? "1px solid rgba(239, 68, 68, 0.30)"
                      : "1px solid rgba(79, 172, 254, 0.20)",
                    color: isSpeaking ? "#f87171" : "#7ecfff",
                  }}
                  title={isSpeaking ? "Stop voice" : "Voice options"}
                >
                  {isSpeaking ? <Square size={11} /> : <Volume2 size={11} />}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {previewOpen && hasFile && isImage && !imageFailed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewOpen(false)}
              className="fixed inset-0 flex items-center justify-center p-4"
              style={{
                background: "rgba(0, 0, 0, 0.82)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                zIndex: 9999,
              }}
            >
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#ffffff",
                }}
              >
                <X size={18} />
              </button>

              <motion.img
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={message.fileUrl}
                alt={message.fileName || "preview"}
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
                  objectFit: "contain",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }
);