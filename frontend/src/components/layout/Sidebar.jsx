// src/components/layout/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";   // ➤ ADDED

export default function Sidebar({ user }) {
  const location = useLocation();
  const { t } = useTranslation();                // ➤ ADDED

  if (location.pathname === "/login" || location.pathname === "/admin-login") {
    return null;
  }

  const menus = [
    { path: "/", label: "sidebar_home" },
    { path: "/chatbot", label: "sidebar_chatbot" },
    { path: "/assessment", label: "sidebar_assessment" },
    { path: "/appointments", label: "sidebar_appointments" },
    { path: "/crisis", label: "sidebar_crisis" },
    { path: "/community", label: "sidebar_community" },
    { path: "/resources", label: "sidebar_resources" },
    { path: "/emergency", label: "sidebar_emergency" },
    { path: "/mood", label: "sidebar_mood" },
    { path: "/journals", label: "sidebar_journal" },
    { path: "/food-tips", label: "Food tips" },
    { path: "/sleep", label: "sidebar_sleep" },
    { path: "/dreams", label: "sidebar_dream" },
    { path: "/dashboard", label: "sidebar_dashboard" }
    
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-50 p-4 overflow-y-auto">

      <h1 className="text-2xl font-bold mb-6 text-blue-600 px-2">MindSpace</h1>

      <nav className="flex flex-col gap-2">
        {menus.map((m) => (
          <Link
            key={m.path}
            to={m.path}
            className={`p-3 rounded-lg hover:bg-blue-100 ${
              location.pathname === m.path ? "bg-blue-200 font-semibold" : ""
            }`}
          >
            {t(m.label)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
