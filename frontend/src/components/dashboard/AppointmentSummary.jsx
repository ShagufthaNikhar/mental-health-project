import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AppointmentSummary({ userId }) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/appointments/${userId}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAppointments(data);
      })
      .catch((err) => {
        console.error("Appointments fetch error:", err);
        setAppointments([]);
      });
  }, [userId]);

  const upcoming = appointments[0];

  return (
    <div className="bg-green-100 p-6 rounded-3xl shadow-md">
      <h2 className="text-xl font-semibold text-green-700">📅 Appointments</h2>

      <p className="text-green-700">Total: {appointments.length}</p>

      {upcoming ? (
        <p className="text-green-600 mt-3">
          Next: {upcoming.date} at {upcoming.time}
        </p>
      ) : (
        <p className="text-green-600 mt-3">No upcoming appointments.</p>
      )}
    </div>
  );
}
