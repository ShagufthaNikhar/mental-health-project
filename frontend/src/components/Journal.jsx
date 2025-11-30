import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BookOpen, Send, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Journal() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchEntries() {
    try {
      const res = await axios.get(`${API}/api/journals`);
      setEntries(res.data || []);
    } catch (err) {
      alert(t("journal_error_load"));
    }
  }

  async function saveEntry() {
    if (!text.trim()) return alert(t("journal_empty_error"));
    setLoading(true);

    try {
      await axios.post(`${API}/api/journals`, { content: text });
      setText("");
      fetchEntries();
    } catch (err) {
      alert(t("journal_error_save"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="flex flex-col items-center px-4 pb-20 pt-10">

      {/* Main Box */}
      <motion.div
        className="bg-white/80 backdrop-blur-lg border border-sky-100 p-8 rounded-3xl shadow-xl w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        {/* Illustration INSIDE the border */}
        <motion.img
          src="/images/banners/journal_banner.png"
          alt="Journal Illustration"
          className="w-36 mx-auto mb-6 opacity-90"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <BookOpen className="text-sky-600" size={32} />
          <h2 className="text-3xl font-bold text-[#12486B]">
            {t("journal_title")}
          </h2>
        </div>

        <p className="text-gray-600 text-center mb-6 max-w-lg mx-auto">
          {t("journal_description")}
        </p>

        {/* Text Input */}
        <motion.textarea
          placeholder={t("journal_placeholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          className="w-full border border-sky-200 rounded-2xl p-3 mb-4 text-gray-700
                     focus:ring-2 focus:ring-sky-300 focus:outline-none resize-none bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Save Button */}
        <motion.button
          onClick={saveEntry}
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold shadow-md transition-all
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
            }`}
        >
          {loading ? t("journal_saving") : t("journal_save")}
          <Send size={18} />
        </motion.button>

        {/* Entries Section */}
        <h3 className="text-2xl font-semibold mt-10 mb-4 text-[#12486B] text-center flex items-center justify-center gap-2">
          <Sparkles className="text-sky-500" />
          {t("journal_previous")}
        </h3>

        {entries.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            {t("journal_no_entries")}
          </div>
        ) : (
          <div className="mt-4 space-y-4 max-h-[310px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-sky-200">
            {entries
              .slice()
              .reverse()
              .map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-white border border-sky-100 rounded-2xl shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {new Date(e.createdAt).toLocaleString()}
                  </div>
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {e.content}
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Journal;
