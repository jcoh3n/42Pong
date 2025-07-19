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
  color = "#60a5fa",
  bgColor = "rgba(255, 255, 255, 0.15)", // Fallback
  glowColor = "rgba(96, 165, 250, 0.3)" // Fallback
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
          transition-all duration-300
          h-[150px] sm:h-[160px] md:h-[180px] lg:h-[200px]
        `}
        style={{
          background: `linear-gradient(135deg, ${bgColor} 0%, rgba(255, 255, 255, 0.08) 100%)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${glowColor}`,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Effet de hover semi-transparent */}
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, ${color}15 0%, ${color}08 100%)`,
          }}
          whileHover={{ opacity: 1 }}
        />

        <div className="absolute inset-0 flex items-center px-6 sm:px-8">
          <div className="flex items-center gap-6 sm:gap-8 w-full">
            <div 
              className={`
                p-4 sm:p-5 md:p-6 rounded-xl
                transition-all duration-300 backdrop-blur-sm
                ${isActive ? 'bg-white/25 scale-105' : 'bg-white/15'}
                transform-gpu hover:scale-105 hover:bg-white/30
              `}
              style={{
                border: `1px solid ${glowColor}`,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              <Icon 
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 transition-transform duration-300
                  ${isActive ? 'scale-110' : ''}
                `} 
                style={{ 
                  color: color, 
                  filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.3)) drop-shadow(0 0 8px ${color}40)`
                }} 
              />
            </div>
            
            <div className="flex items-center justify-between w-full">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mix-blend-exclusion">
                {title}
              </h3>
              
              {/* Contenu additionnel à droite */}
              {isActive && additionalContent && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="ml-4"
                >
                  {additionalContent}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Loader overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center">
            <div 
              className="w-8 h-8 border-3 rounded-full animate-spin"
              style={{
                borderWidth: '3px',
                borderStyle: 'solid',
                borderColor: `${color}40`,
                borderTopColor: color,
              }}
            />
          </div>
        )}

        {/* Effet actif subtil */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, ${color}10 0%, ${color}05 100%)`,
              borderRadius: "inherit",
              border: `1px solid ${color}60`,
            }}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default GameModeCard; 