// src/components/Appointments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Appointments() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    slot: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const slots = ["10:00 AM", "12:00 PM", "03:00 PM", "05:00 PM"];

  async function fetchAppointments() {
    try {
      const res = await axios.get(`${API}/api/appointments`);
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Error loading appointments", err);
    }
  }

  async function bookAppointment() {
    const { name, email, date, slot } = form;
    if (!name || !email || !date || !slot) return;

    try {
      await axios.post(`${API}/api/appointments`, {
        ...form,
        status: "Pending",
      });

      setForm({ name: "", email: "", date: "", slot: "" });
      fetchAppointments();

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      console.error("Error booking appointment", err);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col items-center pt-6 pb-14 px-4">
      <motion.div
        className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-3xl border border-sky-200"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Banner */}
        <div className="flex flex-col items-center">
        <img
          src="/images/banners/appointments_banner.png"
          alt="Appointments Banner"
          className="w-24 h- 24 shadow mb-3 opacity-90"
        />
        </div>

        {/* Title */}
        <div className="flex items-center justify-center gap-3 mb-7">
          <CalendarDays className="text-sky-600" size={32} />
          <h2 className="text-3xl font-bold text-sky-700">
            {t("appointments_title")}
          </h2>
        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            placeholder={t("appointments_name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-sky-200 rounded-xl p-3 focus:ring-2 focus:ring-sky-300 outline-none"
          />

          <input
            type="email"
            placeholder={t("appointments_email")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-sky-200 rounded-xl p-3 focus:ring-2 focus:ring-sky-300 outline-none"
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border border-sky-200 rounded-xl p-3 focus:ring-2 focus:ring-sky-300 outline-none col-span-2"
          />
        </div>

        {/* Time Slots */}
        <div className="mb-5">
          <p className="font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Clock className="text-indigo-600" size={20} />
            {t("appointments_select_slot")}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {slots.map((s) => (
              <motion.button
                key={s}
                onClick={() => setForm({ ...form, slot: s })}
                className={`p-3 rounded-xl font-medium shadow-sm transition-all ${
                  form.slot === s
                    ? "bg-sky-600 text-white"
                    : "bg-white border border-sky-200 hover:bg-sky-100 text-gray-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <motion.button
          onClick={bookAppointment}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 shadow"
        >
          {t("appointments_confirm")}
        </motion.button>

        {/* Success Popup */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="fixed inset-0 flex justify-center items-center bg-black/30 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-sm"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <CheckCircle className="text-emerald-500 mx-auto mb-3" size={40} />
                <h3 className="text-xl font-semibold text-emerald-700 mb-1">
                  {t("appointments_success")}
                </h3>
                <p className="text-gray-600">
                  {t("appointments_success_message")}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upcoming Appointments */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">
            {t("appointments_upcoming")}
          </h3>

          {appointments.length === 0 ? (
            <div className="text-slate-500 text-center py-4">
              {t("appointments_none")}
            </div>
          ) : (
            <ul className="space-y-3">
              {appointments
                .slice()
                .reverse()
                .map((appt) => (
                  <motion.li
                    key={appt.id}
                    className="bg-white border border-sky-100 rounded-xl p-3 shadow-sm"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="font-semibold text-sky-700">
                      {appt.name} — {appt.date}
                    </div>

                    <div className="text-slate-600 text-sm">
                      {appt.email} • {appt.slot}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      {t("appointments_status")}: {appt.status || "Pending"}
                    </div>
                  </motion.li>
                ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}
