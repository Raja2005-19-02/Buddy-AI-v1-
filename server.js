import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import multer from "multer";
import crypto from "crypto";
import Razorpay from "razorpay";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");
const memoryFile = path.join(__dirname, "memory.json");
const distDir = path.join(__dirname, "dist");

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

function detectLanguage(text = "") {
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
    "venum",
    "pannu",
    "sollu",
    "inga",
    "ipo",
    "ippo",
    "athu",
    "illa",
    "seri",
    "naan",
    "nee",
    "nalla",
    "saptiya",
    "panra",
    "venuma",
  ];

  const score = tanglishHints.reduce(
    (count, word) => count + (lower.includes(word) ? 1 : 0),
    0
  );

  return score >= 2 ? "tanglish" : "english";
}

function updateMemoryFromMessage(message = "") {
  const memory = loadMemory();

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

  if (detectLanguage(message) === "tanglish") {
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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

app.use("/uploads", express.static(uploadsDir));

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

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

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || req.body.userMessage;

    if (!userMessage) {
      return res.status(400).json({
        reply: "Please type a message.",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        reply: "GROQ_API_KEY not found in environment",
      });
    }

    const memory = updateMemoryFromMessage(userMessage);
    const detectedLanguage = detectLanguage(userMessage);

    let systemPrompt = "";

    if (detectedLanguage === "tanglish") {
      systemPrompt = `
You are Buddy AI.

Speak like a smart, helpful Tamil Nadu friend in Tanglish.

Rules:
- Reply in Tanglish when the user writes in Tanglish.
- Understand spelling mistakes and casual typing.
- Be respectful and useful.
- Give detailed explanation.
- Do not speak like a child.
- Be friendly but professional.
- Help with coding, studies, apps, project work, ideas, and technical issues.
- If user asks technical help, explain step by step.
- Do not give over-short answers.
- If code is needed, give clean correct code.
- If unsure, say what is uncertain briefly instead of guessing.

Known memory:
- User name: ${memory.userName || "Unknown"}
- Project: ${memory.projectName || "Buddy AI"}
- Recent topics: ${(memory.lastTopics || []).join(" | ") || "None"}
`;
    } else {
      systemPrompt = `
You are Buddy AI.

You are a professional AI assistant.

Rules:
- Reply in clear English when the user writes in English.
- Understand spelling mistakes.
- Give detailed and useful answers.
- Be accurate, practical, and professional.
- Do not sound childish.
- If the user asks for technical help, explain step by step.
- If the user asks for code, provide correct clean code.
- Avoid overly short answers.
- If unsure, state uncertainty briefly instead of guessing.

Known memory:
- User name: ${memory.userName || "Unknown"}
- Project: ${memory.projectName || "Buddy AI"}
- Recent topics: ${(memory.lastTopics || []).join(" | ") || "None"}
`;
    }

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
            content: systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq error:", data);
      return res.status(response.status).json({
        reply: data?.error?.message || "AI error",
      });
    }

    return res.json({
      reply: data?.choices?.[0]?.message?.content || "No reply from AI",
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      reply: "Connection weak ah iruku da. Reload pannitu illa konjam apram try pannu.",
    });
  }
});

/* Razorpay create order */
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, planId } = req.body;

    if (!amount || !planId) {
      return res.status(400).json({
        success: false,
        message: "Amount and planId are required",
      });
    }

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `buddy_${planId}_${Date.now()}`,
      notes: {
        app: "Buddy AI",
        planId,
      },
    });

    return res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create order",
    });
  }
});

/* Razorpay verify payment */
app.post("/api/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({
        success: true,
        message: "Payment verified successfully",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));

  app.get(/.*/, (req, res, next) => {
    if (
      req.path.startsWith("/api/chat") ||
      req.path.startsWith("/api/upload") ||
      req.path.startsWith("/api/create-order") ||
      req.path.startsWith("/api/verify-payment") ||
      req.path.startsWith("/uploads")
    ) {
      return next();
    }

    return res.sendFile(path.join(distDir, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.send("Buddy AI backend is running");
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});