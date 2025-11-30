// src/pages/DreamsPage.jsx
import React, { useEffect } from "react";
import DreamsTracker from "../components/DreamsTracker";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import { speakText, voiceLangMap } from "../utils/voice";
import { useTranslation } from "react-i18next";

export default function DreamsPage({ user }) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    speakText(
      t("dreamtracker_title"),
      voiceLangMap[i18n.language] || "en-IN"
    );
  }, [i18n.language]);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 
                    bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50">

      <div className="flex flex-col items-center mb-8 px-4">
        <img
          src="/images/banners/dreams_banner.png"
          alt="Dreams Banner"
          className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
        />

        <h1 className="text-3xl font-bold text-violet-700">
          🌙 {t("dreamtracker_title")}
        </h1>

        <p className="text-gray-600 text-center max-w-xl">
          {t("dreamtracker_subtitle")}
        </p>
      </div>

      <div className="w-full max-w-4xl px-4">
        <DreamsTracker userId={user?.uid} />
      </div>

    </div>
  );
}
