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
      <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
        <Container size="3" py="9">
          <Flex align="center" justify="center" style={{ minHeight: "70vh" }}>
            <Text size="3">Loading...</Text>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
      <Container size="3" py="9">
        <Card size="2">
          <Flex direction="column" gap="5">
            <Heading size="5" align="center" mt="4">Leaderboard</Heading>
            
            {/* Top bar with user avatars and controls */}
            <Flex justify="between" align="center" px="4" pb="2">
              <Flex align="center" gap="3">
                <Select.Root value={timeFrame} onValueChange={setTimeFrame}>
                  <Select.Trigger placeholder="Time Period" />
                  <Select.Content>
                    <Select.Group>
                      <Select.Label>Time Period</Select.Label>
                      <Select.Item value="daily">Daily</Select.Item>
                      <Select.Item value="weekly">Weekly</Select.Item>
                      <Select.Item value="monthly">Monthly</Select.Item>
                      <Select.Item value="all-time">All Time</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
                
                <DateRangeSelector />
              </Flex>
              
              <Flex align="center" gap="3">
                <Flex align="center" gap="1">
                  {users.slice(0, 3).map((user, i) => (
                    <Avatar
                      key={user.id}
                      src={user.avatar_url}
                      fallback={user.login.substring(0, 2).toUpperCase()}
                      radius="full"
                      size="2"
                      style={{
                        marginLeft: i > 0 ? -8 : 0,
                        boxShadow: '0 0 0 2px white',
                      }}
                    />
                  ))}
                  {users.length > 3 && (
                    <Badge size="1" variant="solid" radius="full">
                      +{users.length - 3}
                    </Badge>
                  )}
                </Flex>
                
                <Select.Root defaultValue="table">
                  <Select.Trigger placeholder="View" />
                  <Select.Content>
                    <Select.Group>
                      <Select.Label>View Type</Select.Label>
                      <Select.Item value="table">Table View</Select.Item>
                      <Select.Item value="cards">Card View</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </Flex>
            
            <Box>
              <LeaderboardTable data={leaderboardData} />
            </Box>
          </Flex>
        </Card>
      </Container>
    </Box>
  );
}
