import { motion, AnimatePresence } from "motion/react";
import { X, MessageSquare, Trash2, Plus, Pencil } from "lucide-react";

interface HistoryItem {
  id: string;
  title: string;
  preview: string;
  createdAt?: string;
  updatedAt?: string;
}

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  historyItems: HistoryItem[];
  onDeleteHistory: (id: string) => void;
  onNewChat: () => void;
  onSelectHistory: (id: string) => void;
  onRenameHistory: (id: string, newTitle: string) => void;
  activeChatId: string | null;
}

export function HistoryDrawer({
  open,
  onClose,
  historyItems,
  onDeleteHistory,
  onNewChat,
  onSelectHistory,
  onRenameHistory,
  activeChatId,
}: HistoryDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-20"
            style={{ background: "rgba(5, 10, 20, 0.7)", backdropFilter: "blur(4px)" }}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute left-0 top-0 bottom-0 z-30 flex flex-col"
            style={{
              width: "80%",
              background: "linear-gradient(180deg, #0d1523 0%, #0a1020 100%)",
              borderRight: "1px solid rgba(79, 172, 254, 0.12)",
              boxShadow: "4px 0 40px rgba(0,0,0,0.6)",
            }}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(79, 172, 254, 0.08)" }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#e2e8f0",
                    letterSpacing: "-0.2px",
                  }}
                >
                  Chat History
                </h2>
                <p style={{ fontSize: "11px", color: "rgba(100, 140, 190, 0.7)", marginTop: 2 }}>
                  {historyItems.length} conversations
                </p>
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

            <div className="px-4 pt-4 pb-2">
              <button
                onClick={onNewChat}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(79,172,254,0.15) 0%, rgba(124,58,237,0.12) 100%)",
                  border: "1px solid rgba(79, 172, 254, 0.3)",
                  color: "#7ecfff",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                <Plus size={15} />
                New Conversation
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              {historyItems.length === 0 ? (
                <div
                  className="px-4 py-8 text-center"
                  style={{ color: "rgba(140, 170, 210, 0.6)", fontSize: "13px" }}
                >
                  No chat history yet
                </div>
              ) : (
                historyItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                    onClick={() => onSelectHistory(item.id)}
                    className="w-full text-left flex items-start gap-3 px-3 py-3 rounded-xl group cursor-pointer"
                    style={
                      activeChatId === item.id
                        ? {
                            background: "rgba(79, 172, 254, 0.10)",
                            border: "1px solid rgba(79, 172, 254, 0.25)",
                          }
                        : {
                            background: "transparent",
                            border: "1px solid transparent",
                          }
                    }
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                      style={{
                        background:
                          activeChatId === item.id
                            ? "rgba(79, 172, 254, 0.18)"
                            : "rgba(255,255,255,0.04)",
                        border:
                          activeChatId === item.id
                            ? "1px solid rgba(79, 172, 254, 0.35)"
                            : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <MessageSquare
                        size={14}
                        style={{
                          color:
                            activeChatId === item.id
                              ? "#4facfe"
                              : "rgba(120, 150, 190, 0.5)",
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate"
                        style={{
                          fontSize: "13px",
                          fontWeight: activeChatId === item.id ? 600 : 500,
                          color:
                            activeChatId === item.id
                              ? "#ddeeff"
                              : "rgba(180, 200, 230, 0.75)",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="truncate mt-0.5"
                        style={{ fontSize: "11px", color: "rgba(100, 130, 170, 0.55)" }}
                      >
                        {item.preview}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        className="p-1 rounded"
                        style={{ color: "#4facfe" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const newTitle = prompt("Enter new chat title:");
                          if (newTitle && newTitle.trim() !== "") {
                            onRenameHistory(item.id, newTitle.trim());
                          }
                        }}
                      >
                        <Pencil size={13} />
                      </button>

                      <button
                        type="button"
                        className="p-1 rounded"
                        style={{ color: "rgba(239, 68, 68, 0.6)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHistory(item.id);
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div
              className="px-5 py-4"
              style={{ borderTop: "1px solid rgba(79, 172, 254, 0.08)" }}
            >
              <p style={{ fontSize: "11px", color: "rgba(80, 110, 150, 0.6)", textAlign: "center" }}>
                Buddy AI • Basic plan ({historyItems.length}/10 chats)
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}