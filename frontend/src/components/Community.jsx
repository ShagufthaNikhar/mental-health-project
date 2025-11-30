// src/components/Community.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, UserCircle2, Leaf } from "lucide-react";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Community() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ name: "", topic: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function fetchPosts() {
    try {
      const res = await axios.get(`${API}/api/community`);
      setPosts(res.data.reverse());
    } catch (err) {
      console.error("Error fetching posts:", err);
      alert(t("community_error_load"));
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function submitPost() {
    if (!form.message.trim()) return alert(t("community_empty_message"));
    setLoading(true);

    try {
      await axios.post(`${API}/api/community`, form);
      setForm({ name: "", topic: "", message: "" });
      fetchPosts();
    } catch (err) {
      alert(t("community_error_post"));
    } finally {
      setLoading(false);
    }
  }

  async function likePost(id) {
    try {
      await axios.post(`${API}/api/community/${id}/like`);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="w-full flex justify-center mt-4 pb-20">

      <motion.div
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-green-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <motion.img
            src="/images/banners/community_banner.png"
            alt="Community"
            className="w-28 mb-2"
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
          />

          <div className="flex items-center gap-2">
            <Leaf className="text-emerald-700" size={32} />
            <h2 className="text-3xl font-bold text-emerald-800">
              {t("community_title")}
            </h2>
          </div>

          <p className="text-gray-700 text-center mt-2 max-w-xl">
            {t("community_description")}
          </p>
        </div>

        {/* Post Form */}
        <div className="bg-white p-5 rounded-2xl shadow-md mb-8 border border-green-100">
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder={t("community_name_placeholder")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-emerald-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none"
            />
            <input
              type="text"
              placeholder={t("community_topic_placeholder")}
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="border border-emerald-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none"
            />
          </div>

          <textarea
            placeholder={t("community_message_placeholder")}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-emerald-200 rounded-xl p-3 h-24 focus:ring-2 focus:ring-emerald-300 outline-none"
          />

          <motion.button
            onClick={submitPost}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className={`mt-4 w-full sm:w-auto bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold shadow-md hover:bg-emerald-700 transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? t("community_posting") : t("community_post_button")}
          </motion.button>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <p className="text-gray-600 italic text-center">
            {t("community_no_posts")}
          </p>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence>
              {posts.map((p) => (
                <motion.li
                  key={p.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-5 rounded-2xl shadow-md border border-green-100 hover:shadow-xl transition-all"
                >
                  {/* User Info */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="text-emerald-800" size={22} />
                      <p className="font-semibold text-emerald-800">
                        {p.name || t("community_anonymous")}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(p.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-gray-900 mb-3">{p.message}</p>

                  {/* Footer */}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="italic text-emerald-700">
                      🌿 {t("community_topic")}:{" "}
                      {p.topic || t("community_general")}
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => likePost(p.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium"
                    >
                      <Heart size={18} /> {p.likes || 0}
                    </motion.button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
    </div>
  );
}

export default Community;
