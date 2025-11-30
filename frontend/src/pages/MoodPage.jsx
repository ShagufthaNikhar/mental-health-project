// src/pages/MoodPage.jsx
import React, { useEffect } from "react";
import MoodTracker from "../components/MoodTracker";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";

import { speakText, voiceLangMap } from "../utils/voice"; // ✅ correct import
import { useTranslation } from "react-i18next";

export default function MoodPage({ user }) {
  const { t, i18n } = useTranslation();

  // 🔊 Multilingual Voice Greeting
  useEffect(() => {
    speakText(
      t("mood_tracker_title"),
      voiceLangMap[i18n.language] || "en-IN"
    );
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 via-teal-50 to-indigo-50">

      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-6 relative">

        {/* Top Bar */}
        <TopBar user={user} />

        {/* Banner Section */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/images/banners/mood_banner.png"
            alt="Mood Tracker Banner"
            className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
          />

          <h1 className="text-3xl font-bold text-[#12486B]">
            🌤️ {t("mood_tracker_title")}
          </h1>

          <p className="text-gray-600 text-center max-w-xl mt-1">
            {t("mood_tracker_subtitle")}
          </p>
        </div>

        {/* Mood Tracker Component */}
        <div className="max-w-3xl mx-auto">
          <MoodTracker userId={user?.uid} />
        </div>

      </main>
    </div>
  );
}
