// src/components/Assessment.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Activity, Smile, Target } from "lucide-react"; // Only for test icons (allowed)
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const tests = (t) => ({
  GAD7: {
    title: "🧠 " + t("gad7_title"),
    icon: <Brain className="text-sky-600" size={26} />,
    questions: [
      t("gad7_q1"),
      t("gad7_q2"),
      t("gad7_q3"),
      t("gad7_q4"),
      t("gad7_q5"),
      t("gad7_q6"),
      t("gad7_q7"),
    ],
    scale: [
      t("not_at_all"),
      t("several_days"),
      t("more_than_half"),
      t("nearly_every_day"),
    ],
  },

  PHQ9: {
    title: "🧠 " + t("phq9_title"),
    icon: <Activity className="text-rose-500" size={26} />,
    questions: [
      t("phq9_q1"),
      t("phq9_q2"),
      t("phq9_q3"),
      t("phq9_q4"),
      t("phq9_q5"),
      t("phq9_q6"),
      t("phq9_q7"),
      t("phq9_q8"),
      t("phq9_q9"),
    ],
    scale: [
      t("not_at_all"),
      t("several_days"),
      t("more_than_half"),
      t("nearly_every_day"),
    ],
  },

  PSS10: {
    title: "🧠 " + t("pss10_title"),
    icon: <Target className="text-amber-500" size={26} />,
    questions: [
      t("pss10_q1"),
      t("pss10_q2"),
      t("pss10_q3"),
      t("pss10_q4"),
      t("pss10_q5"),
      t("pss10_q6"),
      t("pss10_q7"),
      t("pss10_q8"),
      t("pss10_q9"),
      t("pss10_q10"),
    ],
    scale: [
      t("never"),
      t("almost_never"),
      t("sometimes"),
      t("fairly_often"),
      t("very_often"),
    ],
  },

  WHO5: {
    title: "🧠 " + t("who5_title"),
    icon: <Smile className="text-emerald-500" size={26} />,
    questions: [
      t("who5_q1"),
      t("who5_q2"),
      t("who5_q3"),
      t("who5_q4"),
      t("who5_q5"),
    ],
    scale: [
      t("at_no_time"),
      t("some_of_time"),
      t("less_than_half"),
      t("more_than_half"),
      t("most_of_time"),
      t("all_of_time"),
    ],
  },
});

export default function Assessment({ userId, onResult }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("GAD7");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const current = tests(t)[selected];

  function handleAnswer(qIndex, val) {
    setAnswers({ ...answers, [qIndex]: Number(val) });
  }

  function getSeverityGroupFromLevel(levelText) {
    const L = (levelText || "").toLowerCase();

    if (
      L.includes("severe") ||
      L.includes("high") ||
      L.includes("possible")
    )
      return "severe";

    if (L.includes("moderate") || L.includes("mild"))
      return "moderate";

    return "low";
  }

  async function calculateScore() {
    const total = Object.values(answers).reduce((a, b) => a + b, 0);

    let level = t("normal");

    // 🔥 Your scoring logic stays EXACTLY the same
    if (selected === "GAD7") {
      if (total >= 15) level = t("severe_anxiety");
      else if (total >= 10) level = t("moderate_anxiety");
      else if (total >= 5) level = t("mild_anxiety");
    } else if (selected === "PHQ9") {
      if (total >= 20) level = t("severe_depression");
      else if (total >= 15) level = t("moderately_severe");
      else if (total >= 10) level = t("moderate_depression");
      else if (total >= 5) level = t("mild_depression");
    } else if (selected === "PSS10") {
      if (total >= 27) level = t("high_stress");
      else if (total >= 14) level = t("moderate_stress");
      else level = t("low_stress");
    } else if (selected === "WHO5") {
      if (total < 13) level = t("possible_depression");
      else level = t("good_wellbeing");
    }

    const severity = getSeverityGroupFromLevel(level);

    setResult({ total, level });

    // ⭐ Send result upward to AssessmentPage
    onResult({
      total,
      level,
      severity,
      type: selected,
      testTitle: current.title,
    });

    // Save to backend
    try {
      await axios.post(`${API}/api/assessments`, {
        type: selected,
        score: total,
        level,
        userId,
      });
    } catch (err) {
      console.warn("Could not save assessment:", err);
    }
  }

  const progress = Math.round(
    (Object.keys(answers).length / current.questions.length) * 100
  );

  return (
    <div className="flex flex-col items-center pt-6 pb-12 px-4">
      <motion.div
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-2xl border border-sky-100"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Banner */}
        <img
          src="/images/banners/assessment_banner.png"
          alt="Assessment Banner"
          className="w-24 h-24 mx-auto mb-3 opacity-95"
        />

        {/* Title */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          {current.icon}
          <h2 className="text-3xl font-bold text-sky-700">
            {current.title}
          </h2>
        </div>

        {/* Test Selector */}
        <div className="text-center mb-5">
          <select
            className="border border-sky-300 rounded-xl p-2 px-4 text-sky-800"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              setAnswers({});
              setResult(null);
              onResult(null); // Clear results outside
            }}
          >
            <option value="GAD7">{t("anxiety_test")}</option>
            <option value="PHQ9">{t("depression_test")}</option>
            <option value="PSS10">{t("stress_test")}</option>
            <option value="WHO5">{t("wellbeing_test")}</option>
          </select>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-sky-100 rounded-full h-3 mb-6">
          <div
            className="bg-sky-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {current.questions.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white p-4 rounded-xl border border-sky-100 shadow-sm"
            >
              <p className="font-medium text-gray-700 mb-2 text-base">
                {i + 1}. {q}
              </p>

              <select
                className="border rounded-lg p-2 w-full text-base"
                onChange={(e) => handleAnswer(i, e.target.value)}
                defaultValue={answers[i] ?? ""}
              >
                <option value="" disabled>
                  {t("select_option")}
                </option>
                {current.scale.map((opt, idx) => (
                  <option key={idx} value={idx}>
                    {opt}
                  </option>
                ))}
              </select>
            </motion.div>
          ))}
        </div>

        {/* Submit */}
        <motion.button
          onClick={calculateScore}
          className="mt-6 w-full bg-sky-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-sky-700"
          whileTap={{ scale: 0.97 }}
        >
          {t("calculate_score")}
        </motion.button>
      </motion.div>
    </div>
  );
}
