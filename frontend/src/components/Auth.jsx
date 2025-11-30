// src/components/Auth.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Smile, LogOut, Mail, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

function Auth({ onLogin }) {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) return alert(t("enter_email_password"));
    setLoading(true);
    try {
      let res;
      if (mode === "signup") {
        res = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        res = await signInWithEmailAndPassword(auth, email, password);
      }
      setUser(res.user);
      onLogin(res.user);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    onLogin(null);
  };

  return (
    <div className="flex flex-col items-center pt-6 pb-16 px-4">

      {/* Banner */}
      {!user && (
        <motion.img
          src="/images/banners/login_banner.png"
          alt="Login Banner"
          className="w-full max-w-2xl rounded-3xl shadow-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      <motion.div
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-md border border-sky-100 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {!user ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {/* Title */}
              <h2 className="text-3xl font-bold text-sky-700 mb-2">
                {mode === "signup" ? t("create_account") : t("welcome_back")}
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                {mode === "signup" ? t("signup_message") : t("login_message")}
              </p>

              {/* Email */}
              <div className="relative mb-3">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-sky-200 p-3 pl-10 rounded-2xl w-full focus:ring-2 focus:ring-sky-300 outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative mb-4">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder={t("password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-sky-200 p-3 pl-10 rounded-2xl w-full focus:ring-2 focus:ring-sky-300 outline-none"
                />
              </div>

              {/* Submit */}
              <motion.button
                onClick={handleAuth}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
                className={`w-full py-3 rounded-2xl text-white font-semibold shadow-md transition-all ${
                  loading ? "bg-gray-400" : "bg-sky-600 hover:bg-sky-700"
                }`}
              >
                {loading
                  ? t("processing")
                  : mode === "signup"
                  ? t("sign_up")
                  : t("login")}
              </motion.button>

              {/* Switch */}
              <p
                className="text-sm text-gray-600 mt-4 cursor-pointer hover:underline"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                {mode === "login" ? t("no_account") : t("have_account")}
              </p>
            </motion.div>
          </AnimatePresence>
        ) : (
          // After Login
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center space-y-4">
              <Smile className="text-emerald-600" size={48} />

              <h2 className="text-2xl font-semibold text-emerald-700">
                {t("welcome_user")}
                <br />
                <span className="text-sky-700 text-lg">{user.email}</span>
              </h2>

              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-2xl hover:bg-red-600 shadow-md"
              >
                <LogOut size={18} /> {t("logout")}
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Auth;
