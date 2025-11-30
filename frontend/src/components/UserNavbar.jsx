// src/components/UserNavbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Smile } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UserNavbar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  // Hide navbar on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  const navItems = [
    { path: "/", name: t("nav_home", "Home") },
    { path: "/chatbot", name: t("nav_chatbot", "Chatbot") },
    { path: "/mood", name: t("nav_mood", "Mood Tracker") },
    { path: "/journals", name: t("nav_journal", "Journal") },
    { path: "/appointments", name: t("nav_appointments", "Appointments") },
    { path: "/resources", name: t("nav_resources", "Resources") },
    { path: "/assessment", name: t("nav_assessment", "Assessment") },
    { path: "/sleep", name: t("nav_sleep", "Sleep Sounds") },
    { path: "/dreams", name: t("nav_dreams", "Dream Tracker") },
    { path: "/community", name: t("nav_community", "Community") },
    { path: "/dashboard", name: t("nav_dashboard", "Dashboard") },

    // Safety
    { path: "/crisis", name: t("nav_crisis", "Crisis Helplines") },
    { path: "/emergency", name: t("nav_emergency", "Emergency Contacts") },
  ];

  const handleMenuClick = () => setOpen(false);

  return (
    <nav className="bg-gradient-to-r from-[#71C9CE] via-[#A6E3E9] to-[#CBF1F5] 
                    shadow-md py-3 px-6 sticky top-0 z-50">

      {/* --- Top Row --- */}
      <div className="flex justify-between items-center">
        {/* Branding */}
        <div className="flex items-center gap-2">
          <Smile className="text-[#2C698D]" size={28} />
          <h1 className="text-xl font-bold text-[#2C698D] tracking-wide">
            MindSpace
          </h1>
        </div>

        {/* Language Selector */}
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="hidden md:block border border-sky-200 rounded-md px-2 py-1 bg-white 
                     text-[#2C698D] shadow-sm"
        >
          <option value="en">EN</option>
          <option value="hi">हिन्दी</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="te">తెలుగు</option>
          <option value="mr">मराठी</option>
          <option value="ur">اردو</option>
        </select>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#2C698D] text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* --- Menu Links --- */}
      <div
        className={`${open ? "block" : "hidden"} 
                    md:flex md:flex-wrap gap-4 mt-3`}
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={handleMenuClick}
            className={`px-2 py-1 block transition-all ${
              location.pathname === item.path
                ? "font-semibold underline text-[#2C698D]"
                : "text-gray-700 hover:text-[#2C698D]"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
