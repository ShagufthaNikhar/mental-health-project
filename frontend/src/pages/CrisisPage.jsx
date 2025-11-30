// src/pages/CrisisPage.jsx
import React, { useEffect } from "react";
import Crisis from "../components/Crisis";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
//import { speakText } from "../utils/voice";
import { speakText, voiceLangMap } from "../utils/voice";

import { useTranslation } from "react-i18next";

export default function CrisisPage({ user }) {

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
      t("crisis_title"),
      voiceLangMap[i18n.language] || "en-IN"
    );
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-pink-50">

      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-6 relative">

        {/* TopBar */}
        <TopBar user={user} />

        {/* Banner Section */}
        <div className="flex flex-col items-center mb-8 px-4">
          <img
            src="/images/banners/crisis_banner.png"
            alt="Crisis Helpline Banner"
            className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
          />

          <h1 className="text-3xl font-bold text-red-700">
            🆘 {t("crisis_title")}
          </h1>

          <p className="text-gray-700 text-center max-w-xl">
            {t("crisis_subtitle")}
          </p>
        </div>

        {/* Crisis Component */}
        <div className="max-w-4xl mx-auto px-4">
          <Crisis userId={user?.uid} />
        </div>

      </main>
    </div>
  );
}
