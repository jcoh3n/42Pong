import { Table, Text, Flex, Badge, Avatar, Box } from "@radix-ui/themes";
import { type User } from "@/services/userService";
import { PositionChange } from "./PositionChange";
import { FaCrown, FaMedal } from 'react-icons/fa';
import { GiPingPongBat } from 'react-icons/gi';
import { useSession } from "next-auth/react";
import useUserMatches from "@/hooks/matches/useUserMatches";
import { useMemo } from "react";

interface LeaderboardData {
  position: number;
  user: User;
  positionChange: number;
  changeClass: string;
}

interface LeaderboardTableProps {
  data: LeaderboardData[];
}

interface UserStats {
  totalGames: number;
  wins: number;
  winRate: number;
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const { data: session } = useSession();
  
  // Create a fixed-size array of hooks based on the maximum number of users we expect
  const MAX_USERS = 100; // Adjust this based on your needs
  const matchesResults = Array(MAX_USERS).fill(null).map((_, index) => {
    const userId = data[index]?.user.id;
    return useUserMatches(userId || '', { pageSize: 100 });
  });

  const calculateStats = (userId: string): UserStats => {
    // Find the matches for this user
    const userMatchesResult = matchesResults.find((result, index) => data[index]?.user.id === userId);
    const matches = userMatchesResult?.matches || [];
    
    const totalGames = matches.length;
    const wins = matches.filter(match => 
      (match.user_1_id === userId && match.user_1_score > match.user_2_score) ||
      (match.user_2_id === userId && match.user_2_score > match.user_1_score)
    ).length;
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

    return {
      totalGames,
      wins,
      winRate
    };
  };

