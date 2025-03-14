import React from 'react';
import { Card, Flex, Heading, Button, Text, Separator, Badge, Box } from "@radix-ui/themes";
import { CaretRightIcon } from "@radix-ui/react-icons";
import { FaHistory, FaTrophy, FaRegSadTear } from 'react-icons/fa';
import { Match } from "@/services/types";
import { FetchedUser } from "@/services/userService";

interface MatchHistoryProps {
  matches: Match[];
  currentUser: any;
  topPlayers: FetchedUser[];
  onViewHistory: () => void;
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ 
  matches = [], 
  currentUser, 
  topPlayers = [],
  onViewHistory 
}) => {
  // Calculer le résultat des matchs pour l'affichage
  const getMatchResult = (match: Match) => {
    if (!match || !currentUser) return { 
      result: "Inconnu", 
      color: "rgba(255, 255, 255, 0.7)", 
      eloChange: "?",
      icon: null
    };

    if (match.winner_id === currentUser.id) {
      return {
        result: "Victoire",
        color: "#4ade80", // Vert clair
        eloChange: "+25", // Valeur fictive, à remplacer par la vraie logique
        icon: <FaTrophy size={14} color="#4ade80" />
      };
    } else {
      return {
        result: "Défaite",
        color: "#f87171", // Rouge clair
        eloChange: "-18", // Valeur fictive, à remplacer par la vraie logique
        icon: <FaRegSadTear size={14} color="#f87171" />
      };
    }
  };
  
  // Obtenir le nom de l'adversaire
  const getOpponentName = (match: Match) => {
    if (!match || !currentUser) return "Inconnu";
    
    const opponentId = match.user_1_id === currentUser.id ? match.user_2_id : match.user_1_id;
    const opponent = topPlayers.find((player: FetchedUser) => player?.id === opponentId);
    return opponent?.login || "Inconnu";
  };
  
  // Obtenir le score du match
  const getMatchScore = (match: Match) => {
    if (!match || !currentUser) return "? - ?";
    
    if (match.user_1_id === currentUser.id) {
      return `${match.user_1_score || 0} - ${match.user_2_score || 0}`;
    } else {
      return `${match.user_2_score || 0} - ${match.user_1_score || 0}`;
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "";
    }
  };

  // Vérifier si les données sont disponibles
  const hasMatches = Array.isArray(matches) && matches.length > 0 && currentUser;

  return (
    <Card style={{ 
      borderRadius: '16px',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
      background: 'rgba(30, 41, 59, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
    }}>
      <Flex justify="between" align="center" p="4">
        <Flex align="center" gap="2">
          <FaHistory color="white" size={18} />
          <Heading size="4" style={{ color: 'white' }}>Dernières parties</Heading>
        </Flex>
        <Button variant="ghost" style={{ color: 'white', background: 'rgba(255, 255, 255, 0.1)' }} onClick={onViewHistory}>
          <Text size="2" style={{ color: 'white' }}>Historique</Text>
          <CaretRightIcon color="white" />
        </Button>
      </Flex>
      
      <Separator size="4" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
      
      <Flex direction="column" gap="3" p="4">
        {/* Liste des dernières parties */}
        <Flex direction="column" gap="3">
          {hasMatches ? (
            matches.map((match: Match) => {
              if (!match || !match.id) return null;
              
              const matchResult = getMatchResult(match);
              const score = getMatchScore(match);
              const opponentName = getOpponentName(match);
              const date = formatDate(match.finished_at || match.created_at);
              
              return (
                <Card key={match.id} style={{ 
                  borderRadius: '12px',
                  border: `1px solid ${matchResult.color}40`,
                  background: `${matchResult.color}10`,
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                className="hover:shadow-md hover:scale-[1.02]"
                >
                  <Flex direction="column" gap="3" p="3">
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="2">
                        <Badge 
                          variant="solid" 
                          radius="full"
                          style={{ 
                            padding: '2px 10px',
                            background: matchResult.result === "Victoire" ? 
                              'rgba(74, 222, 128, 0.2)' : 
                              'rgba(248, 113, 113, 0.2)',
                            border: `1px solid ${matchResult.color}40`
                          }}
                        >
                          <Flex align="center" gap="1">
                            {matchResult.icon}
                            <Text size="1" weight="medium" style={{ color: matchResult.color }}>
                              {matchResult.result}
                            </Text>
                          </Flex>
                        </Badge>
                        <Text size="2" weight="medium" style={{ color: 'white' }}>vs {opponentName}</Text>
                      </Flex>
                      <Text size="2" weight="bold" style={{ color: matchResult.color }}>
                        {matchResult.eloChange}
                      </Text>
                    </Flex>
                    
                    <Flex justify="between" align="center">
                      <Flex align="center" gap="2">
                        <Box style={{ 
                          background: 'rgba(255, 255, 255, 0.1)', 
                          padding: '4px 12px', 
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          <Text size="3" weight="bold" style={{ fontFamily: 'monospace', color: 'white' }}>
                            {score}
                          </Text>
                        </Box>
                      </Flex>
                      <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {date}
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              );
            })
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
              <FaHistory size={24} color="rgba(255, 255, 255, 0.3)" />
              <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.7)' }} align="center">
                Aucune partie récente
              </Text>
              <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.5)' }} align="center">
                Jouez votre première partie pour voir votre historique ici
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default MatchHistory; 