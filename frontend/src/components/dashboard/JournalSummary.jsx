import React, { useEffect, useState } from "react";
import axios from "axios";

export default function JournalSummary({ userId }) {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/journals/${userId}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setJournals(data);
      })
      .catch((err) => {
        console.error("Journal fetch error:", err);
        setJournals([]);
      });
  }, [userId]);

  const recent = journals[0];

  return (
    <div className="bg-pink-100 p-6 rounded-3xl shadow-md">
      <h2 className="text-xl font-semibold text-pink-700">📝 Journaling Summary</h2>

      <p className="text-pink-700 mt-3">Total Entries: {journals.length}</p>

      {recent ? (
        <p className="text-pink-600 mt-2 italic">
          Last: "{recent.text.slice(0, 40)}..."
        </p>
      ) : (
        <p className="text-pink-600 mt-3">No entries yet.</p>
      )}
    </div>
  );
}
