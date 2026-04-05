import { useState, useRef, useEffect } from "react";
import { Send, Mic, ImagePlus, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChatInputProps {
  onSend: (message: {
    text?: string;
    files?: File[];
  }) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const languageOptions = [
  { label: "EN-TN", value: "en-IN", fullLabel: "Tamil + English" },
  { label: "EN", value: "en-IN", fullLabel: "English" },
  { label: "TA", value: "ta-IN", fullLabel: "Tamil" },
  { label: "HI", value: "hi-IN", fullLabel: "Hindi" },
  { label: "TE", value: "te-IN", fullLabel: "Telugu" },
  { label: "ML", value: "ml-IN", fullLabel: "Malayalam" },
  { label: "KN", value: "kn-IN", fullLabel: "Kannada" },
  { label: "BN", value: "bn-IN", fullLabel: "Bengali" },
  { label: "MR", value: "mr-IN", fullLabel: "Marathi" },
  { label: "GU", value: "gu-IN", fullLabel: "Gujarati" },
  { label: "PA", value: "pa-IN", fullLabel: "Punjabi" },
  { label: "UR", value: "ur-IN", fullLabel: "Urdu" },
  { label: "OR", value: "or-IN", fullLabel: "Odia" },
];

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSend = () => {
    const trimmed = value.trim();
    if ((!trimmed && selectedFiles.length === 0) || disabled) return;

    onSend({
      text: trimmed,
      files: selectedFiles,
    });

    setValue("");
    setSelectedFiles([]);
    setLangMenuOpen(false);
    setIsDragging(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);

    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";

    if (e.target.value.trim().length > 0) {
      setLangMenuOpen(false);
    }
  };

  const handleMicClick = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    if (micActive) {
      recognitionRef.current?.stop();
      setMicActive(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = selectedLanguage.value;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setMicActive(true);
      setLangMenuOpen(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;

      setValue((prev) => {
        const updated = prev ? prev + " " + transcript : transcript;

        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height =
            Math.min(textareaRef.current.scrollHeight, 120) + "px";
        }

        return updated;
      });
    };

    recognition.onerror = () => {
      setMicActive(false);
    };

    recognition.onend = () => {
      setMicActive(false);
    };

    recognition.start();
  };

  const mergeFiles = (incomingFiles: File[]) => {
    setSelectedFiles((prev) => {
      const existingKeys = new Set(
        prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
      );

      const uniqueIncoming = incomingFiles.filter((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        return !existingKeys.has(key);
      });

      return [...prev, ...uniqueIncoming];
    });
  };

  const handleFileButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    mergeFiles(files);
  };

  const removeSelectedFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));

    if (fileInputRef.current && selectedFiles.length <= 1) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;

    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;

    mergeFiles(files);
  };

  const canSend = (value.trim().length > 0 || selectedFiles.length > 0) && !disabled;
  const showVoiceControls = value.trim().length === 0 && !micActive;

  return (
    <div
      className="px-3 py-3"
      style={{
        background:
          "linear-gradient(0deg, rgba(8,13,26,0.99) 0%, rgba(10,16,32,0.96) 100%)",
        borderTop: "1px solid rgba(79, 172, 254, 0.08)",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="mb-2 flex flex-col gap-2"
          >
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className="flex items-center justify-between px-3 py-2 rounded-xl"
                style={{
                  background: "rgba(79, 172, 254, 0.08)",
                  border: "1px solid rgba(79, 172, 254, 0.15)",
                }}
              >
                <div className="min-w-0">
                  <p
                    className="truncate"
                    style={{
                      color: "#ddeeff",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {file.name}
                  </p>
                  <p
                    style={{
                      color: "rgba(160,190,230,0.7)",
                      fontSize: "10px",
                      marginTop: "2px",
                    }}
                  >
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeSelectedFile(index)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={wrapperRef}
        className="relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <motion.div
          animate={{
            boxShadow: isDragging
              ? "0 0 0 2px rgba(79, 172, 254, 0.25)"
              : focused
              ? "0 0 0 1.5px rgba(79, 172, 254, 0.5)"
              : "0 0 0 1px rgba(255,255,255,0.07)",
          }}
          transition={{ duration: 0.25 }}
          className="flex items-end gap-2 px-3 py-2 rounded-2xl"
          style={{
            background: "rgba(17, 26, 46, 0.95)",
            border: isDragging
              ? "1px solid rgba(79, 172, 254, 0.7)"
              : focused
              ? "1px solid rgba(79, 172, 254, 0.45)"
              : "1px solid rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(20px)",
          }}
        >
          <motion.button
            whileTap={{ scale: 0.88 }}
            type="button"
            onClick={handleFileButtonClick}
            disabled={disabled}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: selectedFiles.length > 0
                ? "rgba(79,172,254,0.14)"
                : "rgba(167,139,250,0.08)",
              border: selectedFiles.length > 0
                ? "1px solid rgba(79,172,254,0.28)"
                : "1px solid rgba(167,139,250,0.18)",
              color: selectedFiles.length > 0 ? "#7ecfff" : "rgba(167,139,250,0.65)",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <ImagePlus size={17} />
          </motion.button>

          <textarea
            ref={textareaRef}
            value={value}
            disabled={disabled}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={micActive ? "Listening..." : "Message Buddy AI..."}
            rows={1}
            className="flex-1 resize-none outline-none bg-transparent text-sm py-1"
            style={{
              color: "#ddeeff",
              caretColor: "#4facfe",
              maxHeight: "120px",
            }}
          />

          <AnimatePresence initial={false}>
            {showVoiceControls && (
              <motion.div
                key="voice-controls"
                initial={{ opacity: 0, x: 8, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: 8, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 overflow-hidden flex-shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setLangMenuOpen((prev) => !prev)}
                  disabled={disabled}
                  className="h-8 rounded-lg flex items-center gap-1 px-2.5 flex-shrink-0"
                  style={{
                    background: "rgba(79, 172, 254, 0.08)",
                    border: "1px solid rgba(79, 172, 254, 0.15)",
                    color: "#7ecfff",
                    fontSize: "10px",
                    fontWeight: 700,
                    minWidth: "62px",
                    opacity: disabled ? 0.5 : 1,
                  }}
                >
                  <span>{selectedLanguage.label}</span>
                  <ChevronDown size={11} />
                </button>

                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={handleMicClick}
                  disabled={disabled}
                  type="button"
                  className="relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: micActive
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(79, 172, 254, 0.08)",
                    border: micActive
                      ? "1px solid rgba(239, 68, 68, 0.4)"
                      : "1px solid rgba(79, 172, 254, 0.15)",
                    color: micActive ? "#f87171" : "#7ecfff",
                    opacity: disabled ? 0.5 : 1,
                  }}
                >
                  <Mic size={17} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleSend}
            disabled={!canSend || disabled}
            type="button"
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: canSend && !disabled
                ? "linear-gradient(135deg, #4facfe, #7c3aed)"
                : "rgba(79,172,254,0.08)",
              color: canSend && !disabled ? "#fff" : "rgba(79,172,254,0.3)",
            }}
          >
            <Send size={16} />
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none"
              style={{
                background: "rgba(79, 172, 254, 0.10)",
                border: "1px dashed rgba(79, 172, 254, 0.45)",
                zIndex: 40,
              }}
            >
              <span
                style={{
                  color: "#7ecfff",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Drop files here
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {langMenuOpen && showVoiceControls && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-14 right-12 rounded-xl overflow-hidden"
              style={{
                width: "165px",
                background: "rgba(12,18,32,0.98)",
                border: "1px solid rgba(79,172,254,0.18)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
                backdropFilter: "blur(16px)",
                zIndex: 999,
              }}
            >
              {languageOptions.map((lang) => {
                const isSelected =
                  selectedLanguage.label === lang.label &&
                  selectedLanguage.value === lang.value;

                return (
                  <button
                    key={lang.label + lang.value}
                    type="button"
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setLangMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5"
                    style={{
                      background: isSelected
                        ? "rgba(79, 172, 254, 0.12)"
                        : "transparent",
                      color: isSelected
                        ? "#ddeeff"
                        : "rgba(210,225,245,0.85)",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      fontSize: "12px",
                    }}
                  >
                    {lang.fullLabel}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p
        className="text-center mt-2"
        style={{
          fontSize: "10px",
          color: "rgba(100,130,170,0.5)",
        }}
      >
        Buddy AI may make mistakes. Verify important info.
      </p>
    </div>
  );
}