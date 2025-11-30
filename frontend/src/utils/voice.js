// Language map for all pages
export const voiceLangMap = {
  en: "en-IN",
  hi: "hi-IN",
  kn: "kn-IN",
  te: "te-IN",
  ur: "ur-PK",
  mr: "mr-IN",
};

// Remove emojis before speaking
function stripEmojis(str) {
  return str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\u24C2|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u26FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF])/g, "");
}

export function speakText(text, lang = "en-IN") {
  try {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.getVoices();

    const waitForVoices = setInterval(() => {
      const voices = window.speechSynthesis.getVoices();

      if (voices.length !== 0) {
        clearInterval(waitForVoices);
        speakWithVoices(text, lang, voices);
      }
    }, 50);

  } catch (e) {
    console.warn("Speech error:", e);
  }
}

function speakWithVoices(text, lang, voices) {
  window.speechSynthesis.cancel();

  const cleanText = stripEmojis(text); // 👈 remove emojis
  const speech = new SpeechSynthesisUtterance(cleanText);

  const hasVoice = voices.some((v) =>
    v.lang.toLowerCase().includes(lang.toLowerCase())
  );

  speech.lang = hasVoice ? lang : "en-IN";

  speech.rate = 0.95;
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);
}
