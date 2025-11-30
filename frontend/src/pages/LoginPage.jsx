// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      
      {/* ⭐ Left Banner */}
      <div className="hidden md:flex flex-col justify-center items-center bg-sky-600 text-white p-10">
        <h2 className="text-5xl font-bold mb-4">Welcome Back!</h2>
        <p className="text-lg opacity-90 text-center">
          Your mental wellness companion is here.  
          Track, learn, grow — all in one place.
        </p>

        {/* Illustration */}
        <img
          
          src="/images/banners/mind_banner.png"
          alt="Mind"
          className="w-72 mt-6 drop-shadow-xl"
        />
      </div>

      {/* ⭐ Login Form */}
      <div className="flex flex-col justify-center items-center bg-sky-50 px-6 py-12">
        <h1 className="text-4xl font-bold text-sky-700 mb-6">MindSpace Login</h1>

        <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
          <input
            className="w-full p-3 border rounded mb-4"
            placeholder="Email"
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
            onClick={handleLogin}
            className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition"
          >
            Login
          </button>

          {/* ⭐ Create New Account */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">Don't have an account?</p>
            <Link to="/signup" className="text-sky-700 underline">
              Create New Account →
            </Link>
          </div>

          {/* ⭐ Admin Login */}
          <div className="mt-4 text-center">
            <Link to="/admin-login" className="text-sky-700 underline">
              Admin Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
