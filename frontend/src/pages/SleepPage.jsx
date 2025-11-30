// src/pages/SleepPage.jsx
import React, { useEffect } from "react";
import SleepSounds from "../components/SleepSounds";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import { speakText, voiceLangMap } from "../utils/voice";
import { useTranslation } from "react-i18next";

export default function SleepPage({ user }) {
  const { t, i18n } = useTranslation();

  // Language map for voices
  const voiceLangMap = {
    en: "en-IN",
    hi: "hi-IN",
    kn: "kn-IN",
    te: "te-IN",
    ur: "ur-PK",
    mr: "mr-IN",
  };

  // 🔊 Multilingual Voice Greeting
  useEffect(() => {
    speakText(
      t("sleepsounds_title"),
      voiceLangMap[i18n.language] || "en-IN"
    );
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">

      {/* Left Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-6 relative">

        {/* Top Bar */}
        <TopBar user={user} />

        {/* Banner Section */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/images/banners/sleep_banner.png"
            alt="Sleep Sounds Banner"
            className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
          />

          <h1 className="text-3xl font-bold text-indigo-700">
            🌙 {t("sleepsounds_title")}
          </h1>

          <p className="text-gray-600 text-center max-w-xl">
            {t("sleepsounds_subtitle")}
          </p>
        </div>

        {/* Sleep Sounds Component */}
        <div className="max-w-3xl mx-auto mb-8">
          <SleepSounds userId={user?.uid} />
        </div>

        {/* 🌸 Better Sleep Tips Section */}
        <div
          className="max-w-3xl mx-auto p-6 rounded-3xl shadow-md border border-pink-200"
          style={{ backgroundColor: "#ffe6f2" }} // light pink
        >
          <h2 className="text-2xl font-bold text-pink-700 mb-4">
            🌸 Better Sleep Tips
          </h2>

          <ul className="text-gray-700 space-y-3 text-lg">
            <li>🕒 Maintain a consistent sleep schedule</li>
            <li>🛏️ Keep your bedroom cool, dark, and quiet</li>
            <li>📵 Avoid screens 1 hour before bedtime</li>
            <li>😌 Practice relaxation techniques before sleep</li>
            <li>☕ Avoid caffeine and heavy meals late in the day</li>
          </ul>
        </div>

      </main>
    </div>
  );
}
