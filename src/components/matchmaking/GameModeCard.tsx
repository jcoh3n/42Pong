import React from 'react';
import { Card } from "@nextui-org/react";
import { motion } from "framer-motion";
import { IconType } from 'react-icons';

interface GameModeCardProps {
  title: string;
  icon: IconType;
  isLoading?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  additionalContent?: React.ReactNode;
  color?: string;
  bgColor?: string;
  glowColor?: string;
}

const GameModeCard: React.FC<GameModeCardProps> = ({
  title,
  icon: Icon,
  isLoading,
  isActive,
  onClick,
  additionalContent,
  color = "#0072F5",
  bgColor = "#1a365d",
  glowColor = "rgba(0, 114, 245, 0.2)"
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="w-full cursor-pointer relative"
    >
      <Card 
        className={`
          w-full relative overflow-hidden rounded-2xl
          ${isActive ? 'shadow-2xl' : 'hover:shadow-xl'}
          transition-all duration-200
          h-[150px] sm:h-[160px] md:h-[180px] lg:h-[200px]
        `}
        style={{
          background: bgColor,
          border: `2px solid ${color}30`,
          boxShadow: `0 0 20px ${glowColor}`
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${color}30, transparent 70%)`
          }}
        />

        <div className="absolute inset-0 flex items-center px-6 sm:px-8">
          <div className="flex items-center gap-6 sm:gap-8">
            <div 
              className={`
                p-4 sm:p-5 md:p-6 rounded-xl
                transition-colors duration-200 backdrop-blur-sm
                ${isActive ? 'bg-white/30' : 'bg-white/20'}
                transform-gpu hover:scale-105
              `}
              style={{
                boxShadow: `0 0 10px ${glowColor}`
              }}
            >
              <Icon 
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 transition-transform
                  ${isActive ? 'scale-110' : ''}
                `} 
                style={{ color: 'white' }} 
              />
            </div>
            <div className="flex items-center gap-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                {title}
              </h3>
            </div>
          </div>
        </div>

        {isActive && additionalContent && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2"
          >
            {additionalContent}
          </motion.div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, ${color}10 0%, ${color}20 100%)`,
              borderRadius: "inherit"
            }}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default GameModeCard; 