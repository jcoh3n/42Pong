import React from 'react';
import { Avatar, Flex, Heading, Text } from "@radix-ui/themes";
import { User } from '@/services';

interface PlayerScoreProps {
  user?: User | null;
  score: number;
}

// PlayerScore component - displays a player's avatar, login, and score
const PlayerScore = ({ user, score }: PlayerScoreProps) => {
  return (
    <Flex direction="column" align="center" gap="2">
      <Avatar 
        size="6" 
        src={user?.avatar_url || ""} 
        fallback={(user?.login || "P").substring(0, 2)} 
        radius="full"
      />
      <Text size="2" weight="bold">{user?.login || "Player"}</Text>
      <Heading size="8" color="blue">{score}</Heading>
    </Flex>
  );
};

export default PlayerScore; 