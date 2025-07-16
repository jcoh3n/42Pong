import React from 'react';
import { Card, Flex, Text, Badge, Box, Avatar } from "@radix-ui/themes";
import { FaHistory, FaTrophy, FaRegSadTear } from 'react-icons/fa';
import { GiPingPongBat } from 'react-icons/gi';
import { Match } from "@/services/types";
import { FetchedUser } from "@/services/userService";

interface MatchListProps {
  matches: Match[];
  currentUser: any;
  topPlayers: FetchedUser[];
  limit?: number;
}

const MatchList: React.FC<MatchListProps> = ({ 
  matches = [], 
  currentUser, 
  topPlayers = [],
  limit
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

  // Obtenir le badge du type de match
  const getMatchTypeBadge = (match: Match) => {
    const matchType = match.match_type || match.type;
    
    switch (matchType) {
      case 'normal':
        return {
          label: "Quick",
          color: "#4ade80", // Vert
          background: "rgba(74, 222, 128, 0.2)",
          border: "1px solid rgba(74, 222, 128, 0.4)",
          icon: <GiPingPongBat size={12} color="#4ade80" />
        };
      case 'ranked':
        return {
          label: "Ranked",
          color: "#3b82f6", // Bleu
          background: "rgba(59, 130, 246, 0.2)",
          border: "1px solid rgba(59, 130, 246, 0.4)",
          icon: <FaTrophy size={12} color="#3b82f6" />
        };
      case 'friendly':
        return {
          label: "Friend",
          color: "#f59e0b", // Orange
          background: "rgba(245, 158, 11, 0.2)",
          border: "1px solid rgba(245, 158, 11, 0.4)",
          icon: <FaHistory size={12} color="#f59e0b" />
        };
      default:
        return {
          label: "Match",
          color: "rgba(255, 255, 255, 0.7)",
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          icon: null
        };
    }
  };
  
  // Obtenir l'adversaire complet
  const getOpponent = (match: Match) => {
    if (!match || !currentUser) return null;
    
    const opponentId = match.user_1_id === currentUser.id ? match.user_2_id : match.user_1_id;
    const opponent = topPlayers.find((player: FetchedUser) => player?.id === opponentId);
    return opponent || null;
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
    <Flex direction="column" gap="3">
      {/* Liste des matchs */}
      <Flex direction="column" gap="3">
        {hasMatches && matches.length > 0 ? (
          (limit ? matches.slice(0, limit) : matches).map((match: Match) => {
            if (!match || !match.id) return null;
            
            const matchResult = getMatchResult(match);
            const matchTypeBadge = getMatchTypeBadge(match);
            const score = getMatchScore(match);
            const opponent = getOpponent(match);
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
                  {/* Ligne du haut : Badges de résultat et type + ELO change */}
                  <Flex justify="between" align="center">
                    <Flex align="center" gap="2">
                      <Badge 
                        variant="solid" 
                        radius="full"
                        style={{ 
                          padding: '3px 10px',
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
                      {/* Badge du type de match */}
                      <Badge 
                        variant="solid" 
                        radius="full"
                        style={{ 
                          padding: '3px 10px',
                          background: matchTypeBadge.background,
                          border: matchTypeBadge.border
                        }}
                      >
                        <Flex align="center" gap="1">
                          {matchTypeBadge.icon}
                          <Text size="1" weight="medium" style={{ color: matchTypeBadge.color }}>
                            {matchTypeBadge.label}
                          </Text>
                        </Flex>
                      </Badge>
                    </Flex>
                    <Text size="2" weight="bold" style={{ color: matchResult.color }}>
                      {matchResult.eloChange}
                    </Text>
                  </Flex>
                  
                  {/* Ligne du bas : Score + Adversaire + Date */}
                  <Flex justify="between" align="center">
                    <Flex align="center" gap="2">
                      <Box style={{ 
                        background: 'rgba(255, 255, 255, 0.1)', 
                        padding: '6px 14px', 
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        <Text size="3" weight="bold" style={{ fontFamily: 'monospace', color: 'white' }}>
                          {score}
                        </Text>
                      </Box>
                      <Flex align="center" gap="2">
                        <Text size="2" weight="medium" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          vs
                        </Text>
                        <Avatar
                          size="2"
                          src={opponent?.avatar_url || undefined}
                          fallback={opponent?.login?.charAt(0)?.toUpperCase() || "?"}
                          radius="full"
                          style={{
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                          }}
                        />
                        <Text as="span" weight="bold" style={{ color: 'white' }}>
                          {opponentName}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex align="center" gap="3">
                      <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {date}
                      </Text>
                    </Flex>
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
  );
};

export default MatchList; 