import React from 'react';
import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { User } from '@/services';
import PlayerScore from './PlayerScore';

interface MatchInfoProps {
  currentUser?: User | null;
  opponent?: User | null;
  match: any;
}

// MatchInfo component - displays the match information with both players and the VS indicator
const MatchInfo = ({ currentUser, opponent, match }: MatchInfoProps) => {
  // Determine which score belongs to which user
  const currentUserScore = currentUser?.id === match?.user_1_id 
    ? match?.user_1_score 
    : match?.user_2_score;

  const opponentScore = currentUser?.id === match?.user_1_id 
    ? match?.user_2_score 
    : match?.user_1_score;

  return (
    <Card className="w-full max-w-xl">
      <Flex justify="between" p="4" align="center">
        {/* Current User */}
        <PlayerScore user={currentUser} score={currentUserScore || 0} />

        {/* VS indicator */}
        <Box>
          <Heading size="6" color="gray">VS</Heading>
        </Box>

        {/* Opponent */}
        <PlayerScore user={opponent} score={opponentScore || 0} />
      </Flex>
    </Card>
  );
};

export default MatchInfo; 