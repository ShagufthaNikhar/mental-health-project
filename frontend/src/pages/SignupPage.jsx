import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleSignup() {
    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-sky-50 px-6">
      <h1 className="text-4xl font-bold text-sky-700 mb-6">Create Account</h1>

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

        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="Confirm Password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-sky-600 text-white py-3 rounded-lg"
        >
          Create Account
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <Link to="/login" className="text-sky-700 underline">
            Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
