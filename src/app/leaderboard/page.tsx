"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useUsers from "@/hooks/users/useUsers";
import { 
  Container, 
  Heading, 
  Flex, 
  Box, 
  Select,
  Text,
  Card,
  Avatar,
  Badge,
} from "@radix-ui/themes";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { DateRangeSelector } from "@/components/leaderboard/DateRangeSelector";
import DashboardLayout from "../dashboard-layout";

export default function LeaderboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [timeFrame, setTimeFrame] = useState("monthly");
  
  // Use the hook with sorting by elo_score in descending order
  const { users, isLoading } = useUsers({
    sortBy: "elo_score",
    sortOrder: "desc",
    pageSize: 50, // Show more users on the leaderboard
  });

  // Mock data for position changes (in a real app, this would come from an API)
  const positionChanges = users.map((user, index) => {
    // Generate random position changes between -3 and +3
    const change = Math.floor(Math.random() * 7) - 3;
    return { 
      userId: user.id, 
      change,
      // Classes to add based on the change value
      changeClass: change > 0 ? "positive" : change < 0 ? "negative" : "neutral"
    };
  });
  
  // Create leaderboard data with position changes
  const leaderboardData = users.map((user, index) => {
    const positionChange = positionChanges.find(pc => pc.userId === user.id) || { change: 0, changeClass: "neutral" };
    return {
      position: index + 1,
      user,
      positionChange: positionChange.change,
      changeClass: positionChange.changeClass
    };
  });

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
          <Container size="3" py="9">
            <Flex align="center" justify="center" style={{ minHeight: "70vh" }}>
              <Text size="3">Loading...</Text>
            </Flex>
          </Container>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
        <Container size="3" py="9">
          <Card size="2" style={{ width: '100%', height: '100%' }}>
            <Flex direction="column" gap="5">
              <Flex justify="between" align="center" py="4" px="6">
                <Heading size="5">Leaderboard</Heading>
                
                <Flex gap="3" align="center">
                  <Select.Root value={timeFrame} onValueChange={setTimeFrame}>
                    <Select.Trigger aria-label="Time frame" />
                    <Select.Content>
                      <Select.Item value="daily">Daily</Select.Item>
                      <Select.Item value="weekly">Weekly</Select.Item>
                      <Select.Item value="monthly">Monthly</Select.Item>
                      <Select.Item value="all-time">All Time</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  
                  <DateRangeSelector />
                  
                  <Flex>
                    <Avatar
                      src={users[0]?.avatar_url || ""}
                      fallback={users[0]?.login?.substring(0, 2) || ""}
                      size="1"
                      radius="full"
                    />
                    {users.length > 1 && (
                      <Badge size="1" variant="solid" style={{ marginLeft: -5 }}>
                        +{users.length - 1}
                      </Badge>
                    )}
                  </Flex>
                </Flex>
              </Flex>

              <Box>
                <LeaderboardTable data={leaderboardData} />
              </Box>
            </Flex>
          </Card>
        </Container>
      </Box>
    </DashboardLayout>
  );
}
