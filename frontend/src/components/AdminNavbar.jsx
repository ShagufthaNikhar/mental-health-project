// src/components/AdminNavbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, LogIn } from "lucide-react";

export default function AdminNavbar() {
  const location = useLocation();

  const links = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/admin/login", name: "Admin Login", icon: <LogIn size={18} /> },
  ];

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 py-3 px-6 
                    flex items-center justify-between sticky top-0 z-50">

      {/* Admin Brand */}
      <Link
        to="/admin/dashboard"
        className="text-xl font-bold text-indigo-700 flex items-center gap-2"
      >
        <img
          src="/images/admin/admin-avatar.png"
          alt="Admin Avatar"
          className="w-10 h-10 rounded-full shadow"
        />
        MindSpace Admin
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition
              ${
                location.pathname === link.path
                  ? "text-indigo-700 font-semibold bg-indigo-50"
                  : "text-gray-600 hover:text-indigo-700"
              }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
