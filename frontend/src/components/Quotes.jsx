// src/components/Quotes.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Quotes() {
  const { t, i18n } = useTranslation();
  const [quote, setQuote] = useState("");

  // Load translated quotes array
  const quotes = t("quotes_list", { returnObjects: true }) || [];

  function getRandomQuote() {
    if (!quotes.length) return;
    const index = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[index]);
  }

  // Load quote on mount and when language changes
  useEffect(() => {
    if (quotes.length > 0) getRandomQuote();
  }, [i18n.language]);

  return (
    <motion.div
      className="bg-gradient-to-br from-[#E0F7FA] via-[#E8EAF6] to-[#FFF8E1]
                 p-8 rounded-3xl shadow-lg w-full max-w-3xl mx-auto text-center
                 border border-sky-100"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Title */}
      <motion.div
        className="flex items-center justify-center gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Sparkles className="text-yellow-500" size={24} />
        <h2 className="text-3xl font-bold text-sky-700">
          {t("quote_title")}
        </h2>
      </motion.div>

      {/* Quote Display */}
      {quote ? (
        <motion.p
          key={quote}
          className="text-lg text-gray-700 italic mb-6 px-4 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          “{quote}”
        </motion.p>
      ) : (
        <p className="text-gray-400 italic">
          {t("loading_quotes")}
        </p>
      )}

      {/* New Quote Button */}
      {quotes.length > 1 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={getRandomQuote}
          className="flex items-center justify-center gap-2 mx-auto
                     bg-gradient-to-r from-sky-500 to-indigo-500 text-white
                     px-6 py-2 rounded-full font-medium shadow-md
                     hover:from-sky-600 hover:to-indigo-600 transition-all"
        >
          <RefreshCw size={18} className="animate-spin-slow" />
          {t("new_quote")}
        </motion.button>
      )}
    </motion.div>
  );
}
