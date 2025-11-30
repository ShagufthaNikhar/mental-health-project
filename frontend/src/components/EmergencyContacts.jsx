// src/components/EmergencyContacts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, UserPlus, Trash2, Users2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function EmergencyContacts() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    relation: "",
  });

  // -------------------------------
  // Indian Number Validator
  // -------------------------------
  function isValidIndianNumber(phone) {
    if (!phone) return false;

    let p = phone.replace(/[\s\-()]/g, "");

    if (p.startsWith("+91")) p = p.slice(3);
    else if (p.startsWith("91")) p = p.slice(2);

    if (p.startsWith("0")) p = p.slice(1);

    const regex = /^[6-9]\d{9}$/;
    return regex.test(p);
  }

  // -------------------------------
  // Format Number to +91XXXXXXXXXX
  // -------------------------------
  function formatPhone(phone) {
    if (!phone) return "";
    let p = phone.replace(/[\s\-()]/g, "");

    if (p.startsWith("+91")) return p;
    if (p.startsWith("91")) return `+${p}`;
    if (p.startsWith("0")) p = p.slice(1);

    return `+91${p}`;
  }

  // SMS default message
  const smsText =
    t("emergency_sms_body") ||
    "I need help. Please contact me immediately.";

  // Fetch contacts
  async function fetchContacts() {
    try {
      const res = await axios.get(`${API}/api/emergency-contacts`);
      setContacts(res.data);
    } catch {
      alert(t("emergency_error_load"));
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  // Add Contact
  async function addContact() {
    if (!form.name.trim() || !form.phone.trim()) {
      return alert(t("emergency_missing_fields"));
    }

    // Validate Indian Number
    if (!isValidIndianNumber(form.phone)) {
      return alert("Please enter a valid Indian mobile number (10 digits starting with 6-9).");
    }

    setLoading(true);
    try {
      await axios.post(`${API}/api/emergency-contacts`, form);
      setForm({ name: "", phone: "", relation: "" });
      fetchContacts();
    } catch {
      alert(t("emergency_error_add"));
    } finally {
      setLoading(false);
    }
  }

  // Delete Contact
  async function deleteContact(id) {
    if (!window.confirm(t("emergency_confirm_delete"))) return;

    try {
      await axios.delete(`${API}/api/emergency-contacts/${id}`);
      fetchContacts();
    } catch {
      alert(t("emergency_error_delete"));
    }
  }

  return (
    <div className="flex flex-col items-center pt-10 pb-20 px-4">
      {/* MAIN BORDERED BOX */}
      <motion.div
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-3xl border border-sky-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Banner INSIDE Box */}
        <motion.img
          src="/images/banners/emergency_banner.png"
          alt="Emergency Contacts"
          className="w-36 mx-auto mb-6 opacity-95"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <Users2 className="text-sky-600" size={32} />
          <h2 className="text-3xl font-bold text-sky-700">
            {t("emergency_title")}
          </h2>
        </div>

        <p className="text-gray-600 text-center mb-6">
          {t("emergency_subtitle")}
        </p>

        {/* Form */}
        <div className="grid sm:grid-cols-4 gap-3 mb-6">
          <input
            type="text"
            placeholder={t("emergency_name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-sky-200 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-sky-300 outline-none"
          />

          <input
            type="text"
            placeholder={t("emergency_phone")}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border border-sky-200 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-sky-300 outline-none"
          />

          <input
            type="text"
            placeholder={t("emergency_relation")}
            value={form.relation}
            onChange={(e) => setForm({ ...form, relation: e.target.value })}
            className="border border-sky-200 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-sky-300 outline-none"
          />

          <motion.button
            onClick={addContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className={`flex items-center justify-center gap-2 text-white px-4 py-3 rounded-xl font-semibold shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600"
            }`}
          >
            <UserPlus size={18} />
            {loading ? t("emergency_saving") : t("emergency_add")}
          </motion.button>
        </div>

        {/* Contact List */}
        {contacts.length === 0 ? (
          <p className="text-center text-gray-500 italic py-4">
            {t("emergency_no_contacts")}
          </p>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence>
              {contacts.map((c) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center bg-white p-4 rounded-xl border border-sky-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div>
                    <p className="font-semibold text-sky-700 flex items-center gap-2">
                      <Phone size={16} className="text-sky-600" />
                      {c.name}
                    </p>

                    <p className="text-gray-600 text-sm">
                      📞 {c.phone}
                      {c.relation ? (
                        <span className="text-gray-500"> ({c.relation})</span>
                      ) : null}
                    </p>

                    {/* CALL + SMS BUTTONS */}
                    <div className="flex gap-3 mt-3">

                      {/* CALL button */}
                      <a
                        href={`tel:${formatPhone(c.phone)}`}
                        className="bg-green-400/90 hover:bg-green-500 text-white px-3 py-2 rounded-xl text-sm flex items-center gap-1 shadow transition"
                      >
                        📞 Call
                      </a>

                      {/* SMS button */}
                      <a
                        href={`sms:${formatPhone(c.phone)}?body=${encodeURIComponent(
                          smsText
                        )}`}
                        className="bg-yellow-400/90 hover:bg-yellow-500 text-white px-3 py-2 rounded-xl text-sm flex items-center gap-1 shadow transition"
                      >
                        ✉️ SMS
                      </a>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => deleteContact(c.id)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>
    </div>
  );
}

export default EmergencyContacts;
