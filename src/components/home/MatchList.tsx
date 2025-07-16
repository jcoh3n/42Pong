import React from 'react';
import { Box, Card, Flex, Text, Badge, Avatar, Separator } from '@radix-ui/themes';
import { FaTrophy, FaRegSadTear, FaClock, FaGamepad } from 'react-icons/fa';
import { Match } from '@/services/matchService';
import { FetchedUser } from '@/services/userService';
import { useMultipleEloChanges } from '@/hooks/useElo';

interface MatchListProps {
  matches: Match[];
  currentUser: FetchedUser | null;
  topPlayers: FetchedUser[];
  limit?: number;
}

const MatchList: React.FC<MatchListProps> = ({ 
  matches = [], 
  currentUser, 
  topPlayers = [],
  limit
}) => {
  // Get ELO changes for all matches
  const { eloChanges, getFormattedEloChange, isLoading } = useMultipleEloChanges(matches, currentUser?.id);

  // Calculer le résultat des matchs pour l'affichage
  const getMatchResult = (match: Match) => {
    if (!match || !currentUser) return { 
      result: "Inconnu", 
      color: "rgba(255, 255, 255, 0.7)", 
      eloChange: "?",
      icon: null
    };

    // Pour les matchs non-ranked, pas de changement d'ELO
    let eloChange = "Non affecté";
    if (match.match_type === 'ranked') {
      eloChange = getFormattedEloChange(match.id);
    }

    if (match.winner_id === currentUser.id) {
      return {
        result: "Victoire",
        color: "#4ade80", // Vert clair
        eloChange: eloChange,
        icon: <FaTrophy size={14} color="#4ade80" />
      };
    } else {
      return {
        result: "Défaite",
        color: "#f87171", // Rouge clair
        eloChange: eloChange,
        icon: <FaRegSadTear size={14} color="#f87171" />
      };
    }
  };

  // Récupérer les informations de l'adversaire
  const getOpponent = (match: Match) => {
    if (!currentUser) return null;
    
    const opponentId = match.user_1_id === currentUser.id ? match.user_2_id : match.user_1_id;
    return topPlayers.find(player => player.id === opponentId) || null;
  };

  // Obtenir le score de l'utilisateur actuel
  const getUserScore = (match: Match) => {
    if (!currentUser) return 0;
    return match.user_1_id === currentUser.id ? match.user_1_score : match.user_2_score;
  };

  // Obtenir le score de l'adversaire
  const getOpponentScore = (match: Match) => {
    if (!currentUser) return 0;
    return match.user_1_id === currentUser.id ? match.user_2_score : match.user_1_score;
  };

  // Formater la date du match
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir la couleur du badge selon le type de match
  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'ranked':
        return '#8B5CF6'; // Violet pour ranked
      case 'friendly':
        return '#10B981'; // Vert pour friendly
      case 'normal':
      default:
        return '#6B7280'; // Gris pour normal
    }
  };

  // Obtenir le label du type de match
  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case 'ranked':
        return 'Classé';
      case 'friendly':
        return 'Amical';
      case 'normal':
      default:
        return 'Normal';
    }
  };

  const displayedMatches = limit ? matches.slice(0, limit) : matches;

  if (displayedMatches.length === 0) {
    return (
      <Card style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Box style={{ marginBottom: '1rem' }}>
          <FaGamepad size={48} color="rgba(255, 255, 255, 0.3)" />
        </Box>
        <Text size="3" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Aucun match récent
        </Text>
        <Text size="2" style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.5rem' }}>
          Lancez un match pour commencer !
        </Text>
      </Card>
    );
  }

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {displayedMatches.map((match) => {
        const result = getMatchResult(match);
        const opponent = getOpponent(match);
        const userScore = getUserScore(match);
        const opponentScore = getOpponentScore(match);
        const isRanked = match.match_type === 'ranked';
        
        return (
          <Card 
            key={match.id} 
            style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            className="hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)]"
          >
            <Flex justify="between" align="center">
              {/* Informations du match */}
              <Flex align="center" gap="3" style={{ flex: 1 }}>
                {/* Avatar et nom de l'adversaire */}
                <Avatar
                  size="2"
                  src={opponent?.avatar_url || "https://via.placeholder.com/32"}
                  fallback={opponent?.login?.substring(0, 2).toUpperCase() || "??"}
                  radius="full"
                />
                
                <Box>
                  <Text size="2" weight="medium" style={{ color: 'white' }}>
                    vs {opponent?.login || "Inconnu"}
                  </Text>
                  <Flex align="center" gap="2" style={{ marginTop: '0.25rem' }}>
                    <FaClock size={10} color="rgba(255, 255, 255, 0.5)" />
                    <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {formatDate(match.created_at)}
                    </Text>
                  </Flex>
                </Box>
              </Flex>

              {/* Score */}
              <Flex align="center" gap="2">
                <Text size="3" weight="bold" style={{ color: 'white' }}>
                  {userScore} - {opponentScore}
                </Text>
              </Flex>

              {/* Résultat et changement ELO */}
              <Flex align="center" gap="3" style={{ minWidth: '120px', justifyContent: 'flex-end' }}>
                {/* Badge du type de match */}
                <Badge 
                  variant="solid" 
                  style={{ 
                    backgroundColor: getMatchTypeColor(match.match_type || 'normal'),
                    fontSize: '0.75rem',
                    padding: '0.125rem 0.375rem'
                  }}
                >
                  {getMatchTypeLabel(match.match_type || 'normal')}
                </Badge>

                {/* Résultat */}
                <Flex align="center" gap="1">
                  {result.icon}
                  <Text size="2" weight="medium" style={{ color: result.color }}>
                    {result.result}
                  </Text>
                </Flex>

                {/* Changement ELO */}
                <Box style={{ textAlign: 'right' }}>
                  <Text 
                    size="1" 
                    weight="medium" 
                    style={{ 
                      color: isRanked ? (
                        result.eloChange.startsWith('+') ? '#4ade80' : 
                        result.eloChange.startsWith('-') ? '#f87171' : 
                        'rgba(255, 255, 255, 0.7)'
                      ) : 'rgba(255, 255, 255, 0.5)',
                      fontFamily: 'monospace'
                    }}
                  >
                    {isRanked ? (
                      isLoading ? '...' : `${result.eloChange} ELO`
                    ) : (
                      result.eloChange
                    )}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Card>
        );
      })}
    </Box>
  );
};

export default MatchList; 