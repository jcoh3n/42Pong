"use client";

import useMatchmaking from "@/hooks/matchmaking/useMatchmaking";
import { Box, Flex, Text, Tooltip } from "@radix-ui/themes";
import { ClockIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import Loading from "../Loading";

// Game mode colors from MatchmakingMenu.tsx
const MODE_COLORS = {
  normal: {
    gradient: "linear-gradient(to right, #4CAF50 0%, #388E3C 100%)",
    glow: "rgba(76, 175, 80, 0.3)"
  },
  ranked: {
    gradient: "linear-gradient(to right, #007BFF 0%, #0056B3 100%)",
    glow: "rgba(0, 123, 255, 0.3)"
  },
  friendly: {
    gradient: "linear-gradient(to right, #FF9800 0%, #F57C00 100%)",
    glow: "rgba(255, 152, 0, 0.3)"
  },
  match: {
    gradient: "linear-gradient(to right, rgb(239, 68, 68), rgb(220, 38, 38))",
    glow: "rgba(239, 68, 68, 0.3)"
  }
};

export function MatchmakingBubble() {
  const { data, isLoading, timeInQueue, stopMatchmaking } = useMatchmaking();
  
  // If not in matchmaking or match, don't show anything
  if (!data?.data?.inQueue && !data?.data?.inMatch || isLoading) {
    return null;
  }

  const isInQueue = data?.data?.inQueue;
  const isInMatch = data?.data?.inMatch;
  const matchType = data?.data?.queueData?.matche_type || "normal";
  
  // Get the appropriate colors based on match type or match status
  const colors = MODE_COLORS[matchType] || MODE_COLORS.normal;

  return (
    <Tooltip content={isInQueue ? "Cancel" : "In a match"}>
      <Box 
        className="
          relative px-3 py-1.5 rounded-full 
          bg-gradient-to-r
          animate-pulse
          flex items-center gap-3
          cursor-pointer
          transition-all duration-200
          hover:brightness-110
          active:scale-95
        "
        style={{
          backgroundImage: colors.gradient,
          boxShadow: `0 0 8px ${colors.glow}`
        }}
        onClick={isInQueue ? () => stopMatchmaking() : undefined}
      >
        {isInQueue ? (
          <Flex align="center" justify="between" width="100%">
            <Flex align="center" gap="2">
              {isLoading ? (
                <Loading />
              ) : (
                <ClockIcon width="14" height="14" className="text-white" />
              )}
              <Text size="1" weight="medium" className="text-white">
                {timeInQueue || "0s"}
              </Text>
            </Flex>
            <CrossCircledIcon 
              width="14" 
              height="14" 
              className="text-white/70 hover:text-white ml-1" 
              onClick={(e) => {
                e.stopPropagation();
                stopMatchmaking();
              }}
              aria-label="Cancel matchmaking"
            />
          </Flex>
        ) : (
          <Flex align="center" gap="1">
            <Text size="1" weight="medium" className="text-white">
              In Match
            </Text>
          </Flex>
        )}
      </Box>
    </Tooltip>
  );
} 