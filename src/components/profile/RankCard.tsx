import { Card, Flex, Text } from "@radix-ui/themes";
import { User } from "@/services";
import React from 'react';

interface RankCardProps {
  user: User;
}

export default function RankCard({ user }: RankCardProps) {
  console.log("RankCard user data:", user); // Pour déboguer

  if (!user) {
    return (
      <Card size="3" style={{ width: "100%" }}>
        <Flex direction="column" gap="4" p="4" align="center">
          <Text size="3" color="gray">Loading ELO...</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card size="3" style={{ width: "100%" }}>
      <Flex direction="column" gap="4" p="4">
        <Text size="3" weight="bold">ELO Rating</Text>

        <Flex direction="column" align="center" gap="1">
          <Text 
            size="8" 
            weight="bold" 
            className="font-mono" 
            style={{ 
              color: "var(--violet-9)",
              fontSize: "3.5rem"
            }}
          >
            {user?.elo_score || 1000}
          </Text>
          <Text size="2" color="gray">
            {user?.elo_score ? `Current Rating` : 'Default Rating'}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
} 