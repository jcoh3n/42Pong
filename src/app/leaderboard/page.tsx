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
  Text,
  Card,
  Avatar,
  Badge,
} from "@radix-ui/themes";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { DateRangeSelector } from "@/components/leaderboard/DateRangeSelector";
import DashboardLayout from "../dashboard-layout";
import Loading from "@/components/Loading";

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
    return (<Loading />);
  }

  return (
      <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
        <Container size="3" py="9">
          <Card size="2" style={{ width: '100%', height: '100%' }}>
            <Flex direction="column" gap="5">
              <Flex justify="between" align="center" py="4" px="6">
                <Heading size="5">Leaderboard</Heading>
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
