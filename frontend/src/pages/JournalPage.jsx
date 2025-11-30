// src/pages/JournalPage.jsx
import React, { useEffect } from "react";
import Journal from "../components/Journal";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
//import { speakText } from "../utils/voice";
import { speakText, voiceLangMap } from "../utils/voice";

import { useTranslation } from "react-i18next";

export default function JournalPage({ user }) {

  const { t, i18n } = useTranslation();   // UPDATED

  // Voice language map
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
      t("journal_title"),
      voiceLangMap[i18n.language] || "en-IN"
    );
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">

      {/* Left Sidebar */}
      <Sidebar user={user} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 relative">

        {/* Top Bar */}
        <TopBar user={user} />

        {/* Banner + Title */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/images/banners/journal_banner.png"
            alt="Journal Banner"
            className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
          />

          <h1 className="text-3xl font-bold text-indigo-700">
            📔 {t("journal_title")}
          </h1>

          <p className="text-gray-600 text-center max-w-xl mt-1">
            {t("journal_subtitle")}
          </p>
        </div>

        {/* Centered Journal Component */}
        <div className="max-w-3xl mx-auto">
          <Journal userId={user?.uid} />
        </div>

      </main>
    </div>
  );
}
