import { motion } from "framer-motion";
import { Github, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#71C9CE] via-[#A6E3E9] to-[#CBF1F5] py-6 mt-16 backdrop-blur-md shadow-inner border-t border-white/40">
      <motion.div
        className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 text-[#12486B]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Side Text */}
        <p className="text-center md:text-left text-sm md:text-base mb-4 md:mb-0 font-medium">
          💙 <span className="font-semibold">MindSpace</span> — Your Peaceful Companion  
          © {new Date().getFullYear()}
        </p>

        {/* Social Icons */}
        <div className="flex space-x-6">
          <motion.a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15 }}
            className="text-[#12486B] hover:text-[#0D3A4A] transition"
          >
            <Github size={22} />
          </motion.a>

          <motion.a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15 }}
            className="text-[#12486B] hover:text-[#0D3A4A] transition"
          >
            <Linkedin size={22} />
          </motion.a>
        </div>
      </motion.div>

      {/* Bottom Note */}
      <p className="text-center text-[#12486B] mt-3 text-xs font-medium">
        Made with <Heart className="inline text-rose-500 mx-0.5" size={13} />  
        to bring calmness, clarity, and care ✨
      </p>
    </footer>
  );
}
