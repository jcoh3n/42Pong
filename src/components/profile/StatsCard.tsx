import { Card, Flex, Text, Grid } from "@radix-ui/themes";
import { User } from "@/services";
import React from 'react';

interface StatsCardProps {
  user: User;
  stats: {
    totalMatches: number;
    wins: number;
    winRate: number;
  };
}

export default function StatsCard({ user, stats }: StatsCardProps) {
  return (
    <Card size="3" style={{ width: "100%" }}>
      <Flex direction="column" gap="4" p="4">
        <Text size="3" weight="bold">Match Statistics</Text>
        
        <Grid columns="3" gap="4">
          <Flex direction="column" align="center" gap="1">
            <Text size="6" weight="bold" className="font-mono" style={{ color: "var(--violet-9)" }}>
              {stats.totalMatches}
            </Text>
            <Text size="1" color="gray" align="center">
              TOTAL MATCHES
            </Text>
          </Flex>

          <Flex direction="column" align="center" gap="1">
            <Text size="6" weight="bold" className="font-mono" style={{ color: "var(--green-9)" }}>
              {stats.wins}
            </Text>
            <Text size="1" color="gray" align="center">
              WINS
            </Text>
          </Flex>

          <Flex direction="column" align="center" gap="1">
            <Text size="6" weight="bold" className="font-mono" style={{ color: "var(--blue-9)" }}>
              {stats.winRate}%
            </Text>
            <Text size="1" color="gray" align="center">
              WIN RATE
            </Text>
          </Flex>
        </Grid>

        <Text size="2" color="gray" align="center" className="mt-2">
          Current Season • {new Date().getFullYear()}
        </Text>
      </Flex>
    </Card>
  );
} 