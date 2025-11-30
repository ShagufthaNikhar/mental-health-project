import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MoodSummary({ userId }) {
  const [moodData, setMoodData] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/mood/${userId}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setMoodData(data);
      })
      .catch((err) => {
        console.error("Mood fetch error:", err);
        setMoodData([]);
      });
  }, [userId]);

  const latest = moodData[0];

  return (
    <div className="bg-blue-100 p-6 rounded-3xl shadow-md">
      <h2 className="text-xl font-semibold text-blue-700">😊 Mood Trends</h2>

      {moodData.length === 0 ? (
        <p className="text-blue-600 mt-3">No mood data yet.</p>
      ) : (
        <p className="text-blue-600 mt-3">
          Latest Mood Score: {latest.score} ⭐
        </p>
      )}
    </div>
  );
}
