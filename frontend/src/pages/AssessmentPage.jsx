// src/pages/AssessmentPage.jsx
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import Assessment from "../components/Assessment";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import { speakText } from "../utils/voice";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AssessmentPage({ user }) {
  const { t, i18n } = useTranslation();
  const [assessmentData, setAssessmentData] = useState(null);
  const [history, setHistory] = useState([]);
  const [filterType, setFilterType] = useState("");

  const voiceLangMap = {
    en: "en-IN",
    hi: "hi-IN",
    kn: "kn-IN",
    te: "te-IN",
    ur: "ur-PK",
    mr: "mr-IN",
  };

  useEffect(() => {
    speakText(t("assessment_title"), voiceLangMap[i18n.language] || "en-IN");
  }, [i18n.language]);

  useEffect(() => {
    if (user?.uid) loadHistory();
  }, [user, filterType]);

  async function loadHistory() {
    const query = filterType ? `?type=${filterType}` : "";
    const res = await fetch(`${API}/api/assessments/history/${user.uid}${query}`);
    const data = await res.json();
    setHistory(data.reverse());
  }

  async function deleteEntry(id) {
    await fetch(`${API}/api/assessments/${id}`, { method: "DELETE" });
    loadHistory();
  }

  function getInterpretationSentence(type, severity) {
    const condition = {
      GAD7: "anxiety symptoms",
      PHQ9: "depression symptoms",
      PSS10: "stress levels",
      WHO5: "reduced wellbeing",
    }[type];

    if (severity === "severe")
      return `💬 Your responses suggest you may be dealing with severe ${condition}. You are not alone — support is available.`;

    if (severity === "moderate")
      return `💬 Based on your answers, you may be experiencing moderate ${condition}. Here are some steps that may help you feel better.`;

    return `💬 Your responses indicate low concerns related to ${condition}. Keep taking care of your wellbeing.`;
  }

  function generatePDF() {
    if (!assessmentData) return;

    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text("Assessment Results", 10, 15);

    pdf.setFontSize(12);
    pdf.text(`Test: ${assessmentData.testTitle}`, 10, 30);
    pdf.text(`Score: ${assessmentData.total}`, 10, 40);
    pdf.text(`Severity: ${assessmentData.level}`, 10, 50);
    pdf.text(`Date: ${new Date().toLocaleString()}`, 10, 60);

    pdf.text("Interpretation:", 10, 80);
    const interpretation = getInterpretationSentence(
      assessmentData.type,
      assessmentData.severity
    );
    const wrappedText = pdf.splitTextToSize(interpretation, 180);
    pdf.text(wrappedText, 10, 90);

    pdf.text("Recommendations:", 10, 120);
    if (assessmentData.severity === "severe") {
      pdf.text("❗ Emergency support recommended", 10, 130);
      pdf.text("📞 Crisis helpline available", 10, 138);
      pdf.text("🗓️ Book a professional appointment", 10, 146);
    } else if (assessmentData.severity === "moderate") {
      pdf.text("📘 Explore resources", 10, 130);
      pdf.text("🤖 Talk to AI support", 10, 138);
      pdf.text("🗓️ Consider an appointment", 10, 146);
    } else {
      pdf.text("🌱 Maintain healthy routines", 10, 130);
      pdf.text("📘 Explore self-care resources", 10, 138);
    }

    pdf.save("assessment_result.pdf");
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-sky-50">
      <Sidebar user={user} />
      <main className="flex-1 p-6 relative">
        <TopBar user={user} />

        {/* Banner */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="/images/banners/assessment_banner.png"
            alt="Assessment Banner"
            className="w-full max-w-3xl rounded-3xl shadow-lg mb-6 object-cover"
          />
          <h1 className="text-3xl font-bold text-indigo-700 text-center">
            🧠 {t("assessment_title")}
          </h1>
          <p className="text-gray-600 text-center max-w-xl">
            {t("assessment_subtitle")}
          </p>
        </div>

        {/* Remember */}
        <div className="w-full max-w-4xl mx-auto mb-4 bg-rose-50 border border-rose-200 p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-rose-700 mb-1">🔔 Remember</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            This screening is not a diagnosis. For a full evaluation, please
            consult a mental health professional.
          </p>
        </div>

        {/* What to Expect */}
        <div className="w-full max-w-4xl mx-auto mb-8 bg-indigo-50 border border-indigo-200 p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-indigo-700 mb-3">📌 What to Expect</h2>
          <ul className="text-lg text-gray-800 list-disc pl-6 space-y-2">
            <li>Answer honestly based on your recent feelings.</li>
            <li>Receive immediate results & severity interpretation.</li>
            <li>Get personalized next-step recommendations.</li>
          </ul>
        </div>

        {/* Assessment Form */}
        <div className="max-w-4xl mx-auto">
          <Assessment
            userId={user?.uid}
            onResult={(data) => {
              setAssessmentData(data);
              loadHistory();
            }}
          />
        </div>

        {/* ⭐⭐⭐ SCORE + RECOMMENDATIONS ⭐⭐⭐ */}
        {assessmentData && (
          <div className="w-full max-w-4xl mx-auto mt-10">

            {/* Score */}
            <div
              className={`p-6 rounded-3xl shadow-md border text-center
                ${
                  assessmentData.severity === "severe"
                    ? "bg-red-50 border-red-300"
                    : assessmentData.severity === "moderate"
                    ? "bg-amber-50 border-amber-300"
                    : "bg-green-50 border-green-300"
                }
              `}
            >
              <p className="text-3xl font-extrabold text-gray-900 mb-2">
                Score: {assessmentData.total}
              </p>

              <p className="text-2xl font-semibold text-gray-800 mb-4">
                {assessmentData.level}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
                {getInterpretationSentence(
                  assessmentData.type,
                  assessmentData.severity
                )}
              </p>
            </div>

            {/* Recommendations */}
            <div
              className={`mt-6 p-6 rounded-2xl shadow-md border
                ${
                  assessmentData.severity === "severe"
                    ? "bg-red-50 border-red-300"
                    : assessmentData.severity === "moderate"
                    ? "bg-amber-50 border-amber-300"
                    : "bg-green-50 border-green-300"
                }
              `}
            >
              <h3
                className={`text-2xl font-bold mb-4
                  ${
                    assessmentData.severity === "severe"
                      ? "text-red-700"
                      : assessmentData.severity === "moderate"
                      ? "text-amber-700"
                      : "text-green-700"
                  }
                `}
              >
                ⭐ Recommended Next Steps
              </h3>

              <div className="text-lg text-gray-800 space-y-2">
                {assessmentData.severity === "severe" && (
                  <>
                    <p>❗ Seek immediate emotional support if needed.</p>
                    <p>📞 Contact crisis helpline for urgent support.</p>
                    <p>🗓️ Book a mental health appointment soon.</p>
                  </>
                )}

                {assessmentData.severity === "moderate" && (
                  <>
                    <p>📘 Explore helpful mental health resources.</p>
                    <p>🤖 Talk to the AI assistant for guidance.</p>
                    <p>🗓️ Consider a professional check-in.</p>
                  </>
                )}

                {assessmentData.severity === "low" && (
                  <>
                    <p>🌱 Maintain healthy routines and self-care.</p>
                    <p>📘 Explore wellbeing resources.</p>
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-col md:flex-row gap-3">
                {assessmentData.severity === "severe" && (
                  <>
                    <a href="/emergency" className="px-6 py-3 rounded-xl text-white bg-red-600 text-center">
                      ❗ Emergency Contacts
                    </a>

                    <a href="/crisis" className="px-6 py-3 rounded-xl text-white bg-red-500 text-center">
                      📞 Crisis Helpline
                    </a>

                    <a href="/appointments" className="px-6 py-3 rounded-xl text-white bg-blue-600 text-center">
                      🗓️ Book Appointment
                    </a>
                  </>
                )}

                {assessmentData.severity === "moderate" && (
                  <>
                    <a href="/resources" className="px-6 py-3 rounded-xl text-white bg-blue-500 text-center">
                      📘 Resources
                    </a>

                    <a href="/chatbot" className="px-6 py-3 rounded-xl text-white bg-purple-500 text-center">
                      🤖 Talk to AI
                    </a>

                    <a href="/appointments" className="px-6 py-3 rounded-xl text-white bg-blue-600 text-center">
                      🗓️ Book Appointment
                    </a>
                  </>
                )}

                {assessmentData.severity === "low" && (
                  <>
                    <a href="/selfcare" className="px-6 py-3 rounded-xl text-white bg-green-600 text-center">
                      🌱 Self-Care Activities
                    </a>

                    <a href="/resources" className="px-6 py-3 rounded-xl text-white bg-blue-500 text-center">
                      📘 Resources
                    </a>
                  </>
                )}

                <button
                  onClick={generatePDF}
                  className="px-6 py-3 rounded-xl text-white bg-indigo-600 text-center"
                >
                  📥 Download PDF
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ⭐⭐⭐ CHARTS COME BEFORE FILTER NOW ⭐⭐⭐ */}
        {history.length > 0 && (
          <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-3xl shadow">
            <h3 className="text-2xl font-bold mb-4">📊 Score Trend</h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>

            <h3 className="text-2xl font-bold mt-8 mb-4">📘 Score Comparison</h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ⭐⭐⭐ FILTER MOVED HERE ⭐⭐⭐ */}
        <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-3xl shadow">
          <h3 className="text-xl font-bold mb-2">Filter by Test Type</h3>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border p-2 rounded-xl"
          >
            <option value="">All Tests</option>
            <option value="GAD7">GAD-7 Anxiety</option>
            <option value="PHQ9">PHQ-9 Depression</option>
            <option value="PSS10">PSS-10 Stress</option>
            <option value="WHO5">WHO-5 Wellbeing</option>
          </select>
        </div>

        {/* HISTORY LIST */}
        {history.length > 0 && (
          <div className="max-w-4xl mx-auto mt-10 mb-20">
            <h2 className="text-2xl font-bold mb-4">📜 Assessment History</h2>

            {history.map((h) => (
              <div
                key={h.id}
                className="p-4 mb-3 bg-gray-50 rounded-xl border flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{h.type} — Score: {h.score}</p>
                  <p className="text-gray-600">{h.level}</p>
                  <p className="text-gray-500 text-sm">{new Date(h.date).toLocaleString()}</p>
                </div>

                <button
                  onClick={() => deleteEntry(h.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl"
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
