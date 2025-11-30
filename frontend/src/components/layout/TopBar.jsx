// src/components/layout/TopBar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function TopBar({ user, sidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();     // ➤ ADDED t

  const [dateTime, setDateTime] = useState(new Date());

  // Auto-update date + time every second
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Hide on login pages
  if (location.pathname === "/login" || location.pathname === "/admin-login") {
    return null;
  }

  return (
    <header
      className={`
        h-16 bg-white shadow flex items-center justify-end px-6 fixed top-0 right-0 z-40 gap-6
        transition-all duration-300
        ${sidebarOpen ? "left-64" : "left-0"}
      `}
    >
      {/* DATE + TIME */}
      <div className="text-gray-700 font-medium text-sm text-right">
        <div>{dateTime.toLocaleDateString()}</div>
        <div>{dateTime.toLocaleTimeString()}</div>
      </div>

      {/* Language Selector */}
      <select
        className="border p-2 rounded-lg"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        <option value="en">EN</option>
        <option value="hi">हिन्दी</option>
        <option value="kn">ಕನ್ನಡ</option>
        <option value="te">తెలుగు</option>
        <option value="mr">मराठी</option>
        <option value="ur">اردو</option>
      </select>

      {/* Logout */}
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-xl"
        onClick={() => {
          localStorage.removeItem("isAdmin");
          navigate("/login");
        }}
      >
        {t("sidebar_logout")}   {/* ✔ MULTILINGUAL */}
      </button>
    </header>
  );
}
