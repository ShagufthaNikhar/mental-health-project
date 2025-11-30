// src/pages/AppointmentsPage.jsx
import React, { useEffect } from "react";
import Appointments from "../components/Appointments";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
//import { speakText } from "../utils/voice";
import { speakText, voiceLangMap } from "../utils/voice";

import { useTranslation } from "react-i18next";   // ADDED

export default function AppointmentsPage({ user }) {

  const { t, i18n } = useTranslation();   // ADDED

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
      t("appointments page"),           // You can add t("appointments_title") later if needed
      voiceLangMap[i18n.language] || "en-IN"
    );
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-emerald-50">

      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Area */}
      <main className="flex-1 p-6 relative">

        {/* Top Bar */}
        <TopBar user={user} />

        {/* Banner Section */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/images/banners/appointments_banner.png"
            alt="Appointments Banner"
            className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
          />

          <h1 className="text-3xl font-bold text-sky-700 text-center">
            📅 Book Your Appointment
          </h1>
        </div>

        {/* Booking Component */}
        <div className="max-w-4xl mx-auto">
          <Appointments userId={user?.uid} />
        </div>

      </main>
    </div>
  );
}
