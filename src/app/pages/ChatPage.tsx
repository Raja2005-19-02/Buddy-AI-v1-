import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageBubble, Message } from "../components/MessageBubble";
import { TypingIndicator } from "../components/TypingIndicator";
import { ChatHeader } from "../components/ChatHeader";
import { ChatInput } from "../components/ChatInput";
import { HistoryDrawer } from "../components/HistoryDrawer";
import { BuddyAvatar } from "../components/BuddyAvatar";
import { UserProfileDrawer } from "../components/UserProfileDrawer";
import { UpgradeModal } from "../components/UpgradeModal";

type ChatSession = {
  id: string;
  title: string;
  preview: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

type SendPayload = {
  text?: string;
  files?: File[];
};

type StoredPlan = {
  tier: "basic" | "pro";
  code: "basic" | "1w" | "1m" | "6m";
  label: string;
  expiresAt?: string;
  firstOfferUsed?: boolean;
};

const MAX_BASIC_CHATS = 10;

const initialMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "Hey! I'm **Buddy AI** 🤖\n\nUn smart assistant da — coding, ideas, study, app building, daily help ellathukkum ready.\n\nEnna help venum?",
    timestamp: new Date(Date.now() - 8 * 60000),
  },
];

function getStoredPlan(): StoredPlan {
  try {
    const saved = localStorage.getItem("buddy_plan");

    if (!saved) {
      return {
        tier: "basic",
        code: "basic",
        label: "Basic Plan",
        firstOfferUsed: false,
      };
    }

    const parsed = JSON.parse(saved) as StoredPlan;

    if (parsed.tier === "pro" && parsed.expiresAt) {
      const expired = new Date(parsed.expiresAt).getTime() < Date.now();

      if (expired) {
        const basicPlan: StoredPlan = {
          tier: "basic",
          code: "basic",
          label: "Basic Plan",
          firstOfferUsed: parsed.firstOfferUsed ?? true,
        };

        localStorage.setItem("buddy_plan", JSON.stringify(basicPlan));
        return basicPlan;
      }
    }

    return parsed;
  } catch {
    return {
      tier: "basic",
      code: "basic",
      label: "Basic Plan",
      firstOfferUsed: false,
    };
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("buddy_messages");
    if (!saved) return initialMessages;

    const parsed = JSON.parse(saved);

    return parsed.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  });

  const [chatHistory, setChatHistory] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem("buddy_chat_history");
    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return parsed.map((chat: any) => ({
      ...chat,
      messages: chat.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  });

  const [isTyping, setIsTyping] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<StoredPlan>(() => getStoredPlan());

  const bottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const isProUser = currentPlan.tier === "pro";

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, []);

  const saveCurrentChatToHistory = useCallback(
    (updatedMessages: Message[]) => {
      const onlyRealMessages = updatedMessages.filter(
        (msg) => (msg.content && msg.content.trim() !== "") || !!msg.fileName
      );

      const userMessages = onlyRealMessages.filter((msg) => msg.role === "user");
      if (userMessages.length === 0) return;

      const firstUserMessage = userMessages[0];
      const firstTitleSource =
        firstUserMessage.content?.trim() || firstUserMessage.fileName || "New Chat";

      const title =
        firstTitleSource.length > 30
          ? firstTitleSource.slice(0, 30) + "..."
          : firstTitleSource;

      const lastMessage = onlyRealMessages[onlyRealMessages.length - 1];
      const previewSource =
        lastMessage.content?.trim() || lastMessage.fileName || "";

      const preview =
        previewSource.length > 50 ? previewSource.slice(0, 50) : previewSource;

      const newSession: ChatSession = {
        id: Date.now().toString(),
        title,
        preview,
        messages: updatedMessages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setActiveChatId(newSession.id);

      setChatHistory((prev) => {
        const filteredPrev = prev.filter((item) => item.title !== title);
        const updated = [newSession, ...filteredPrev];

        if (isProUser) return updated;
        return updated.slice(0, MAX_BASIC_CHATS);
      });
    },
    [isProUser]
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    localStorage.setItem("buddy_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("buddy_chat_history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem("buddy_plan", JSON.stringify(currentPlan));
  }, [currentPlan]);

  useEffect(() => {
    let startY = 0;
    let endY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        endY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      endY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      if (window.scrollY === 0 && endY - startY > 90) {
        window.location.reload();
      }
      startY = 0;
      endY = 0;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  const uploadSingleFile = async (file: File) => {
    const fallbackLocalUrl = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (uploadRes.ok && uploadData.file) {
        return uploadData.file as {
          name: string;
          size: number;
          type: string;
          url: string;
        };
      }

      return {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fallbackLocalUrl,
      };
    } catch {
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fallbackLocalUrl,
      };
    }
  };

  const handleSend = useCallback(
    async (payload: SendPayload) => {
      const trimmed = payload.text?.trim() || "";
      const files = payload.files || [];
      const hasFiles = files.length > 0;

      if (!trimmed && !hasFiles) return;

      if (!isProUser && chatHistory.length >= MAX_BASIC_CHATS && !activeChatId) {
        setUpgradeOpen(true);
        return;
      }

      const uploadedFiles = hasFiles
        ? await Promise.all(files.map((file) => uploadSingleFile(file)))
        : [];

      const newUserMessages: Message[] = [];

      if (trimmed || uploadedFiles.length === 0) {
        newUserMessages.push({
          id: `${Date.now()}-text`,
          role: "user",
          content: trimmed,
          timestamp: new Date(),
        });
      }

      uploadedFiles.forEach((file, index) => {
        newUserMessages.push({
          id: `${Date.now()}-file-${index}`,
          role: "user",
          content: "",
          timestamp: new Date(),
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileUrl: file.url,
        });
      });

      setMessages((prev) => [...prev, ...newUserMessages]);
      setIsTyping(true);
      scrollToBottom();

      const fileNamesText =
        uploadedFiles.length > 0
          ? uploadedFiles.map((file) => file.name).join(", ")
          : "";

      const backendMessage =
        uploadedFiles.length > 0
          ? trimmed
            ? `User uploaded ${uploadedFiles.length} file(s): ${fileNamesText}. User message: ${trimmed}`
            : `User uploaded ${uploadedFiles.length} file(s): ${fileNamesText}. Please acknowledge the files and ask what they want to do with them.`
          : trimmed;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: backendMessage,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await res.json();

        const aiMsg: Message = {
          id: `${Date.now()}-ai`,
          role: "ai",
          content: data.reply || "No reply from AI",
          timestamp: new Date(),
        };

        setMessages((prev) => {
          const updatedMessages = [...prev, aiMsg];
          saveCurrentChatToHistory(updatedMessages);
          return updatedMessages;
        });
      } catch {
        clearTimeout(timeoutId);

        const fallbackReply =
          uploadedFiles.length > 0
            ? `Naan un ${uploadedFiles.length} file(s) receive panniten 📎\n\nIdhula enna help venum — summarize, explain, extract details, compare, illa based on this solve pannava?`
            : "Connection weak ah iruku da. Reload pannitu illa konjam apram try pannu.";

        const aiMsg: Message = {
          id: `${Date.now()}-ai`,
          role: "ai",
          content: fallbackReply,
          timestamp: new Date(),
        };

        setMessages((prev) => {
          const updatedMessages = [...prev, aiMsg];
          saveCurrentChatToHistory(updatedMessages);
          return updatedMessages;
        });
      } finally {
        setIsTyping(false);
        scrollToBottom();
      }
    },
    [scrollToBottom, saveCurrentChatToHistory, isProUser, chatHistory.length, activeChatId]
  );

  const clearChat = () => {
    localStorage.removeItem("buddy_messages");
    setMessages(initialMessages);
  };

  const startNewChat = () => {
    clearChat();
    setActiveChatId(null);
    setHistoryOpen(false);
  };

  const deleteHistoryItem = (id: string) => {
    setChatHistory((prev) => prev.filter((item) => item.id !== id));

    if (activeChatId === id) {
      setActiveChatId(null);
      setMessages(initialMessages);
      localStorage.removeItem("buddy_messages");
    }
  };

  const renameHistoryItem = (id: string, newTitle: string) => {
    setChatHistory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title: newTitle,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const loadChatFromHistory = (chatId: string) => {
    const selectedChat = chatHistory.find((chat) => chat.id === chatId);
    if (!selectedChat) return;

    const convertedMessages = selectedChat.messages.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));

    setMessages(convertedMessages);
    setActiveChatId(chatId);

    localStorage.setItem("buddy_messages", JSON.stringify(selectedChat.messages));
    setHistoryOpen(false);
  };

  const handlePlanChange = (plan: StoredPlan) => {
    setCurrentPlan(plan);
    setUpgradeOpen(false);
  };

  const handleUpgradePayment = (planId: "week" | "month" | "sixMonth") => {
    let days = 0;
    let label = "";
    let code: "1w" | "1m" | "6m" = "1w";

    if (planId === "week") {
      days = 7;
      label = "Pro 1 Week";
      code = "1w";
    } else if (planId === "month") {
      days = 30;
      label = "Pro 1 Month";
      code = "1m";
    } else {
      days = 180;
      label = "Pro 6 Months";
      code = "6m";
    }

    const expires = new Date();
    expires.setDate(expires.getDate() + days);

    const newPlan: StoredPlan = {
      tier: "pro",
      code,
      label,
      expiresAt: expires.toISOString(),
      firstOfferUsed: true,
    };

    localStorage.setItem("buddy_plan", JSON.stringify(newPlan));
    setCurrentPlan(newPlan);
    setUpgradeOpen(false);

    alert(
      `Payment successful ✅\n\n${label} activated.\nValid till: ${expires.toDateString()}`
    );
  };

  const hasOnlyWelcomeMessage =
    messages.length === 1 && messages[0]?.role === "ai";

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #060d1a 0%, #0b1322 50%, #080f1e 100%)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute"
          style={{
            width: 600,
            height: 600,
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(79,172,254,0.04) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          className="absolute"
          style={{
            width: 400,
            height: 400,
            bottom: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>

      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: "100%",
          maxWidth: 420,
          height: "100dvh",
          maxHeight: 860,
          background: "linear-gradient(180deg, #0d1624 0%, #0a1018 100%)",
          boxShadow:
            "0 30px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(79,172,254,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
          borderRadius: "clamp(0px, 2vw, 36px)",
          zIndex: 1,
        }}
      >
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

        <div
          className="absolute pointer-events-none"
          style={{
            width: 300,
            height: 300,
            top: -60,
            right: -80,
            background: "radial-gradient(circle, rgba(79,172,254,0.06) 0%, transparent 65%)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 250,
            height: 250,
            bottom: 60,
            left: -60,
            background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        <div className="relative z-10">
          <ChatHeader
            onHistoryClick={() => setHistoryOpen(true)}
            onProfileClick={() => setProfileOpen(true)}
            isPro={isProUser}
          />
        </div>

        <div
          ref={chatRef}
          className="flex-1 min-h-0 overflow-y-auto relative z-10"
          style={{ scrollbarWidth: "none", paddingBottom: "8px" }}
        >
          {hasOnlyWelcomeMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center pt-4 pb-3 px-6"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                style={{
                  background: "radial-gradient(circle, rgba(79,172,254,0.12) 0%, rgba(124,58,237,0.06) 100%)",
                  border: "1.5px solid rgba(79,172,254,0.2)",
                  boxShadow: "0 0 30px rgba(79,172,254,0.12)",
                }}
              >
                <BuddyAvatar size={52} />
              </div>

              <div
                className="px-3 py-1 rounded-full"
                style={{
                  background: "rgba(79,172,254,0.07)",
                  border: "1px solid rgba(79,172,254,0.15)",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "rgba(79,172,254,0.8)",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  {isProUser ? "PRO ACTIVE" : "BASIC PLAN"}
                </span>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col gap-1 pb-2">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id} message={msg} index={i} />
              ))}
              {isTyping && <TypingIndicator key="typing" />}
            </AnimatePresence>
          </div>

          <div ref={bottomRef} />
        </div>

        <div
          className="relative z-10 mt-auto"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,22,36,0) 0%, rgba(10,16,24,0.95) 35%, rgba(10,16,24,1) 100%)",
          }}
        >
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>

        <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        historyItems={chatHistory}
        onDeleteHistory={deleteHistoryItem}
        onNewChat={startNewChat}
        onSelectHistory={loadChatFromHistory}
        onRenameHistory={renameHistoryItem}
        activeChatId={activeChatId}
        isPro={isProUser}
        />

        <UserProfileDrawer
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          onUpgradeClick={() => setUpgradeOpen(true)}
          isPro={isProUser}
          currentPlan={currentPlan}
        />

        <UpgradeModal
          open={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          currentPlan={currentPlan}
          onPlanChange={handlePlanChange}
          onPay={handleUpgradePayment}
        />
      </div>
    </div>
  );
}1