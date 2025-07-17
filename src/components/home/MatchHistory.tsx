import React from 'react';
import { Card, Flex, Heading, Button, Separator } from "@radix-ui/themes";
import { FaHistory } from 'react-icons/fa';
import { Match } from "@/services/types";
import { FetchedUser } from "@/services/userService";
import { useRouter } from 'next/navigation';
import MatchList from './MatchList';

interface MatchHistoryProps {
  matches: Match[];
  currentUser: any;
  topPlayers: FetchedUser[];
  limit?: number;
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ 
  matches = [], 
  currentUser, 
  topPlayers = [],
  limit
}) => {
  const router = useRouter();

  return (
    <Card style={{ 
      borderRadius: '16px',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
    }}>
      <Flex justify="between" align="center" p="4">
        <Flex align="center" gap="2">
          <FaHistory color="white" size={18} />
          <Heading size="4" style={{ color: 'white' }}>Dernières parties</Heading>
        </Flex>
        <Button 
          variant="ghost" 
          onClick={() => router.push('/history')}
          style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            padding: '6px 12px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: 'rgba(255, 255, 255, 0.05)'
          }}
          className="hover:bg-white/10 hover:border-white/30"
        >
          Voir tout
        </Button>
      </Flex>
      
      <Separator size="4" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
      
      <Flex direction="column" gap="3" p="4">
        <MatchList 
          matches={matches}
          currentUser={currentUser}
          topPlayers={topPlayers}
          limit={limit}
        />
      </Flex>
    </Card>
  );
};

export default MatchHistory; 