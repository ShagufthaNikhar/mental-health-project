import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DreamsSummary({ userId }) {
  const [dreams, setDreams] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/dreams/${userId}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setDreams(data);
      })
      .catch((err) => {
        console.error("Dreams fetch error:", err);
        setDreams([]);
      });
  }, [userId]);

  const recent = dreams[0];

  return (
    <div className="bg-yellow-100 p-6 rounded-3xl shadow-md">
      <h2 className="text-xl font-semibold text-yellow-700">🌙 Dream Tracker</h2>

      <p className="text-yellow-700">Dreams Logged: {dreams.length}</p>

      {recent ? (
        <p className="text-yellow-600 mt-3">
          Most Recent: "{recent.description.slice(0, 40)}..."
        </p>
      ) : (
        <p className="text-yellow-600 mt-3">No dreams recorded.</p>
      )}
    </div>
  );
}
