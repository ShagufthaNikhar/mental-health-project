// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { speakText, voiceLangMap } from "../utils/voice";
import { useTranslation } from "react-i18next";

export default function Home({ user }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Voice language map
  const voiceLangMapLocal = {
    en: "en-IN",
    hi: "hi-IN",
    kn: "kn-IN",
    te: "te-IN",
    ur: "ur-PK",
    mr: "mr-IN",
  };

  // Quote state
  const [quote, setQuote] = useState("Start where you are. Use what you have. Do what you can.");
  const [author, setAuthor] = useState("Arthur Ashe");

  const quotes = [
    { q: "Start every day with a positive thought.", a: "Roy Bennett" },
    { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
    { q: "Your peace is more important than anything.", a: "Unknown" },
    { q: "Breathe. You are stronger than you think.", a: "Unknown" },
    { q: "You are not alone. You matter.", a: "MindSpace" },
  ];

  // 🎤 Multilingual Welcome Voice
  useEffect(() => {
    speakText(
      t("welcome_to_mindspace"),
      voiceLangMapLocal[i18n.language] || "en-IN"
    );
  }, [i18n.language]);

  // 🗣 Voice Navigation
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const cmd = event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim();

      const pages = {
        chatbot: "/chatbot",
        mood: "/mood",
        journal: "/journals",
        sleep: "/sleep",
        dream: "/dreams",
        resource: "/resources",
        emergency: "/emergency",
        appointment: "/appointments",
        crisis: "/crisis",
        community: "/community",
        assessment: "/assessment",
        dashboard: "/dashboard",

        // ✅ FIXED
        food: "/food-tips",
      };

      Object.keys(pages).forEach((p) => {
        if (cmd.includes(p)) navigate(pages[p]);
      });
    };

    recognition.start();
  }, []);

  // 🔄 Random Quote
  const generateQuote = () => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random.q);
    setAuthor(random.a);

    speakText(
      random.q,
      voiceLangMapLocal[i18n.language] || "en-IN"
    );
  };

  // ⭐ CARDS WITH FOOD ADDED
  const cards = [
    { name: t("sidebar_chatbot"), path: "/chatbot", img: "/images/icons/chatbot.png" },
    { name: t("sidebar_mood"), path: "/mood", img: "/images/icons/mood.png" },
    { name: t("sidebar_journal"), path: "/journals", img: "/images/icons/journal.png" },
    { name: t("sidebar_sleep"), path: "/sleep", img: "/images/icons/sleepsound.png" },
    { name: t("sidebar_dream"), path: "/dreams", img: "/images/icons/dreams.png" },
    { name: t("sidebar_resources"), path: "/resources", img: "/images/icons/resources.png" },
    { name: t("sidebar_emergency"), path: "/emergency", img: "/images/icons/emergency.png" },
    { name: t("sidebar_appointments"), path: "/appointments", img: "/images/icons/appointments.png" },
    { name: t("sidebar_crisis"), path: "/crisis", img: "/images/icons/crisis.png" },
    { name: t("sidebar_community"), path: "/community", img: "/images/icons/community.png" },
    { name: t("sidebar_assessment"), path: "/assessment", img: "/images/icons/assessment.png" },
    { name: t("sidebar_dashboard"), path: "/dashboard", img: "/images/icons/dashboard.png" },

    // ⭐ FIXED FOOD CARD PATH
    { name: t("Food Tips"), path: "/food-tips", img: "/images/icons/food.png" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-emerald-50 py-10 px-6 flex flex-col items-center">

      {/* Banner */}
      <img
        src="/images/banners/home_banner.png"
        className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
        alt="MindSpace Banner"
      />

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-[#2C698D] mb-3 text-center">
        MindSpace
      </h1>
      <p className="text-gray-600 text-lg mb-6 text-center max-w-xl">
        {t("welcome_to_mindspace")}
      </p>

      {/* Quotes */}
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-md border border-sky-100 mb-10">
        <h2 className="text-2xl font-bold text-[#2C698D] text-center mb-4">
          ✨ {t("daily_motivation")}
        </h2>

        <p className="text-center text-gray-700 italic text-lg">“{quote}”</p>
        <p className="text-right pr-4 text-gray-600 mt-1">— {author}</p>

        <div className="flex justify-center mt-6">
          <button
            onClick={generateQuote}
            className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-xl shadow hover:bg-sky-600 transition flex items-center gap-2"
          >
            🔁 {t("new_quote")} ☁️
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-6xl">
        {cards.map((c) => (
          <Link
            key={c.path}
            to={c.path}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-xl hover:scale-105 transition-all border border-sky-100 text-center"
          >
            <img className="w-16 h-16 mx-auto mb-3" src={c.img} alt={c.name} />
            <div className="font-semibold text-[#2C698D]">{c.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
