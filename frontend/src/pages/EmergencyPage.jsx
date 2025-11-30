// src/pages/EmergencyPage.jsx
import React, { useEffect } from "react";
import EmergencyContacts from "../components/EmergencyContacts";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";

import { speakText, voiceLangMap } from "../utils/voice"; 
import { useTranslation } from "react-i18next";

export default function EmergencyPage({ user }) {
  const { t, i18n } = useTranslation();

  // 🔊 Voice greeting when page loads
  useEffect(() => {
    speakText(
      t("emergency_title"),
      voiceLangMap[i18n.language] || "en-IN"
    );
  }, [i18n.language]);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 
                    bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">

      {/* TopBar */}
      <TopBar user={user} />

      {/* Sidebar */}
      <div className="flex w-full">
        <Sidebar user={user} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center">

          {/* Banner + Title Section */}
          <div className="flex flex-col items-center mb-8 px-4 w-full">

            <img
              src="/images/banners/emergency_banner.png"
              alt="Emergency Banner"
              className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
            />

            <h1 className="text-3xl font-bold text-red-700">
              🚨 {t("emergency_title")}
            </h1>

            <p className="text-gray-600 text-center max-w-xl">
              {t("emergency_subtitle")}
            </p>
          </div>

          {/* Emergency Contacts Component */}
          <div className="w-full max-w-3xl px-4">
            <EmergencyContacts userId={user?.uid} />
          </div>

        </div>
      </div>
    </div>
  );
}
