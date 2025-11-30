// src/components/LoginNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Smile } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginNavbar() {
  return (
    <motion.nav
      className="bg-white/70 backdrop-blur-lg border-b border-sky-100 shadow-sm
                 py-4 px-6 flex justify-between items-center sticky top-0 z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo + Brand */}
      <Link to="/" className="flex items-center gap-2">
        <Smile className="text-[#2C698D]" size={30} />
        <span className="text-xl font-extrabold text-[#2C698D] tracking-wide">
          MindSpace
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/admin/login"
            className="text-sm px-4 py-2 rounded-xl border border-sky-200
                       bg-white hover:bg-sky-50 text-sky-800 font-medium
                       shadow-sm hover:shadow transition-all"
          >
            Admin Login
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}
