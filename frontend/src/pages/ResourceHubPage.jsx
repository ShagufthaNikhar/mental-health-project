// src/pages/ResourceHubPage.jsx
import React, { useEffect } from "react";
import ResourceHub from "../components/ResourceHub";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
//import { speakText } from "../utils/voice";
import { speakText, voiceLangMap } from "../utils/voice";

import { useTranslation } from "react-i18next";

export default function ResourceHubPage({ user }) {

  const { t, i18n } = useTranslation();   // UPDATED

  // Language map for voice
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
      t("resourcehub_title"),
      voiceLangMap[i18n.language] || "en-IN"
    );
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">

      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-6 relative">

        {/* Top Bar */}
        <TopBar user={user} />

        {/* Banner */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/images/banners/resources_banner.png"
            alt="Resource Hub Banner"
            className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
          />

          <h1 className="text-3xl font-bold text-sky-700">
            📚 {t("resourcehub_title")}
          </h1>

          <p className="text-gray-600 text-center max-w-xl">
            {t("resourcehub_subtitle")}
          </p>
        </div>

        {/* ResourceHub Component */}
        <div className="max-w-4xl mx-auto">
          <ResourceHub userId={user?.uid} />
        </div>

      </main>
    </div>
  );
}
