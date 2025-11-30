// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebaseConfig";

// Layout (Sidebar + Topbar)
import Layout from "./layout/Layout";

// Public pages (no sidebar)
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminLoginPage from "./pages/AdminLoginPage";

// Pages that require login
import Home from "./pages/Home";
import ChatbotPage from "./pages/ChatbotPage";
import MoodPage from "./pages/MoodPage";
import JournalPage from "./pages/JournalPage";
import SleepPage from "./pages/SleepPage";
import DreamsPage from "./pages/DreamsPage";
import ResourceHubPage from "./pages/ResourceHubPage";
import EmergencyPage from "./pages/EmergencyPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import CrisisPage from "./pages/CrisisPage";
import CommunityPage from "./pages/CommunityPage";
import AssessmentPage from "./pages/AssessmentPage";

// Dashboards
import UserDashboardPage from "./pages/UserDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

// Extra page
import FoodTipsPage from "./pages/FoodTipsPage";

// ⭐ Added
import RequireAuth from "./routes/RequireAuth";
import RequireAdmin from "./routes/RequireAdmin";

export default function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  if (user === undefined) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* USER PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout user={user}>
                <Home />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/chatbot"
          element={
            <RequireAuth>
              <Layout user={user}>
                <ChatbotPage user={user} />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/mood"
          element={
            <RequireAuth>
              <Layout user={user}>
                <MoodPage user={user} />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/journals"
          element={
            <RequireAuth>
              <Layout user={user}>
                <JournalPage user={user} />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/sleep"
          element={
            <RequireAuth>
              <Layout user={user}>
                <SleepPage user={user} />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/dreams"
          element={
            <RequireAuth>
              <Layout user={user}>
                <DreamsPage user={user} />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/resources"
          element={
            <RequireAuth>
              <Layout user={user}>
                <ResourceHubPage user={user} />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/emergency"
          element={
            <RequireAuth>
              <Layout user={user}>
                <EmergencyPage user={user} />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/appointments"
          element={
            <RequireAuth>
              <Layout user={user}>
                <AppointmentsPage userId={user?.uid} />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/crisis"
          element={
            <RequireAuth>
              <Layout user={user}>
                <CrisisPage user={user} />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/community"
          element={
            <RequireAuth>
              <Layout user={user}>
                <CommunityPage user={user} />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/assessment"
          element={
            <RequireAuth>
              <Layout user={user}>
                <AssessmentPage user={user} />
              </Layout>
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Layout user={user}>
                <UserDashboardPage user={user} />
              </Layout>
            </RequireAuth>
          }
        />

        {/* ADMIN PROTECTED ROUTE */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <Layout user={user} isAdmin={true}>
                <AdminDashboardPage user={user} />
              </Layout>
            </RequireAdmin>
          }
        />

        <Route
          path="/food-tips"
          element={
            <RequireAuth>
              <Layout user={user}>
                <FoodTipsPage user={user} />
              </Layout>
            </RequireAuth>
          }
        />

        {/* REDIRECT ALL UNKNOWN ROUTES */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
