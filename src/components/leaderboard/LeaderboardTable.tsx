import { Table, Box } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import useUserMatches from "@/hooks/matches/useUserMatches";
import { useMemo } from "react";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { LeaderboardRow } from "./LeaderboardRow";
import { EmptyLeaderboard } from "./EmptyLeaderboard";
import { type LeaderboardData } from "@/types/leaderboard";
import { type UserStats, calculateUserStats } from "@/utils/stats";

interface LeaderboardTableProps {
  data: LeaderboardData[];
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const { data: session } = useSession();
  
  // Create a fixed-size array of hooks based on the maximum number of users we expect
  const MAX_USERS = 100;
  const matchesResults = Array(MAX_USERS).fill(null).map((_, index) => {
    const userId = data[index]?.user.id;
    return useUserMatches(userId || '', { pageSize: 100 });
  });

  // Calculate stats for all users once
  const userStats = useMemo(() => {
    const stats = new Map<string, UserStats>();
    data.forEach(item => {
      const userMatchesResult = matchesResults.find((result, index) => data[index]?.user.id === item.user.id);
      const matches = userMatchesResult?.matches || [];
      stats.set(item.user.id, calculateUserStats(item.user.id, matches));
    });
    return stats;
  }, [data, matchesResults]);

  return (
    <Box className="max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--gray-5)] scrollbar-track-transparent">
      <Table.Root size="2" className="w-full border-separate border-spacing-0">
        <LeaderboardHeader />
        <Table.Body>
          {data.length > 0 ? (
            data.map((item) => (
              <LeaderboardRow
                key={item.user.id}
                item={item}
                stats={userStats.get(item.user.id)}
                isCurrentUser={session?.user?.email === item.user.login}
              />
            ))
          ) : (
            <EmptyLeaderboard />
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
} 