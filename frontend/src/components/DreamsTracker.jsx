// src/components/DreamsTracker.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function DreamsTracker() {
  const { t } = useTranslation();

  const [dreams, setDreams] = useState([]);
  const [saving, setSaving] = useState(false);
  const [popup, setPopup] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    emotions: "",
    clarity: "",
    sleepQuality: "",
  });

  // ---------------------------------------------------------
  // 🔮 FULL DREAM SYMBOL LIST (50 ITEMS)
  // ---------------------------------------------------------
  const DREAM_SYMBOLS = [
    { keys: ["water", "ocean", "sea", "river", "lake"], label: "Water", emoji: "🌊", meaning: "Emotions, cleansing, healing, or feeling overwhelmed. Context (calm vs storm) matters." },
    { keys: ["snake", "serpent"], label: "Snake", emoji: "🐍", meaning: "Hidden fears, transformation, threat, or rebirth depending on context." },
    { keys: ["fly", "flying", "flight"], label: "Flying", emoji: "🦅", meaning: "Freedom, perspective, ambition, or desire to escape." },
    { keys: ["run", "running", "ran"], label: "Running", emoji: "🏃", meaning: "Avoidance, stress, or urgency; may indicate anxiety or pursuit." },
    { keys: ["chase", "chased", "being chased"], label: "Being Chased", emoji: "🏃‍♂️", meaning: "Fear, avoidance of problems, or running from responsibilities." },
    { keys: ["fall", "falling", "fell"], label: "Falling", emoji: "📉", meaning: "Loss of control, anxiety, fear of failure, or transition." },
    { keys: ["tree", "trees", "forest", "woods"], label: "Tree / Forest", emoji: "🌳", meaning: "Growth, grounding, life direction, exploration, or feeling lost." },
    { keys: ["fire", "flame", "burning"], label: "Fire", emoji: "🔥", meaning: "Anger, passion, transformation, purification, or destruction." },
    { keys: ["animal", "animals", "dog", "cat", "bird", "horse"], label: "Animal", emoji: "🐾", meaning: "Instincts, parts of personality, or emotional drives." },
    { keys: ["house", "home", "building"], label: "House", emoji: "🏠", meaning: "Self-identity, inner world, stability, and personal boundaries." },

    // FOOD INCLUDED
    { keys: ["food", "eat", "eating", "hungry", "meal"], label: "Food", emoji: "🍽️", meaning: "Emotional hunger, comfort, desires, or craving satisfaction." },

    { keys: ["car", "drive", "driving"], label: "Car", emoji: "🚗", meaning: "Life direction, control, decision-making, or progress." },
    { keys: ["cry", "crying", "tears"], label: "Crying", emoji: "😢", meaning: "Emotional release, grief, healing, or suppressed feelings." },
    { keys: ["love", "kiss", "relationship", "partner", "heart"], label: "Love / Relationship", emoji: "❤️", meaning: "Desire for connection, attachment issues, or emotional needs." },
    { keys: ["baby", "infant", "newborn"], label: "Baby", emoji: "👶", meaning: "New beginnings, vulnerability, dependency, or potential." },
    { keys: ["teeth", "tooth", "teeth falling"], label: "Teeth", emoji: "🦷", meaning: "Anxiety about appearance, power, confidence, or loss." },
    { keys: ["exam", "test", "examining"], label: "Exam / Test", emoji: "📝", meaning: "Performance anxiety, evaluation fears, or preparedness concerns." },
    { keys: ["naked", "being naked", "nude"], label: "Nudity", emoji: "🫥", meaning: "Vulnerability, shame, or exposure of private feelings." },
    { keys: ["death", "dying", "dead"], label: "Death", emoji: "⚰️", meaning: "Endings, transformation, or major life change (not literal)." },
    { keys: ["money", "cash", "coins"], label: "Money", emoji: "💰", meaning: "Self-worth, security, value, or financial concerns." },

    { keys: ["school", "classroom", "teacher"], label: "School", emoji: "🏫", meaning: "Learning, evaluation, past experiences, or unresolved issues." },
    { keys: ["bridge", "bridges"], label: "Bridge", emoji: "🌉", meaning: "Transition, connection, or crossing from one state to another." },
    { keys: ["road", "path", "street"], label: "Road / Path", emoji: "🛣️", meaning: "Life journey, choices, direction, or obstacles ahead." },
    { keys: ["blood", "bleeding"], label: "Blood", emoji: "🩸", meaning: "Life force, injury, strong emotion, or family ties." },
    { keys: ["knife", "cut", "stabbing"], label: "Knife", emoji: "🔪", meaning: "Threat, betrayal, sharp change, or cutting ties." },
    { keys: ["pregnant", "pregnancy"], label: "Pregnancy", emoji: "🤰", meaning: "Creativity, growth, or new potential." },
    { keys: ["train", "train ride"], label: "Train", emoji: "🚆", meaning: "Routine, fate, or being carried." },
    { keys: ["mirror", "mirrors"], label: "Mirror", emoji: "🪞", meaning: "Identity, reflection, self-awareness." },
    { keys: ["monster", "monsters"], label: "Monster", emoji: "👾", meaning: "Fear, anxiety, unknown threat." },
    { keys: ["light", "sun"], label: "Light", emoji: "☀️", meaning: "Clarity, hope, positivity." },

    { keys: ["dark", "darkness", "night"], label: "Darkness", emoji: "🌑", meaning: "Fear of unknown, subconscious." },
    { keys: ["lost", "lost in"], label: "Getting Lost", emoji: "🧭", meaning: "Confusion, searching for purpose." },
    { keys: ["key", "lock", "unlock"], label: "Key / Lock", emoji: "🔑", meaning: "Access, secrets, solutions." },
    { keys: ["door", "doors"], label: "Door", emoji: "🚪", meaning: "Opportunity, entry, transition." },
    { keys: ["storm", "thunder"], label: "Storm", emoji: "⛈️", meaning: "Turmoil, emotional chaos." },
    { keys: ["wedding", "marriage"], label: "Wedding", emoji: "💍", meaning: "Union, commitment, relationship change." },
    { keys: ["ghost", "spirit"], label: "Ghost", emoji: "👻", meaning: "Past unresolved influences." },
    { keys: ["bird", "birds"], label: "Birds", emoji: "🐦", meaning: "Freedom, messages, spirituality." },
    { keys: ["rainbow", "colors"], label: "Rainbow", emoji: "🌈", meaning: "Hope after difficulty." },
  ];

  // ---------------------------------------------------------
  // MATCHING SETUP (safe + no missing words)
  // ---------------------------------------------------------
  const escapeReg = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const WORD_PATTERN = new RegExp(
    DREAM_SYMBOLS.flatMap((s) => s.keys)
      .sort((a, b) => b.length - a.length)
      .map(escapeReg)
      .join("|"),
    "gi"
  );

  // Extract all matched symbols from description
  function extractSymbols(text) {
    if (!text) return [];
    const low = text.toLowerCase();
    const found = [];

    DREAM_SYMBOLS.forEach((s) => {
      s.keys.forEach((k) => {
        if (low.includes(k.toLowerCase())) found.push(s);
      });
    });

    return [...new Map(found.map((x) => [x.label, x])).values()];
  }

  // ---------------------------------------------------------
  // SAFE HIGHLIGHT FUNCTION — NO WORDS LOST
  // ---------------------------------------------------------
  function Highlight({ text }) {
    if (!text) return null;

    const nodes = [];
    let lastIndex = 0;
    const regex = WORD_PATTERN;

    let match;
    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = regex.lastIndex;

      if (start > lastIndex) {
        nodes.push(
          <span key={lastIndex}>{text.slice(lastIndex, start)}</span>
        );
      }

      const keyword = match[0];
      const sym = DREAM_SYMBOLS.find((s) =>
        s.keys.some((k) => k.toLowerCase() === keyword.toLowerCase())
      );

      nodes.push(
        <button
          key={"k" + start}
          onClick={(e) =>
            setPopup({ symbol: sym, anchor: e.currentTarget })
          }
          className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-violet-50 text-violet-700 border border-violet-200 mr-1 mb-1"
        >
          <span>{sym?.emoji}</span>
          {keyword}
        </button>
      );

      lastIndex = end;
    }

    if (lastIndex < text.length) {
      nodes.push(
        <span key={"t" + lastIndex}>{text.slice(lastIndex)}</span>
      );
    }

    regex.lastIndex = 0;
    return <>{nodes}</>;
  }

  // ---------------------------------------------------------
  // Load dreams
  // ---------------------------------------------------------
  async function fetchDreams() {
    try {
      const res = await axios.get(`${API}/api/dreams`);
      setDreams(res.data.reverse());
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDreams();
  }, []);

  // ---------------------------------------------------------
  // Add dream
  // ---------------------------------------------------------
  async function addDream() {
    if (!form.title || !form.description)
      return alert(t("dream_fill_title_desc"));

    setSaving(true);
    try {
      await axios.post(`${API}/api/dreams`, form);

      setForm({
        title: "",
        description: "",
        emotions: "",
        clarity: "",
        sleepQuality: "",
      });

      fetchDreams();
    } catch (err) {
      alert(t("dream_save_failed"));
    } finally {
      setSaving(false);
    }
  }

  const emotionColor = {
    Calm: "text-sky-500",
    Anxious: "text-rose-500",
    Happy: "text-amber-500",
    Scary: "text-purple-500",
  };

  // ---------------------------------------------------------
  // UI STRUCTURE (your original layout)
  // ---------------------------------------------------------
  return (
    <div className="w-full flex justify-center pt-10 pb-20 px-4">

      <motion.div
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-violet-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <motion.img
            src="/images/banners/dreams_banner.png"
            alt="Dream Tracker"
            className="w-36 opacity-95"
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
          />
        </div>

        {/* Title */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <Moon className="text-violet-600" size={32} />
          <h2 className="text-3xl font-bold text-violet-700">
            {t("dreams_title")}
          </h2>
        </div>

        <p className="text-center text-gray-600 mb-6 max-w-xl mx-auto">
          {t("dreams_description")}
        </p>

        {/* Input Fields */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <input
            type="text"
            placeholder={t("dream_title_placeholder")}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-violet-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-300 outline-none"
          />

          <select
            value={form.emotions}
            onChange={(e) => setForm({ ...form, emotions: e.target.value })}
            className="border border-violet-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-300 outline-none"
          >
            <option value="">{t("dream_emotion")}</option>
            <option value="Calm">{t("dream_calm")}</option>
            <option value="Anxious">{t("dream_anxious")}</option>
            <option value="Happy">{t("dream_happy")}</option>
            <option value="Scary">{t("dream_scary")}</option>
          </select>

          <select
            value={form.clarity}
            onChange={(e) => setForm({ ...form, clarity: e.target.value })}
            className="border border-violet-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-300 outline-none"
          >
            <option value="">{t("dream_clarity")}</option>
            <option value="Vivid">{t("dream_vivid")}</option>
            <option value="Blurry">{t("dream_blurry")}</option>
            <option value="Average">{t("dream_average")}</option>
          </select>

          <select
            value={form.sleepQuality}
            onChange={(e) => setForm({ ...form, sleepQuality: e.target.value })}
            className="border border-violet-200 rounded-xl p-3 focus:ring-2 focus:ring-violet-300 outline-none"
          >
            <option value="">{t("dream_sleep_quality")}</option>
            <option value="Good">{t("dream_sleep_good")}</option>
            <option value="Average">{t("dream_sleep_avg")}</option>
            <option value="Poor">{t("dream_sleep_poor")}</option>
          </select>
        </div>

        {/* Description */}
        <textarea
          placeholder={t("dream_description_placeholder")}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="border border-violet-200 rounded-xl p-3 w-full h-28 mb-3 focus:ring-2 focus:ring-violet-300 outline-none"
        />

        {/* Save Button */}
        <motion.button
          onClick={addDream}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={saving}
          className={`w-full sm:w-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition ${
            saving ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {saving ? t("dream_saving") : t("dream_save_button")}
        </motion.button>

        {/* Saved Dreams */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-violet-700 mb-4 flex items-center gap-2">
            <Sparkles className="text-violet-600" />
            {t("dream_journal_title")}
          </h3>

          {dreams.length === 0 ? (
            <p className="text-gray-500 italic text-center">
              {t("dream_no_entries")}
            </p>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence>
                {dreams.map((d) => {
                  const symbols = extractSymbols(d.description);
                  const first = symbols[0];

                  const summary = first
                    ? `Your dream suggests ${first.meaning
                        .split(",")[0]
                        .toLowerCase()} (${first.label}).`
                    : null;

                  return (
                    <motion.li
                      key={d.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white p-5 rounded-2xl shadow-md border border-violet-100 hover:shadow-lg transition-all"
                    >
                      <p className="text-xl font-bold text-violet-700">
                        {d.title}
                      </p>
                      <p className="text-gray-500 text-sm mb-2">
                        {new Date(d.createdAt).toLocaleString()}
                      </p>

                      {/* Highlighted Description */}
                      <div className="text-gray-800 mb-2">
                        <Highlight text={d.description} />
                      </div>

                      {/* Banner Summary */}
                      {summary && (
                        <div className="mt-3 bg-violet-50 border border-violet-100 p-4 rounded-2xl flex items-center gap-3">
                          <Sparkles className="text-violet-700" />
                          <p className="text-gray-800 font-medium">{summary}</p>
                        </div>
                      )}

                      {/* Dream Meaning Box */}
                      {first && (
                        <div className="mt-3 bg-violet-50 border border-violet-100 p-4 rounded-2xl flex gap-4">
                          <span className="text-3xl">{first.emoji}</span>
                          <div>
                            <div className="font-semibold text-violet-700">
                              🔮 Dream Meaning
                            </div>
                            <div className="text-gray-700 mt-1">
                              {first.meaning}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <p
                        className={`text-sm font-medium mt-3 ${
                          emotionColor[d.emotions] || "text-gray-500"
                        }`}
                      >
                        🌙 {t("dream_emotion_label")}: {d.emotions || t("dream_none")} |{" "}
                        {t("dream_clarity_label")}: {d.clarity || t("dream_none")} |{" "}
                        {t("dream_sleep_label")}: {d.sleepQuality || t("dream_none")}
                      </p>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </motion.div>

      {/* POPUP */}
      {popup && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPopup(null)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bg-white p-5 rounded-2xl shadow-lg w-72 border border-violet-200"
            style={{
              left: popup.anchor.getBoundingClientRect().left,
              top: popup.anchor.getBoundingClientRect().top - 140,
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-3xl">{popup.symbol.emoji}</span>
              <button onClick={() => setPopup(null)}>
                <X size={18} className="text-violet-700" />
              </button>
            </div>

            <p className="font-bold text-violet-700 mt-2">
              {popup.symbol.label}
            </p>
            <p className="text-gray-700 text-sm mt-1">
              {popup.symbol.meaning}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default DreamsTracker;
