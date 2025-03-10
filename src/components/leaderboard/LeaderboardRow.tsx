import { Table, Text, Flex, Badge, Avatar } from "@radix-ui/themes";
import { FaCrown, FaMedal } from 'react-icons/fa';
import { type LeaderboardData } from "@/types/leaderboard";
import { type UserStats } from "@/utils/stats";

interface LeaderboardRowProps {
  item: LeaderboardData;
  stats?: UserStats;
  isCurrentUser: boolean;
}

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

export function LeaderboardRow({ item, stats = { totalGames: 0, wins: 0, winRate: 0 }, isCurrentUser }: LeaderboardRowProps) {
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
} 