// src/components/Crisis.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, HeartPulse, ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Crisis() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function fetchCrisis() {
      try {
        const res = await axios.get(`${API}/api/crisis`);
        setContacts(res.data || []);
      } catch (err) {
        console.error(err);
        alert(t("crisis_error_load"));
      }
    }
    fetchCrisis();
  }, [t]);

  return (
    <div className="w-full flex justify-center pt-10 pb-20 px-4">

      <motion.div
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-3xl border border-rose-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <motion.img
            src="/images/banners/crisis_banner.png"
            alt="Crisis Help"
            className="w-36 opacity-95"
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <ShieldAlert className="text-rose-600" size={32} />
          <h2 className="text-3xl font-bold text-rose-700">
            {t("crisis_title")} 🆘
          </h2>
        </div>

        <p className="text-gray-700 text-center mb-6 leading-relaxed max-w-xl mx-auto">
          {t("crisis_description")}
        </p>

        {/* Contact List */}
        {contacts.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            {t("crisis_no_contacts")}
          </p>
        ) : (
          <ul className="space-y-5">
            <AnimatePresence>
              {contacts.map((c) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center bg-white p-5 rounded-2xl border border-rose-100 shadow-md hover:shadow-xl transition-all"
                >
                  {/* Contact left */}
                  <div>
                    <p className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                      <PhoneCall className="text-rose-600" size={18} />{" "}
                      {c.number}
                    </p>
                    <p className="text-gray-600 text-sm">{c.note}</p>

                    {c.country && (
                      <p className="text-xs text-gray-500 mt-1">
                        🌍 {c.country}
                      </p>
                    )}
                  </div>

                  {/* Call Button */}
                  <motion.a
                    href={`tel:${c.number}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-rose-600 text-white px-4 py-2 rounded-xl font-medium shadow hover:bg-rose-700 transition"
                  >
                    {t("crisis_call_now")}
                  </motion.a>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        {/* Footer */}
        <div className="text-center mt-8 border-t border-rose-200 pt-4">
          <p className="text-sm text-gray-600 flex justify-center items-center gap-2">
            <HeartPulse className="text-rose-500" size={18} />
            {t("crisis_footer")}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Crisis;
