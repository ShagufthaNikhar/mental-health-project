// src/components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Bot, Mic, MicOff, Send, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Chatbot() {
  const { t } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history
  useEffect(() => {
    async function loadChat() {
      try {
        const res = await axios.get(`${API}/api/chatHistory`);
        if (!res.data || res.data.length === 0) {
          const greeting = { sender: "bot", text: t("chatbot_greeting") };
          setMessages([greeting]);
          await axios.post(`${API}/api/chatHistory`, greeting);
        } else {
          setMessages(res.data);
        }
      } catch (err) {
        console.error("Error loading chat history", err);
      }
    }
    loadChat();
  }, [t]);

  async function saveMessage(sender, text) {
    try {
      await axios.post(`${API}/api/chatHistory`, { sender, text });
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  // Text-to-speech
  function speak(text) {
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-IN";
      speechSynthesis.speak(utter);
    } catch {}
  }

  // Send message
  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    saveMessage("user", input);
    setInput("");

    try {
      setIsTyping(true);
      const res = await axios.post(`${API}/api/chatbot`, {
        message: userMsg.text,
      });

      const reply = res.data.reply || t("chatbot_thinking");
      const botMsg = { sender: "bot", text: reply };

      setMessages((prev) => [...prev, botMsg]);
      saveMessage("bot", reply);
      speak(reply);
    } catch (err) {
      const failMsg = {
        sender: "bot",
        text: t("chatbot_error"),
      };
      setMessages((prev) => [...prev, failMsg]);
      saveMessage("bot", failMsg.text);
      speak(failMsg.text);
    } finally {
      setIsTyping(false);
    }
  }

  // Clear chat
  async function clearChat() {
    if (!confirm(t("chatbot_confirm_clear"))) return;
    await axios.delete(`${API}/api/chatHistory`);
    const reset = { sender: "bot", text: t("chatbot_cleared") };
    setMessages([reset]);
    saveMessage("bot", reset.text);
    speak(reset.text);
  }

  // Voice recognition
  function toggleListening() {
    if (!("webkitSpeechRecognition" in window)) {
      alert(t("chatbot_no_speech"));
      return;
    }

    if (!recognitionRef.current) {
      const rec = new window.webkitSpeechRecognition();
      rec.lang = "en-IN";
      rec.interimResults = false;

      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      recognitionRef.current = rec;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }

  return (
    <div className="w-full flex justify-center mt-4 pb-20">

      {/* Main Chatbox Card */}
      <motion.div
        className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl w-full max-w-2xl border border-sky-100 flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Bot className="text-sky-600" size={28} />
            <h2 className="text-2xl font-bold text-sky-700">
              {t("chatbot_title")}
            </h2>
          </div>

          <button
            onClick={clearChat}
            className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
          >
            <Trash2 size={16} /> {t("chatbot_clear")}
          </button>
        </div>

        {/* Chat Window */}
        <div className="flex-1 min-h-[380px] max-h-[420px] overflow-y-auto bg-white border border-sky-100 rounded-2xl p-4 mb-4 shadow-inner">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`mb-3 p-3 rounded-2xl max-w-[85%] ${
                msg.sender === "user"
                  ? "ml-auto bg-sky-200 text-right text-sky-900"
                  : "mr-auto bg-emerald-100 text-left text-emerald-900"
              } shadow-sm`}
            >
              {msg.text}
            </motion.div>
          ))}

          {isTyping && (
            <div className="ml-2 text-slate-500 italic animate-pulse">
              {t("chatbot_typing")}
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input Row */}
        <div className="flex gap-2 items-center">
          <motion.button
            onClick={toggleListening}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-full shadow-md ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-sky-600 text-white hover:bg-sky-700"
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </motion.button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chatbot_placeholder")}
            className="flex-1 border border-sky-200 rounded-2xl p-3 focus:ring-2 focus:ring-sky-300 outline-none"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <motion.button
            onClick={sendMessage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="bg-emerald-600 text-white px-4 py-3 rounded-2xl hover:bg-emerald-700 flex items-center gap-1 font-medium shadow-md"
          >
            <Send size={18} /> {t("chatbot_send")}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Chatbot;
