// src/pages/ChatbotPage.jsx
import React, { useEffect } from "react";
import Chatbot from "../components/Chatbot";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
//import { speakText } from "../utils/voice";
import { speakText, voiceLangMap } from "../utils/voice";

import { useTranslation } from "react-i18next";

export default function ChatbotPage({ user }) {

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
      t("chatbot_title"),
      voiceLangMap[i18n.language] || "en-IN"
    );
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">

      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-6 relative">

        {/* Top Bar */}
        <TopBar user={user} />

        {/* Banner Section */}
        <div className="flex flex-col items-center mb-8 px-4">
          <img
            src="/images/banners/chatbot_banner.png"
            alt="Chatbot Banner"
            className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
          />

          <h1 className="text-3xl font-bold text-[#1f3c88] text-center">
            🤖 {t("chatbot_title")}
          </h1>

          <p className="text-gray-600 text-center max-w-xl">
            {t("chatbot_subtitle")}
          </p>
        </div>

        {/* Chatbot Component */}
        <div className="max-w-3xl mx-auto px-4">
          <Chatbot />
        </div>

      </main>
    </div>
  );
}
