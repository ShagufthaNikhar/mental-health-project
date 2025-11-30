// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("/api/institution-stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading admin stats:", err));
  }, []);

  if (!stats) {
    return <p className="p-6">Loading admin dashboard...</p>;
  }

  const { totalUsers, totalAppointments, moodCounts, assessmentAverages } = stats;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-blue-100 p-6 rounded-3xl shadow-md border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-700">Total Users</h2>
          <p className="text-3xl font-bold mt-3 text-blue-900">{totalUsers}</p>
        </div>

        <div className="bg-green-100 p-6 rounded-3xl shadow-md border border-green-200">
          <h2 className="text-xl font-semibold text-green-700">Appointments</h2>
          <p className="text-3xl font-bold mt-3 text-green-900">
            {totalAppointments}
          </p>
        </div>

        <div className="bg-purple-100 p-6 rounded-3xl shadow-md border border-purple-200">
          <h2 className="text-xl font-semibold text-purple-700">
            Mood Distribution
          </h2>

          {Object.keys(moodCounts).length === 0 ? (
            <p className="text-purple-600 mt-3">No mood data.</p>
          ) : (
            <ul className="mt-3 space-y-1 text-purple-800">
              {Object.entries(moodCounts).map(([score, count]) => (
                <li key={score}>
                  Mood {score}: <strong>{count}</strong> entries
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Assessments */}
      <div className="bg-yellow-100 p-6 rounded-3xl shadow-md border border-yellow-200">
        <h2 className="text-xl font-semibold text-yellow-700 mb-3">
          Assessment Averages
        </h2>

        {Object.keys(assessmentAverages).length === 0 ? (
          <p className="text-yellow-700">No assessment data yet.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-yellow-800">
            {Object.entries(assessmentAverages).map(([type, avg]) => (
              <li key={type}>
                <strong>{type}</strong>: {avg}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
