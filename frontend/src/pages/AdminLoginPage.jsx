// src/pages/AdminLoginPage.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Your actual admin email stored in Firebase
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@example.com";

  async function handleAdminLogin() {
    try {
      let finalEmail = email.trim();

      // ⭐ Auto-convert "admin" → real admin email
      if (finalEmail.toLowerCase() === "admin") {
        finalEmail = ADMIN_EMAIL;
      }

      const res = await signInWithEmailAndPassword(auth, finalEmail, password);

      if (res.user.email !== ADMIN_EMAIL) {
        alert("Not an admin account");
        return;
      }

      localStorage.setItem("isAdmin", "true");
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-indigo-50 px-6">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">Admin Login</h1>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="Admin Email or 'admin'"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAdminLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-indigo-700 underline">
            ← User Login
          </Link>
        </div>
      </div>
    </div>
  );
}
