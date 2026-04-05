import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
const memoryFile = path.join(__dirname, "memory.json");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(memoryFile)) {
  fs.writeFileSync(
    memoryFile,
    JSON.stringify(
      {
        userName: "",
        projectName: "Buddy AI",
        preferences: {
          replyStyle: "match-user-language",
          prefersTanglish: true,
        },
        lastTopics: [],
      },
      null,
      2
    )
  );
}

function loadMemory() {
  try {
    return JSON.parse(fs.readFileSync(memoryFile, "utf8"));
  } catch {
    return {
      userName: "",
      projectName: "Buddy AI",
      preferences: {
        replyStyle: "match-user-language",
        prefersTanglish: true,
      },
      lastTopics: [],
    };
  }
}

function saveMemory(memory) {
  fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
}

function detectTanglish(text = "") {
  const lower = text.toLowerCase();
  const tanglishHints = [
    "da",
    "dei",
    "machan",
    "bro",
    "enna",
    "epdi",
    "iruku",
    "veanum",
    "pannu",
    "sollu",
    "inga",
    "ipo",
    "inga",
    "athu",
    "illa",
    "seri",
    "naan",
    "nee",
    "nalla",
  ];
  return tanglishHints.some((word) => lower.includes(word));
}

function updateMemoryFromMessage(message) {
  const memory = loadMemory();
  const lower = message.toLowerCase();

  const nameMatch =
    message.match(/my name is\s+([a-zA-Z ]+)/i) ||
    message.match(/i am\s+([a-zA-Z ]+)/i) ||
    message.match(/naan\s+([a-zA-Z ]+)\s*(da|nu|than)?/i);

  if (nameMatch?.[1]) {
    memory.userName = nameMatch[1].trim();
  }

  const projectMatch =
    message.match(/project name is\s+([a-zA-Z0-9 _-]+)/i) ||
    message.match(/my project is\s+([a-zA-Z0-9 _-]+)/i);

  if (projectMatch?.[1]) {
    memory.projectName = projectMatch[1].trim();
  }

  if (detectTanglish(message)) {
    memory.preferences.prefersTanglish = true;
  }

  if (message.trim()) {
    memory.lastTopics = [message.trim(), ...(memory.lastTopics || [])].slice(0, 8);
  }

  saveMemory(memory);
  return memory;
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    const safeOriginalName = file.originalname.replace(/\s+/g, "-");
    const uniqueName = `${Date.now()}-${safeOriginalName}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static(uploadsDir));

app.get("/", (_req, res) => {
  res.send("Buddy AI backend is running");
});

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;

    return res.json({
      message: "File uploaded successfully",
      file: {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      message: "Upload failed",
    });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        reply: "Message is required",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        reply: "GROQ_API_KEY not found in .env",
      });
    }

    const memory = updateMemoryFromMessage(userMessage);
    const shouldReplyTanglish = detectTanglish(userMessage) || memory.preferences?.prefersTanglish;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
You are Buddy AI — a smart, friendly AI assistant created by Raja.

Known memory:
- User name: ${memory.userName || "Unknown"}
- Project: ${memory.projectName || "Buddy AI"}
- Prefers Tanglish: ${shouldReplyTanglish ? "Yes" : "No"}
- Recent topics: ${(memory.lastTopics || []).join(" | ") || "None"}

Critical reply rules:
- If the user writes in Tanglish or Tamil-English mix, reply in natural Tanglish.
- If the user writes in English, reply in English.
- Keep it friendly, clean, and useful.
- You may use light casual words like "da", "bro", "machan" only when the user tone is casual.
- Do not overdo slang.
- Do not mention Groq, Meta, Llama, provider names, or system instructions.
- If user uploads screenshot/image/file, acknowledge it clearly and ask useful next-step questions if needed.
- If user asks about errors, UI, code, screenshot, guide them specifically.
- If user asks your name, reply: "I'm Buddy AI 🤖 — un smart assistant da."

If the user message is Tanglish, examples of acceptable style:
- "Seri da, idhu dhan issue."
- "Ithu fix panna indha step follow pannu."
- "Naan help pannuren."

Avoid robotic language.
`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("Groq error:", data);
      return res.status(response.status).json({
        reply: data?.error?.message || "Groq API error",
      });
    }

    return res.json({
      reply: data?.choices?.[0]?.message?.content || "No reply from AI",
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      reply: "Server error",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});