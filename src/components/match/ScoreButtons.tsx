import React from 'react';
import { Button, Flex } from "@radix-ui/themes";
import { User } from '@/services';

interface ScoreButtonsProps {
  currentUser?: User | null;
  opponent?: User | null;
  onIncrement: () => Promise<void>;
}

// ScoreButtons component - displays the two buttons at the bottom
const ScoreButtons = ({ currentUser, opponent, onIncrement }: ScoreButtonsProps) => {
  return (
    <Flex gap="6" className="mt-auto mb-6" justify="center">
      <Button 
        size="4" 
        variant="soft" 
        className="h-20 w-40 text-xl transition-all duration-200 hover:scale-105"
        onClick={onIncrement}
      >
        {currentUser?.login || "Player 1"}
      </Button>
      
      <Button 
        size="4" 
        variant="soft" 
        className="h-20 w-40 text-xl transition-all duration-200 hover:scale-105"
        disabled
      >
        {opponent?.login || "Player 2"}
      </Button>
    </Flex>
  );
};

export default ScoreButtons; 