import React, { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { useTranslation } from "react-i18next";

function SleepSounds() {
  const { t } = useTranslation();

  const [currentSound, setCurrentSound] = useState(null);
  const audioRef = useRef(null);

  // 🎧 Static sounds from frontend
  const sounds = [
    { id: 1, title: "Rain", type: "sleep", url: "/sounds/rain.mp3" },
    { id: 2, title: "Ocean Waves", type: "sleep", url: "/sounds/ocean.mp3" },
    { id: 3, title: "Forest Ambience", type: "sleep", url: "/sounds/forest.mp3" },
    { id: 4, title: "Birds Chirping", type: "sleep", url: "/sounds/birds.mp3" },
    { id: 5, title: "Thunderstorm", type: "sleep", url: "/sounds/thunder.mp3" },
    { id: 6, title: "White Noise", type: "asmr", url: "/sounds/white-noise.mp3" },
    { id: 7, title: "Wind Chimes", type: "asmr", url: "/sounds/wind-chime.mp3" },
  ];

  const playSound = (sound) => {
    if (!audioRef.current) return;

    // Stop if same audio
    if (currentSound?.id === sound.id) {
      audioRef.current.pause();
      setCurrentSound(null);
      return;
    }

    setCurrentSound(sound);
    audioRef.current.src = sound.url;

    audioRef.current.play().catch((e) => console.error("Audio play error:", e));
  };

  return (
    <div className="flex flex-col items-center pt-10 pb-20 px-4">

      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl 
                      w-full max-w-3xl border border-indigo-100">

        {/* Banner Now INSIDE Box */}
        <img
          src="/images/banners/sleep_banner.png"
          alt="Sleep & Relaxation"
          className="w-40 mx-auto mb-6 opacity-90"
        />

        <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          🌙 {t("sleep_sounds_title")}
        </h2>

        <ul className="space-y-4">
          {sounds.map((sound) => (
            <li
              key={sound.id}
              className="flex justify-between items-center bg-white/80 
                         backdrop-blur-md border border-indigo-200 rounded-xl 
                         p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <p className="font-semibold text-indigo-800">{sound.title}</p>
                <p className="text-sm text-gray-500 capitalize">{sound.type}</p>
              </div>

              <button
                onClick={() => playSound(sound)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                           text-white transition-all ${
                             currentSound?.id === sound.id
                               ? "bg-red-500 hover:bg-red-600"
                               : "bg-indigo-600 hover:bg-indigo-700"
                           }`}
              >
                {currentSound?.id === sound.id ? (
                  <>
                    <Pause size={18} /> {t("sleep_sounds_stop")}
                  </>
                ) : (
                  <>
                    <Play size={18} /> {t("sleep_sounds_play")}
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Audio */}
        <audio
          ref={audioRef}
          controls
          autoPlay
          className="mt-6 w-full rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}

export default SleepSounds;
