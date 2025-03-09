import { Card, Flex, Text, Grid, Box } from "@radix-ui/themes";
import { BarChartIcon } from "@radix-ui/react-icons";
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
    <Card size="3" style={{ 
      width: "100%",
      background: "linear-gradient(135deg, var(--blue-2), var(--blue-1))",
      border: "1px solid var(--blue-6)",
    }}>
      <Flex direction="column" gap="4" p="6">
        <Flex align="center" gap="2">
          <BarChartIcon width="20" height="20" color="var(--blue-9)" />
          <Text size="3" weight="bold" style={{ color: "var(--blue-9)" }}>Match Statistics</Text>
        </Flex>
        
        <Grid columns="3" gap="4" style={{ padding: "1rem 0" }}>
          <StatBox
            value={stats.totalMatches}
            label="TOTAL MATCHES"
            color="blue"
          />
          <StatBox
            value={stats.wins}
            label="WINS"
            color="green"
          />
          <StatBox
            value={`${stats.winRate}%`}
            label="WIN RATE"
            color="violet"
          />
        </Grid>

        <Text size="2" style={{ color: "var(--blue-11)", textAlign: "center" }}>
          Current Season • {new Date().getFullYear()}
        </Text>
      </Flex>
    </Card>
  );
}

interface StatBoxProps {
  value: number | string;
  label: string;
  color: 'blue' | 'green' | 'violet';
}

function StatBox({ value, label, color }: StatBoxProps) {
  return (
    <Flex direction="column" align="center" gap="2">
      <Box style={{
        background: `linear-gradient(135deg, var(--${color}-9), var(--${color}-10))`,
        padding: "1rem 1.5rem",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}>
        <Text 
          size="6" 
          weight="bold" 
          className="font-mono" 
          style={{ 
            color: "white",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
          }}
        >
          {value}
        </Text>
      </Box>
      <Text size="1" style={{ color: `var(--${color}-11)` }}>
        {label}
      </Text>
    </Flex>
  );
} 