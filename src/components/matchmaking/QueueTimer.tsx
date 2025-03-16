import React from 'react';
import { motion } from "framer-motion";
import { Timer } from "lucide-react";

interface QueueTimerProps {
  time: string | null;
}

const QueueTimer: React.FC<QueueTimerProps> = ({ time }) => {
  if (!time) return null;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
      }}
      className="flex items-center gap-2 sm:gap-3 bg-gray-900/95 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative"
      >
        <div className="absolute inset-0 bg-white/10 rounded-full blur-[8px]" />
        <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-white relative" />
      </motion.div>
      <span className="text-sm sm:text-base font-semibold text-white tracking-wide">
        {time}
      </span>
    </motion.div>
  );
};

export default QueueTimer; 