  // Calculate stats for all users once
  const userStats = useMemo(() => {
    const stats = new Map<string, UserStats>();
    data.forEach(item => {
      stats.set(item.user.id, calculateStats(item.user.id));
    });
    return stats;
  }, [data, matchesResults]);
  
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <FaCrown size={20} color="#FFD700" />;
      case 2:
        return <FaMedal size={18} color="#C0C0C0" />;
      case 3:
        return <FaMedal size={18} color="#CD7F32" />;
      default:
        return null;
    }
  };

  const getRowStyle = (position: number, isCurrentUser: boolean) => {
    let style: any = {
      transition: 'all 0.2s ease',
      position: 'relative',
      cursor: 'pointer',
    };

    if (position <= 3) {
      style.background = `rgba(${position === 1 ? '255, 215, 0' : position === 2 ? '192, 192, 192' : '205, 127, 50'}, 0.1)`;
      style.borderLeft = `4px solid rgba(${position === 1 ? '255, 215, 0' : position === 2 ? '192, 192, 192' : '205, 127, 50'}, 0.5)`;
    }

    if (isCurrentUser) {
      style.background = 'rgba(0, 122, 255, 0.1)';
      style.borderLeft = '4px solid var(--accent-9)';
      style.fontWeight = 500;
    }

    return style;
  };

  return (
    <Box className="max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--gray-5)] scrollbar-track-transparent">
      <Table.Root 
        size="2" 
        className="w-full border-separate border-spacing-0"
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell 
              className="w-[80px] sm:w-[100px] font-semibold uppercase tracking-wider py-4 px-3 sm:px-4 bg-[var(--color-background)] sticky top-0 z-10 text-sm"
            >
              <Text size="1" className="hidden sm:block">Position</Text>
              <Text size="1" className="sm:hidden">#</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              className="font-semibold uppercase tracking-wider py-4 px-3 sm:px-4 bg-[var(--color-background)] sticky top-0 z-10 text-sm"
            >
              <Text size="1">Joueur</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell 
              className="w-[80px] sm:w-[120px] font-semibold uppercase tracking-wider py-4 px-3 sm:px-4 bg-[var(--color-background)] sticky top-0 z-10 text-sm hidden sm:table-cell"
            >
              <Text size="1">Parties</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell 
              className="w-[80px] sm:w-[100px] font-semibold uppercase tracking-wider py-4 px-3 sm:px-4 bg-[var(--color-background)] sticky top-0 z-10 text-sm hidden sm:table-cell"
            >
              <Text size="1">Win Rate</Text>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell 
              align="right" 
              className="w-[80px] sm:w-[120px] font-semibold uppercase tracking-wider py-4 px-3 sm:px-4 bg-[var(--color-background)] sticky top-0 z-10 text-sm"
            >
              <Text size="1">ELO</Text>
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((item, index) => {
            const isCurrentUser = session?.user?.email === item.user.login;
            const stats = userStats.get(item.user.id) || { totalGames: 0, wins: 0, winRate: 0 };
            
            return (
              <Table.Row 
                key={item.user.id} 
                style={getRowStyle(item.position, isCurrentUser)}
                className="hover:bg-[var(--gray-3)] transition-colors"
              >
                <Table.Cell className="py-3 px-3 sm:px-4">
                  <Flex align="center" justify="start" gap="2">
                    {getRankIcon(item.position)}
                    <Text 
                      size="2" 
                      weight={item.position <= 3 ? "bold" : "regular"}
                      className={item.position <= 3 ? "text-[var(--accent-9)]" : ""}
                    >
                      {item.position}
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell className="py-3 px-3 sm:px-4">
                  <Flex align="center" gap="2 sm:gap-3">
                    <Avatar
                      size="2"
                      src={item.user.avatar_url || "https://via.placeholder.com/40"}
                      fallback={item.user.login.substring(0, 2).toUpperCase()}
                      radius="full"
                      className={isCurrentUser ? "border-2 border-[var(--accent-9)]" : ""}
                    />
                    <Flex direction="column" gap="1">
                      <Text size="2" weight={isCurrentUser ? "bold" : "regular"}>
                        {item.user.login}
                        {isCurrentUser && (
                          <Badge variant="soft" color="blue" className="ml-2 hidden sm:inline-flex">
                            Vous
                          </Badge>
                        )}
                      </Text>
                      <Text size="1" color="gray" className="sm:hidden">
                        {stats.totalGames} parties • {stats.winRate}%
                      </Text>
                    </Flex>
                  </Flex>
                </Table.Cell>
                <Table.Cell className="py-3 px-3 sm:px-4 hidden sm:table-cell">
                  <Text size="2">
                    {stats.totalGames}
                  </Text>
                </Table.Cell>
                <Table.Cell className="py-3 px-3 sm:px-4 hidden sm:table-cell">
                  <Badge 
                    variant="soft" 
                    color={stats.winRate >= 50 ? "green" : "red"}
                    radius="full"
                  >
                    <Text size="2" weight="medium">
                      {stats.winRate}%
                    </Text>
                  </Badge>
                </Table.Cell>
                <Table.Cell align="right" className="py-3 px-3 sm:px-4">
                  <Badge 
                    variant="soft" 
                    color={item.position <= 3 ? "gold" : "gray"} 
                    radius="full"
                    className={`min-w-[60px] inline-flex justify-center ${
                      item.position <= 3 ? `bg-opacity-20 bg-[${
                        item.position === 1 ? '#FFD700' : 
                        item.position === 2 ? '#C0C0C0' : 
                        '#CD7F32'
                      }]` : ''
                    }`}
                  >
                    <Text size="2" weight="medium" className="font-mono">
                      {item.user.elo_score}
                    </Text>
                  </Badge>
                </Table.Cell>
              </Table.Row>
            );
          })}
          {data.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5}>
                <Flex 
                  direction="column" 
                  align="center" 
                  justify="center" 
                  gap="3" 
                  className="py-12"
                >
                  <GiPingPongBat size={32} className="text-[var(--gray-8)]" />
                  <Text align="center" size="3" weight="medium" color="gray">
                    Aucun joueur trouvé
                  </Text>
                  <Text align="center" size="2" color="gray">
                    Le classement est vide pour le moment
                  </Text>
                </Flex>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
} 