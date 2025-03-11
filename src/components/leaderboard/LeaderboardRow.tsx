import { Table, Text, Flex, Badge, Avatar } from "@radix-ui/themes";
import { GiPingPongBat } from 'react-icons/gi';
import { type LeaderboardData, type LeaderboardStats } from "@/types/leaderboard";

const RANK_COLORS = {
  1: {
    from: '#22D3EE',
    to: '#0EA5E9',
    ring: '#0EA5E9',
    text: '#0F172A'
  },
  2: {
    from: '#CBD5E1',
    to: '#94A3B8',
    ring: '#94A3B8',
    text: '#0F172A'
  },
  3: {
    from: '#FCD34D',
    to: '#F59E0B',
    ring: '#F59E0B',
    text: '#0F172A'
  }
};

interface LeaderboardRowProps {
  item: LeaderboardData;
  stats?: LeaderboardStats;
  isCurrentUser: boolean;
}

const getRankIcon = (position: number) => {
  const baseClasses = "relative w-6 h-6 flex items-center justify-center rounded-full";
  const rankColor = RANK_COLORS[position as keyof typeof RANK_COLORS];
  
  if (rankColor) {
    return (
      <div 
        className={`${baseClasses}`}
        style={{ 
          background: `linear-gradient(135deg, ${rankColor.from}, ${rankColor.to})`,
          boxShadow: `0 0 12px ${rankColor.from}33`
        }}
      >
        <GiPingPongBat 
          size={16} 
          style={{ color: rankColor.text }} 
          className="transform hover:rotate-12 transition-transform" 
        />
      </div>
    );
  }

  return (
    <div 
      className={`${baseClasses} text-xs font-medium`}
      style={{ 
        backgroundColor: '#1E293B',
        color: '#94A3B8'
      }}
    >
      {position}
    </div>
  );
};

const getRowStyle = (position: number, isCurrentUser: boolean) => {
  const rankColor = RANK_COLORS[position as keyof typeof RANK_COLORS];
  let style: any = {
    transition: 'all 0.2s ease',
    position: 'relative',
    cursor: 'pointer',
  };

  if (rankColor) {
    style.background = `linear-gradient(90deg, ${rankColor.from}0A, ${rankColor.to}0A)`;
  }

  if (isCurrentUser) {
    style.background = 'rgba(14, 165, 233, 0.07)';
  }

  return style;
};

export function LeaderboardRow({ item, stats = { totalGames: 0, wins: 0, winRate: 0 }, isCurrentUser }: LeaderboardRowProps) {
  const rankColor = RANK_COLORS[item.position as keyof typeof RANK_COLORS];
  
  return (
    <Table.Row 
      key={item.user.id} 
      style={getRowStyle(item.position, isCurrentUser)}
      className="hover:bg-[#1E293B] transition-all duration-200 group"
    >
      <Table.Cell className="py-3 px-3 sm:px-4">
        <Flex align="center" justify="start" gap="3">
          {getRankIcon(item.position)}
        </Flex>
      </Table.Cell>
      <Table.Cell className="py-3 px-3 sm:px-4">
        <Flex align="center" gap="3">
          <Avatar
            size="2"
            src={item.user.avatar_url || "https://via.placeholder.com/40"}
            fallback={item.user.login.substring(0, 2).toUpperCase()}
            radius="full"
            style={{
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: isCurrentUser ? '#0EA5E9' : rankColor ? rankColor.ring : '#1E293B',
              boxShadow: '0 0 0 2px #0F172A'
            }}
            className="transition-shadow duration-200"
          />
          <Flex direction="column" gap="1">
            <Text size="2" weight={isCurrentUser ? "bold" : "regular"} style={{ color: '#FFFFFF' }}>
              {item.user.login}
              {isCurrentUser && (
                <Badge 
                  variant="solid" 
                  style={{ 
                    backgroundColor: 'rgba(14, 165, 233, 0.1)', 
                    color: '#0EA5E9',
                    marginLeft: '0.5rem'
                  }} 
                  className="hidden sm:inline-flex"
                >
                  Vous
                </Badge>
              )}
            </Text>
            <Text size="1" style={{ color: '#94A3B8' }} className="sm:hidden">
              {stats.totalGames} parties • {stats.winRate}%
            </Text>
          </Flex>
        </Flex>
      </Table.Cell>
      <Table.Cell className="py-3 px-3 sm:px-4 hidden sm:table-cell">
        <Badge variant="surface" style={{ backgroundColor: '#1E293B', color: '#94A3B8' }}>
          {stats.totalGames}
        </Badge>
      </Table.Cell>
      <Table.Cell className="py-3 px-3 sm:px-4 hidden sm:table-cell">
        <Badge 
          variant="surface" 
          style={{ 
            backgroundColor: stats.winRate >= 50 ? 'rgba(5, 150, 105, 0.15)' : 'rgba(220, 38, 38, 0.15)',
            color: stats.winRate >= 50 ? '#ECFDF5' : '#FEF2F2'
          }}
        >
          {stats.winRate}%
        </Badge>
      </Table.Cell>
      <Table.Cell align="right" className="py-3 px-3 sm:px-4">
        <div 
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: '1rem',
            background: rankColor 
              ? `linear-gradient(to right, ${rankColor.from}, ${rankColor.to})`
              : '#1E293B',
            color: rankColor ? rankColor.text : '#E2E8F0',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s'
          }}
          className="group-hover:scale-105"
        >
          {item.user.elo_score}
        </div>
      </Table.Cell>
    </Table.Row>
  );
}

// Ajout des styles d'animation
const styles = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

// Ajout des styles au document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 