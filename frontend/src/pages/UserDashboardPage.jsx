// src/pages/UserDashboardPage.jsx
import React from "react";
import MoodSummary from "../components/dashboard/MoodSummary.jsx";
import JournalSummary from "../components/dashboard/JournalSummary.jsx";
import AppointmentSummary from "../components/dashboard/AppointmentSummary.jsx";
import DreamsSummary from "../components/dashboard/DreamsSummary.jsx";
import { auth } from "../firebaseConfig";

export default function UserDashboardPage() {
  const user = auth.currentUser;

  // If user not loaded yet
  if (!user) {
    return <p className="p-6">Loading...</p>;
  }

  const userId = user.uid; // ✅ Correct Firebase UID

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Pass userId to ALL summary components */}
        <MoodSummary userId={userId} />
        <JournalSummary userId={userId} />
        <AppointmentSummary userId={userId} />
        <DreamsSummary userId={userId} />
      </div>
    </div>
  );
}
