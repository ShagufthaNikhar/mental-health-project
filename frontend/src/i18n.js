// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import hi from "./locales/hi/translation.json";
import kn from "./locales/kn/translation.json";
import te from "./locales/te/translation.json";
import mr from "./locales/mr/translation.json";
import ur from "./locales/ur/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      kn: { translation: kn },
      te: { translation: te },
      mr: { translation: mr },
      ur: { translation: ur },
    },

    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // React already escapes
    },

    detection: {
      // Order of language detection
      order: ["localStorage", "navigator", "htmlTag"],

      // Cache only in localStorage
      caches: ["localStorage"],
    },
  });

export default i18n;
