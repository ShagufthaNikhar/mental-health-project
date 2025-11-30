// src/pages/CommunityPage.jsx
import React, { useEffect } from "react";
import Community from "../components/Community";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
//import { speakText } from "../utils/voice";
import { speakText, voiceLangMap } from "../utils/voice";

import { useTranslation } from "react-i18next";

export default function CommunityPage({ user }) {

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

  // 🔊 Multilingual Voice greeting
  useEffect(() => {
    speakText(
      t("community_title"),
      voiceLangMap[i18n.language] || "en-IN"
    );
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">

      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main */}
      <main className="flex-1 p-6 relative">

        {/* Top Bar */}
        <TopBar user={user} />

        {/* Banner Section */}
        <div className="flex flex-col items-center mb-8 px-4">
          <img
            src="/images/banners/community_banner.png"
            alt="Community Banner"
            className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
          />

          <h1 className="text-3xl font-bold text-green-700">
            🌍 {t("community_title")}
          </h1>

          <p className="text-gray-700 text-center max-w-xl">
            {t("community_subtitle")}
          </p>
        </div>

        {/* Community Component */}
        <div className="max-w-4xl mx-auto px-4">
          <Community userId={user?.uid} />
        </div>

      </main>
    </div>
  );
}
