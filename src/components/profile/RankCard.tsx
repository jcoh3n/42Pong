import { Card, Flex, Text, Box } from "@radix-ui/themes";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { User } from "@/services";
import React from 'react';

interface RankCardProps {
  user: User;
}

export default function RankCard({ user }: RankCardProps) {
  console.log("RankCard user data:", user); // Pour déboguer

  if (!user) {
    return (
      <Card size="3" style={{ width: "100%", background: "var(--gray-1)" }}>
        <Flex direction="column" gap="4" p="4" align="center">
          <Text size="3" color="gray">Loading ELO...</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card size="3" style={{ 
      width: "100%", 
      background: "linear-gradient(135deg, var(--violet-2), var(--violet-1))",
      border: "1px solid var(--violet-6)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    }}>
      <Flex direction="column" gap="4" p="6">
        <Flex align="center" gap="2">
          <StarFilledIcon width="20" height="20" color="var(--violet-9)" />
          <Text size="3" weight="bold" style={{ color: "var(--violet-9)", textShadow: "0 1px 2px rgba(0, 0, 0, 0.05)" }}>ELO Rating</Text>
        </Flex>

        <Flex direction="column" align="center" gap="2" style={{ padding: "1rem 0" }}>
          <Box style={{
            background: "linear-gradient(135deg, var(--violet-9), var(--violet-10))",
            padding: "1.5rem 2.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          }}>
            <Text 
              size="8" 
              weight="bold" 
              className="font-mono" 
              style={{ 
                color: "white",
                fontSize: "3.5rem",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
              }}
            >
              {user?.elo_score || 1000}
            </Text>
          </Box>
          <Text size="2" style={{ color: "var(--violet-11)", marginTop: "0.5rem", textShadow: "0 1px 1px rgba(255, 255, 255, 0.5)" }}>
            {user?.elo_score ? 'Current Rating' : 'Default Rating'}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
} 