// ✅ FINAL SERVER.JS — Complete Stable Version with Gemini + OpenAI fallback
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { LowSync } = require("lowdb");
const { JSONFileSync } = require("lowdb/node");
const { nanoid } = require("nanoid");
const OpenAI = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// Database Setup
// ----------------------------------------------------
const file = path.join(__dirname, "db.json");
const defaultData = {
  users: [],
  mood: [],
  journals: [],
  appointments: [],
  emergencyContacts: [],
  dreams: [],
  community: [],
  assessments: [],   // <---- Already exists (good)
  chatHistory: [],
  resources: [],
  crisis: []
};

const adapter = new JSONFileSync(file);
const db = new LowSync(adapter, defaultData);
db.read();
if (!db.data) {
  db.data = defaultData;
  db.write();
}

// ----------------------------------------------------
// Logger Middleware
// ----------------------------------------------------
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ----------------------------------------------------
// Crisis
// ----------------------------------------------------
app.get("/api/crisis", async (req, res) => {
  await db.read();
  res.json(db.data.crisis || []);
});

// ----------------------------------------------------
// Resources
// ----------------------------------------------------
app.get("/api/resources", async (req, res) => {
  await db.read();
  res.json(db.data.resources || []);
});

// ----------------------------------------------------
// AI Chatbot (Gemini + OpenAI fallback)
// ----------------------------------------------------
app.post("/api/chatbot", async (req, res) => {
  const { message } = req.body;

  console.log("🗨️ Incoming message:", message);
  console.log(`🔑 Gemini key: ${process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌"}`);
  console.log(`🔑 OpenAI key: ${process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌"}`);

  if (!message?.trim()) {
    return res.json({ reply: "Please tell me how you feel 💬" });
  }

  try {
    let reply = "⚠️ Unable to respond right now.";

    if (process.env.GEMINI_API_KEY) {
      try {
        console.log("🤖 Using Gemini API...");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
          model: "models/gemini-1.5-flash-latest",
        });

        const prompt = `
You are MindMate, a warm and supportive mental health assistant.
User said: "${message}"
Respond with care and empathy (1–3 sentences).
        `;

        const result = await model.generateContent(prompt);
        reply = result.response.text();
      } catch (err) {
        console.log("⚠️ Gemini failed, switching to OpenAI…");

        if (process.env.OPENAI_API_KEY) {
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are MindMate, a kind and calm AI support system.",
              },
              { role: "user", content: message },
            ],
          });

          reply = completion.choices[0].message.content;
        }
      }
    }

    console.log("💬 AI Reply:", reply);
    res.json({ reply });

  } catch (error) {
    console.log("❌ AI Chatbot Error:", error);
    res.json({
      reply: "⚠️ Sorry, my system is overloaded. Try again soon! 💙",
    });
  }
});

// ----------------------------------------------------
// Chat History
// ----------------------------------------------------
app.get("/api/chatHistory", async (req, res) => {
  await db.read();
  res.json(db.data.chatHistory || []);
});

app.post("/api/chatHistory", async (req, res) => {
  const { sender, text } = req.body;

  await db.read();
  db.data.chatHistory.push({
    id: nanoid(),
    sender,
    text,
    createdAt: new Date().toISOString(),
  });

  await db.write();
  res.status(201).json({ success: true });
});

app.delete("/api/chatHistory", async (req, res) => {
  await db.read();
  db.data.chatHistory = [];
  await db.write();
  res.json({ success: true });
});

// ----------------------------------------------------
// 🔥 These return arrays
// ----------------------------------------------------
app.get("/api/mood", (req, res) => {
  db.read();
  res.json(db.data.mood || []);
});
app.get("/api/journals", (req, res) => {
  db.read();
  res.json(db.data.journals || []);
});
app.get("/api/appointments", (req, res) => {
  db.read();
  res.json(db.data.appointments || []);
});
app.get("/api/dreams", (req, res) => {
  db.read();
  res.json(db.data.dreams || []);
});

// ----------------------------------------------------
// Mood — CREATE
// ----------------------------------------------------
app.post("/api/mood", (req, res) => {
  const { userId, mood, note, energy } = req.body;

  const entry = {
    id: nanoid(),
    userId: userId || "anon",
    mood,
    note: note || "",
    energy: typeof energy === "number" ? energy : 5,
    createdAt: new Date().toISOString(),
  };

  db.read();
  db.data.mood.push(entry);
  db.write();

  res.status(201).json(entry);
});

// Mood — USER SPECIFIC
app.get("/api/mood/:userId", (req, res) => {
  const { userId } = req.params;
  db.read();

  const results = db.data.mood
    .filter((m) => m.userId === userId)
    .map((m) => ({
      date: m.createdAt,
      score: m.mood,
      note: m.note || "",
      energy: m.energy || 0,
    }));

  res.json(results);
});

// ----------------------------------------------------
// Journals — USER SPECIFIC
// ----------------------------------------------------
app.get("/api/journals/:userId", (req, res) => {
  const { userId } = req.params;
  db.read();

  const results = db.data.journals
    .filter((j) => j.userId === userId)
    .map((j) => ({
      text: j.content,
      createdAt: j.createdAt,
    }));

  res.json(results);
});

// ----------------------------------------------------
// Appointments — CREATE
// ----------------------------------------------------
app.post("/api/appointments", (req, res) => {
  const { userId, name, email, date, slot } = req.body;

  const appt = {
    id: nanoid(),
    userId: userId || "anon",
    name,
    email,
    date,
    slot,
    status: "booked",
    createdAt: new Date().toISOString(),
  };

  db.read();
  db.data.appointments.push(appt);
  db.write();

  res.status(201).json(appt);
});

