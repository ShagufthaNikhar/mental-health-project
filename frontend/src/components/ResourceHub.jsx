import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  Headphones,
  Moon,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function ResourceHub() {
  const { t } = useTranslation();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌿 Load all wellness resources
  useEffect(() => {
    async function loadResources() {
      try {
        const res = await axios.get(`${API}/api/resources`);
        setResources(res.data || []);
      } catch (err) {
        console.error("Failed to load resources:", err);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, []);

  // 🌟 Icon selector
  const getIcon = (type) => {
    switch (type) {
      case "article":
        return <BookOpen className="text-sky-600" size={22} />;
      case "audio":
      case "asmr":
        return <Headphones className="text-indigo-500" size={22} />;
      case "sleep":
        return <Moon className="text-purple-500" size={22} />;
      default:
        return <RefreshCw className="text-gray-400" size={22} />;
    }
  };

  return (
    <div className="flex flex-col items-center pt-10 pb-20 px-4">

      {/* Banner / Illustration */}
      <img
        src="/images/banners/resources_banner.png"
        alt="Wellness Resources Banner"
        className="w-40 mb-6 opacity-90"
      />

      <div
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl 
                   w-full max-w-4xl border border-sky-100"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-[#2C698D] text-center mb-4">
          📚 {t("resources")}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center max-w-xl mx-auto mb-8">
          {t("resources_description")}
        </p>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center gap-2 text-sky-600">
            <RefreshCw className="animate-spin" /> {t("resources_loading")}
          </div>
        ) : resources.length === 0 ? (
          <p className="text-gray-500 text-center">{t("resources_empty")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {resources.map((r) => (
              <div
                key={r.id}
                className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow 
                           hover:shadow-lg transition-all border border-sky-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  {getIcon(r.type)}
                  <h3 className="font-semibold text-sky-800 text-lg">{r.title}</h3>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {r.type || "resource"} • {r.lang || "EN"}
                  </span>

                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 bg-sky-600 text-white 
                               px-3 py-1.5 rounded-lg text-sm
                               hover:bg-sky-700 transition"
                  >
                    {t("resources_open")} <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourceHub;
