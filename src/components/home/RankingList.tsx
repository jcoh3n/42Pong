import React from 'react';
import { Box, Card, Flex, Heading, Button, Text, Separator, Avatar, Badge } from "@radix-ui/themes";
import { CaretRightIcon } from "@radix-ui/react-icons";
import { FaMedal, FaTrophy, FaCrown } from 'react-icons/fa';
import { FetchedUser } from "@/services/userService";

interface RankingListProps {
  topPlayers: FetchedUser[];
  currentUser: any;
  currentUserRank: number;
  onViewAll: () => void;
}

const RankingList: React.FC<RankingListProps> = ({ 
  topPlayers = [], 
  currentUser, 
  currentUserRank = 0,
  onViewAll
}) => {
  // Fonction pour obtenir l'icône de médaille en fonction du rang
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: // Premier
        return <FaCrown size={16} color="#FFD700" />;
      case 1: // Deuxième
        return <FaMedal size={16} color="#C0C0C0" />;
      case 2: // Troisième
        return <FaMedal size={16} color="#CD7F32" />;
      default:
        return null;
    }
  };

  // Fonction pour obtenir la couleur de fond en fonction du rang
  const getRankBackground = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'rgba(255, 255, 255, 0.1)';
    
    switch (rank) {
      case 0:
        return 'rgba(255, 215, 0, 0.1)';
      case 1:
        return 'rgba(192, 192, 192, 0.1)';
      case 2:
        return 'rgba(205, 127, 50, 0.1)';
      default:
        return 'transparent';
    }
  };

  // Fonction pour obtenir la bordure en fonction du rang
  const getRankBorder = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return '1px solid rgba(255, 255, 255, 0.2)';
    
    switch (rank) {
      case 0:
        return '1px solid rgba(255, 215, 0, 0.3)';
      case 1:
        return '1px solid rgba(192, 192, 192, 0.3)';
      case 2:
        return '1px solid rgba(205, 127, 50, 0.3)';
      default:
        return 'none';
    }
  };

  // Vérifier si les données sont disponibles
  const hasPlayers = Array.isArray(topPlayers) && topPlayers.length > 0;

  // Vérifier si l'utilisateur actuel est dans le top 5
  const isCurrentUserInTop5 = topPlayers.slice(0, 5).some(player => player?.id === currentUser?.id);

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
          <FaTrophy color="#FFD700" size={18} />
          <Heading size="4" style={{ color: 'white' }}>Classement</Heading>
        </Flex>
        <Button variant="ghost" style={{ color: 'white', background: 'rgba(255, 255, 255, 0.1)' }} onClick={onViewAll}>
          <Text size="2" style={{ color: 'white' }}>Voir tout</Text>
          <CaretRightIcon color="white" />
        </Button>
      </Flex>
      
      <Separator size="4" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
      
      <Flex direction="column" gap="3" p="4">
        {/* Liste des joueurs */}
        <Flex direction="column" gap="2">
          {hasPlayers ? (
            <>
              {topPlayers.slice(0, 5).map((player: FetchedUser, index: number) => {
                const isCurrentUser = player?.id === currentUser?.id;
                
                return (
                  <Flex 
                    key={player?.id || index} 
                    align="center" 
                    justify="between" 
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: getRankBackground(index, isCurrentUser),
                      border: getRankBorder(index, isCurrentUser),
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      transform: isCurrentUser ? 'scale(1.03)' : 'scale(1)',
                      boxShadow: isCurrentUser ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                      position: 'relative',
                      zIndex: isCurrentUser ? 2 : 1
                    }}
                    className={isCurrentUser ? "hover:shadow-lg hover:scale-[1.05]" : "hover:shadow-md hover:scale-[1.02]"}
                  >
                    {isCurrentUser && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '4px',
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.5)',
                          borderTopLeftRadius: '10px',
                          borderBottomLeftRadius: '10px'
                        }}
                      />
                    )}
                    <Flex align="center" gap="3">
                      <Flex 
                        align="center" 
                        justify="center" 
                        style={{ 
                          width: '28px', 
                          height: '28px',
                          borderRadius: '50%',
                          background: index < 3 ? 'transparent' : isCurrentUser ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          flexShrink: 0
                        }}
                      >
                        {getRankIcon(index) || (
                          <Text size="2" weight={isCurrentUser ? "bold" : "medium"} style={{ color: 'white' }}>{index + 1}</Text>
                        )}
                      </Flex>
                      
                      <Avatar
                        size="2"
                        src={player?.avatar_url || "https://via.placeholder.com/40"}
                        fallback={(player?.login?.substring(0, 2).toUpperCase()) || "??"}
                        radius="full"
                        style={isCurrentUser ? { 
                          border: '2px solid rgba(255, 255, 255, 0.5)',
                          boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1)'
                        } : {}}
                      />
                      
                      <Text size="2" weight={isCurrentUser ? "bold" : "regular"} style={{ color: 'white' }}>
                        {player?.login || "Joueur inconnu"}
                        {isCurrentUser && <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.6)', marginLeft: '4px' }}>(Vous)</Text>}
                      </Text>
                    </Flex>
                    
                    <Badge 
                      variant="solid" 
                      radius="full"
                      style={{ 
                        background: isCurrentUser ? 'rgba(255, 255, 255, 0.2)' : index < 3 ? 
                          (index === 0 ? 'rgba(255, 215, 0, 0.3)' : 
                           index === 1 ? 'rgba(192, 192, 192, 0.3)' : 
                           'rgba(205, 127, 50, 0.3)') : 
                          'rgba(255, 255, 255, 0.1)',
                        padding: '4px 10px'
                      }}
                    >
                      <Text size="2" weight="medium" className="font-mono" style={{ color: 'white' }}>
                        {player?.elo_score || 0}
                      </Text>
                    </Badge>
                  </Flex>
                );
              })}
              
              {/* Afficher la position de l'utilisateur s'il n'est pas dans le top 5 */}
              {currentUser && currentUserRank > 5 && !isCurrentUserInTop5 && (
                <>
                  <Flex align="center" justify="center" p="2">
                    <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>• • •</Text>
                  </Flex>
                  <Flex 
                    align="center" 
                    justify="between" 
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      transform: 'scale(1.03)',
                      position: 'relative',
                      zIndex: 2
                    }}
                    className="hover:shadow-lg hover:scale-[1.05]"
                  >
                    <div 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '4px',
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.5)',
                        borderTopLeftRadius: '10px',
                        borderBottomLeftRadius: '10px'
                      }}
                    />
                    <Flex align="center" gap="3">
                      <Flex 
                        align="center" 
                        justify="center" 
                        style={{ 
                          width: '28px', 
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.2)',
                          flexShrink: 0
                        }}
                      >
                        <Text size="2" weight="bold" style={{ color: 'white' }}>{currentUserRank}</Text>
                      </Flex>
                      
                      <Avatar
                        size="2"
                        src={currentUser?.avatar_url || "https://via.placeholder.com/40"}
                        fallback={(currentUser?.login?.substring(0, 2).toUpperCase()) || "??"}
                        radius="full"
                        style={{ 
                          border: '2px solid rgba(255, 255, 255, 0.5)',
                          boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1)'
                        }}
                      />
                      
                      <Text size="2" weight="bold" style={{ color: 'white' }}>
                        {currentUser?.login || "Vous"}
                        <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.6)', marginLeft: '4px' }}>(Vous)</Text>
                      </Text>
                    </Flex>
                    
                    <Badge 
                      variant="solid" 
                      radius="full"
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '4px 10px'
                      }}
                    >
                      <Text size="2" weight="medium" className="font-mono" style={{ color: 'white' }}>
                        {currentUser?.elo_score || 0}
                      </Text>
                    </Badge>
                  </Flex>
                </>
              )}
            </>
          ) : (
            <Flex 
              align="center" 
              justify="center" 
              direction="column"
              gap="2"
              p="6"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px dashed rgba(255, 255, 255, 0.2)'
              }}
            >
              <FaTrophy size={24} color="rgba(255, 255, 255, 0.3)" />
              <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.7)' }} align="center">
                Aucun joueur classé pour le moment
              </Text>
              <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.5)' }} align="center">
                Jouez des parties pour apparaître dans le classement
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default RankingList; 