// Appointments — USER SPECIFIC
app.get("/api/appointments/:userId", (req, res) => {
  const { userId } = req.params;
  db.read();

  const results = db.data.appointments
    .filter((a) => a.userId === userId)
    .map((a) => ({
      date: a.date,
      time: a.slot,
      status: a.status,
    }));

  res.json(results);
});

// ----------------------------------------------------
// Dreams — CREATE
// ----------------------------------------------------
app.post("/api/dreams", async (req, res) => {
  const { userId, title, description, emotions, clarity, sleepQuality } =
    req.body;

  if (!title || !description)
    return res.status(400).json({ error: "Title & description required" });

  const dream = {
    id: nanoid(),
    userId: userId || "anon",
    title,
    description,
    emotions: emotions || "Neutral",
    clarity: clarity || "Average",
    sleepQuality: sleepQuality || "Good",
    createdAt: new Date().toISOString(),
  };

  await db.read();
  db.data.dreams.push(dream);
  await db.write();

  res.status(201).json(dream);
});

// Dreams — USER SPECIFIC
app.get("/api/dreams/:userId", (req, res) => {
  const { userId } = req.params;
  db.read();

  const results = db.data.dreams
    .filter((d) => d.userId === userId)
    .map((d) => ({
      description: d.description,
      createdAt: d.createdAt,
    }));

  res.json(results);
});

// ----------------------------------------------------
// Community
// ----------------------------------------------------
app.get("/api/community", async (req, res) => {
  await db.read();
  res.json(db.data.community || []);
});

app.post("/api/community", async (req, res) => {
  const { userId, name, message, topic } = req.body;

  if (!message)
    return res.status(400).json({ error: "Message is required" });

  await db.read();
  const post = {
    id: nanoid(),
    userId: userId || "anon",
    name: name || "Anonymous",
    message,
    topic: topic || "General",
    likes: 0,
    createdAt: new Date().toISOString(),
  };

  db.data.community.push(post);
  await db.write();

  res.status(201).json(post);
});

app.post("/api/community/:id/like", async (req, res) => {
  await db.read();

  const post = db.data.community.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  post.likes++;
  await db.write();

  res.json({ success: true, likes: post.likes });
});

// ----------------------------------------------------
// Institution Dashboard Stats
// ----------------------------------------------------
app.get("/api/institution-stats", async (req, res) => {
  await db.read();
  const data = db.data;

  const totalUsers = new Set(data.mood.map((m) => m.userId)).size;
  const totalAppointments = data.appointments.length;

  const moodCounts = data.mood.reduce((acc, m) => {
    acc[m.mood] = (acc[m.mood] || 0) + 1;
    return acc;
  }, {});

  res.json({
    totalUsers,
    totalAppointments,
    moodCounts,
    lastUpdated: new Date().toISOString(),
  });
});

// ----------------------------------------------------
// 🚨 Emergency Contacts — FIXED & ADDED
// ----------------------------------------------------

// GET all emergency contacts
app.get("/api/emergency-contacts", async (req, res) => {
  await db.read();
  res.json(db.data.emergencyContacts || []);
});

// CREATE new contact
app.post("/api/emergency-contacts", async (req, res) => {
  const { name, phone, relation } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required" });
  }

  await db.read();
  const newContact = {
    id: nanoid(),
    name,
    phone,
    relation: relation || "",
    createdAt: new Date().toISOString(),
  };

  db.data.emergencyContacts.push(newContact);
  await db.write();

  res.status(201).json(newContact);
});

// DELETE contact
app.delete("/api/emergency-contacts/:id", async (req, res) => {
  const { id } = req.params;

  await db.read();
  db.data.emergencyContacts = db.data.emergencyContacts.filter(
    (c) => c.id !== id
  );
  await db.write();

  res.json({ success: true, deletedId: id });
});

// ----------------------------------------------------
// ⭐ ASSESSMENTS — Save | History | Delete
// ----------------------------------------------------

// POST — SAVE assessment result
app.post("/api/assessments", async (req, res) => {
  const { userId, type, score, level } = req.body;

  if (!userId || !type || score === undefined) {
    return res.status(400).json({ error: "Missing fields (userId, type, score)" });
  }

  const entry = {
    id: nanoid(),
    userId,
    type,
    score,
    level,
    date: new Date().toISOString(),
  };

  await db.read();
  db.data.assessments.push(entry);
  await db.write();

  res.status(201).json({ success: true, entry });
});

// GET — Fetch history (with filter ?type=PSS10)
app.get("/api/assessments/history/:userId", async (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;

  await db.read();

  let results = db.data.assessments.filter((a) => a.userId === userId);

  if (type) {
    results = results.filter((a) => a.type === type);
  }

  // newest first
  results.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(results);
});

// DELETE — Remove single assessment
app.delete("/api/assessments/:id", async (req, res) => {
  const { id } = req.params;

  await db.read();
  const exists = db.data.assessments.some((a) => a.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Assessment not found" });
  }

  db.data.assessments = db.data.assessments.filter((a) => a.id !== id);
  await db.write();

  res.json({ success: true, deletedId: id });
});

// ----------------------------------------------------
// Start Server
// ----------------------------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(
    `🔑 Gemini key: ${
      process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌"
    } | OpenAI key: ${
      process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌"
    }`
  );
});
