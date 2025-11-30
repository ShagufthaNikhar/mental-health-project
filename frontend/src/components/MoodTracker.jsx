// src/components/MoodTracker.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Smile,
  Frown,
  Meh,
  Heart,
  Sun,
  Battery,
  BatteryMedium,
  BatteryFull,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function MoodTracker({ userId }) {
  const { t } = useTranslation();

  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mood Icons
  const moodIcons = {
    1: <Frown className="text-red-400" size={32} />,
    2: <Meh className="text-orange-400" size={32} />,
    3: <Smile className="text-yellow-400" size={32} />,
    4: <Heart className="text-green-500" size={32} />,
    5: <Sun className="text-amber-400" size={32} />,
  };

  // Energy Icons
  const energyIcons = {
    low: <Battery className="text-red-500" size={28} />,
    medium: <BatteryMedium className="text-yellow-500" size={28} />,
    high: <BatteryFull className="text-green-500" size={28} />,
  };

  // Fetch entries
  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const res = await axios.get(`${API}/api/mood`);
      setEntries(res.data || []);
    } catch (err) {
      console.log("Error:", err);
    }
  }

  // Save mood entry
  async function saveMood() {
    if (loading) return;
    setLoading(true);

    try {
      await axios.post(`${API}/api/mood`, {
        userId: userId,
        mood,
        energy,
        note,
      });
      setNote("");
      fetchEntries();
    } catch {
      alert("Error saving entry");
    } finally {
      setLoading(false);
    }
  }

  // Chart Data
  const chartData = entries.map((e) => ({
    date: new Date(e.createdAt).toLocaleDateString(),
    mood: e.mood,
    energy: e.energy,
  }));

  // Weekly Insights (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const weeklyEntries = entries.filter((e) => {
    const d = new Date(e.createdAt);
    return d >= sevenDaysAgo && d <= now;
  });

  const avgMood =
    weeklyEntries.length > 0
      ? (
          weeklyEntries.reduce((sum, e) => sum + e.mood, 0) /
          weeklyEntries.length
        ).toFixed(1)
      : null;

  const avgEnergy =
    weeklyEntries.length > 0
      ? (
          weeklyEntries.reduce((sum, e) => sum + (e.energy || 5), 0) /
          weeklyEntries.length
        ).toFixed(1)
      : null;

  // Best Day
  let bestDay = null;
  if (weeklyEntries.length > 0) {
    bestDay = weeklyEntries.reduce((best, entry) => {
      const score = entry.mood + (entry.energy || 5);
      const bestScore = best.mood + (best.energy || 5);
      return score > bestScore ? entry : best;
    });
  }

  // Worst Day
  let worstDay = null;
  if (weeklyEntries.length > 0) {
    worstDay = weeklyEntries.reduce((worst, entry) =>
      entry.mood < worst.mood ? entry : worst
    );
  }

  // Tips logic
  let moodTip = "";
  let energyTip = "";
  let generalTip = "";

  if (weeklyEntries.length === 0) {
    moodTip = "Track your mood regularly to get personalized tips!";
  } else {
    const first = weeklyEntries[0].mood;
    const last = weeklyEntries[weeklyEntries.length - 1].mood;

    if (last > first + 1) {
      moodTip = "Your mood is improving! Keep it up 💛";
    } else if (last < first - 1) {
      moodTip = "Your mood dipped. Try rest and self-care 💙";
    } else {
      moodTip = "Your mood is stable this week. Maintain your routine 🌼";
    }

    const avgE = Number(avgEnergy);

    if (avgE <= 4) {
      energyTip =
        "Your energy seems low. Try sleep, hydration, and light activity 🔋😴";
    } else if (avgE >= 7) {
      energyTip =
        "Great energy this week! Continue your healthy habits ⚡💚";
    } else {
      energyTip =
        "Moderate energy — take short breaks, stretch, and stay hydrated 😊";
    }

    const lowMoods = weeklyEntries.filter((e) => e.mood <= 2).length;

    if (lowMoods >= 3) {
      generalTip =
        "You had a few tough days. Be kind to yourself and talk to someone 💗";
    } else {
      generalTip = "You're doing well staying aware of your emotional health 🌱";
    }
  }

  return (
    <motion.div
      className="p-8 rounded-3xl w-full max-w-3xl mx-auto mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* ----------------------------- HEADER ----------------------------- */}
      <div className="flex flex-col items-center mb-10">
        <img
          src="/images/banners/mood_banner.png"
          className="w-24 h-24 mb-4 opacity-90"
        />
        <h2 className="text-3xl font-bold text-[#12486B]">
          🌤️ {t("mood_tracker")}
        </h2>
      </div>

      {/* ----------------------------- INPUT SECTION ----------------------------- */}
      <div className="bg-white p-6 rounded-3xl shadow-md border border-sky-100 mb-12">
        {/* Mood */}
        <h3 className="text-xl font-semibold text-center mb-2">
          {t("mood_question")}
        </h3>

        <div className="flex items-center justify-center gap-5 mb-3">
          {moodIcons[mood]}
          <input
            type="range"
            min="1"
            max="5"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-2/3 accent-sky-600"
          />
        </div>

        {/* Energy */}
        <h3 className="text-xl font-semibold text-center mb-3 mt-6">
          ⚡ Energy Level
        </h3>

        <div className="flex items-center justify-center gap-5 mb-3">
          {energy <= 3
            ? energyIcons.low
            : energy <= 7
            ? energyIcons.medium
            : energyIcons.high}

          <input
            type="range"
            min="0"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-2/3 accent-green-600"
          />
        </div>

        {/* Note */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-3 border border-sky-200 rounded-xl"
          placeholder={t("mood_placeholder")}
        />

        {/* Save */}
        <button
          onClick={saveMood}
          className="w-full py-3 mt-4 bg-sky-600 text-white rounded-xl shadow hover:bg-sky-700"
        >
          Save Entry
        </button>
      </div>

      {/* ----------------------------- 1. TIPS ----------------------------- */}
      {weeklyEntries.length > 0 && (
        <>
          <h2 className="text-center text-2xl font-bold text-amber-700 mb-3">
            💡 Tips Based on Your Mood Pattern
          </h2>

          <div className="bg-gradient-to-br from-[#FFF8E7] to-[#FFF4D9] p-6 rounded-3xl mb-12 shadow border border-amber-200">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                <h4 className="font-semibold text-amber-700 mb-1">
                  😊 Mood Insight
                </h4>
                <p>{moodTip}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-yellow-100 shadow-sm">
                <h4 className="font-semibold text-yellow-700 mb-1">
                  🔋 Energy Insight
                </h4>
                <p>{energyTip}</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                <h4 className="font-semibold text-orange-700 mb-1">
                  🌼 Emotional Wellness
                </h4>
                <p>{generalTip}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ----------------------------- 2. TRENDS ----------------------------- */}
      {entries.length > 0 && (
        <>
          <h2 className="text-center text-2xl font-bold text-[#12486B] mb-3">
            📊 Mood & Energy Trends
          </h2>

          <div className="bg-white p-6 rounded-3xl shadow-md border border-sky-100 mb-12">
            {/* Mood Trend */}
            <h4 className="text-lg font-bold text-sky-700 mb-3">
              😊 Mood Trend
            </h4>

            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d0e7ff" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Energy Trend */}
            <h4 className="text-lg font-bold text-green-700 mt-8 mb-3">
              ⚡ Energy Trend
            </h4>

            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ----------------------------- 3. WEEKLY INSIGHTS ----------------------------- */}
      {weeklyEntries.length > 0 && (
        <>
          <h2 className="text-center text-2xl font-bold text-[#12486B] mb-3">
            📅 Weekly Insights
          </h2>

          <div className="bg-gradient-to-br from-[#F0F9FF] to-[#E8F5FF] p-6 rounded-3xl shadow-md border border-sky-100 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="bg-white p-4 rounded-xl shadow-sm border border-sky-100">
                <h4 className="font-semibold text-sky-800 mb-1">😊 Average Mood</h4>
                <p className="text-3xl font-bold text-sky-600">{avgMood}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                <h4 className="font-semibold text-green-800 mb-1">
                  🔋 Average Energy
                </h4>
                <p className="text-3xl font-bold text-green-600">{avgEnergy}</p>
              </div>

              {/* Best Day */}
              {bestDay && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100">
                  <h4 className="font-semibold text-purple-800 mb-1">
                    ⭐ Best Day
                  </h4>
                  <p>{new Date(bestDay.createdAt).toLocaleDateString()}</p>
                  <p>Mood: {bestDay.mood} — Energy: {bestDay.energy}</p>
                </div>
              )}

              {/* Worst Day */}
              {worstDay && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-1">
                    😞 Toughest Day
                  </h4>
                  <p>{new Date(worstDay.createdAt).toLocaleDateString()}</p>
                  <p>Mood: {worstDay.mood} — Energy: {worstDay.energy}</p>
                </div>
              )}
            </div>

            <p className="text-center mt-4 text-gray-600">
              📈 You logged <strong>{weeklyEntries.length}</strong> days this week.
            </p>
          </div>
        </>
      )}

      {/* ----------------------------- 4. MOOD HISTORY ----------------------------- */}
      <h2 className="text-center text-2xl font-bold text-[#12486B] mb-3">
        🕒 Mood History
      </h2>

      <div className="bg-white p-6 rounded-3xl shadow-md border border-sky-100">
        {entries.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No mood entries yet.
          </p>
        ) : (
          <div className="space-y-3">
            {entries
              .slice()
              .reverse()
              .map((e) => (
                <div
                  key={e.id}
                  className="p-4 bg-white border border-sky-100 rounded-2xl shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sky-600">
                      {moodIcons[e.mood]}
                      <span className="font-semibold text-gray-800">
                        Mood: {e.mood}
                      </span>
                    </div>

                    <span className="text-xs text-gray-500">
                      {new Date(e.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">
                    ⚡ Energy: {e.energy}/10
                  </p>

                  {e.note && (
                    <p className="mt-2 text-gray-700 italic">“{e.note}”</p>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
