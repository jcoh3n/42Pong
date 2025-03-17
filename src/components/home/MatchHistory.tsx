import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  maxDisplayCount?: number;
  isScrollable?: boolean;
  loadMoreMatches?: () => Promise<boolean>;
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ 
  matches = [], 
  currentUser, 
  topPlayers = [],
  onViewHistory,
  maxDisplayCount = 5,
  isScrollable = false,
  loadMoreMatches
}) => {
  // State to track displayed matches and loading state
  const [displayedMatches, setDisplayedMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Refs for infinite scroll
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  
  // Initialize displayed matches based on maxDisplayCount
  useEffect(() => {
    if (matches && matches.length > 0) {
      // If not scrollable, just limit the matches to maxDisplayCount
      if (!isScrollable) {
        setDisplayedMatches(matches.slice(0, maxDisplayCount));
      } else {
        // For scrollable view, initialize with the first set of matches
        setDisplayedMatches(matches.slice(0, maxDisplayCount));
        setHasMore(matches.length > maxDisplayCount);
      }
    } else {
      setDisplayedMatches([]);
    }
  }, [matches, maxDisplayCount, isScrollable]);
  
  // Set up the intersection observer for infinite scroll
  const loadMoreItemsCallback = useCallback(async () => {
    if (isLoading || !hasMore || !isScrollable) return;

    setIsLoading(true);
    
    // If a custom loadMoreMatches function is provided, use it
    if (loadMoreMatches) {
      const hasMoreItems = await loadMoreMatches();
      setHasMore(hasMoreItems);
    } else {
      // Otherwise, just load more from the existing matches array
      const nextItems = matches.slice(displayedMatches.length, displayedMatches.length + maxDisplayCount);
      
      if (nextItems.length > 0) {
        setDisplayedMatches(prev => [...prev, ...nextItems]);
        setHasMore(displayedMatches.length + nextItems.length < matches.length);
      } else {
        setHasMore(false);
      }
    }
    
    setIsLoading(false);
  }, [isLoading, hasMore, displayedMatches, matches, maxDisplayCount, loadMoreMatches, isScrollable]);
  
  // Set up intersection observer
  useEffect(() => {
    if (!isScrollable) return;
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreItemsCallback();
      }
    }, options);
    
    if (loadMoreTriggerRef.current) {
      observer.observe(loadMoreTriggerRef.current);
    }
    
    observerRef.current = observer;
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreItemsCallback, isScrollable]);

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
  const hasMatches = Array.isArray(displayedMatches) && displayedMatches.length > 0 && currentUser;

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
        <Button variant="ghost" style={{ color: 'white', background: 'rgba(255, 255, 255, 0.1)' }} onClick={onViewHistory}>
          <Text size="2" style={{ color: 'white' }}>Historique</Text>
          <CaretRightIcon color="white" />
        </Button>
      </Flex>
      
      <Separator size="4" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
      
      <Flex 
        direction="column" 
        gap="3" 
        p="4"
        style={{
          maxHeight: isScrollable ? '400px' : 'auto',
          overflowY: isScrollable ? 'auto' : 'visible',
          scrollBehavior: 'smooth',
          /* Styles pour la scrollbar */
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(30, 41, 59, 0.8)',
        }}
        className={isScrollable ? 'custom-scrollbar' : ''}
      >
        {/* Liste des dernières parties */}
        <Flex direction="column" gap="3">
          {hasMatches ? (
            displayedMatches.map((match: Match) => {
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
          
          {/* Loading indicator and load more trigger */}
          {isScrollable && hasMore && (
            <div ref={loadMoreTriggerRef}>
              <Flex 
                align="center" 
                justify="center" 
                p="3"
                style={{
                  opacity: isLoading ? 1 : 0,
                  transition: 'opacity 0.3s',
                  height: '40px'
                }}
              >
                <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {isLoading ? "Chargement..." : ""}
                </Text>
              </Flex>
            </div>
          )}
        </Flex>
      </Flex>
      
      {/* Optional: Add button to manually load more when near the end */}
      {isScrollable && hasMore && displayedMatches.length >= maxDisplayCount && !isLoading && (
        <Flex justify="center" p="3">
          <Button 
            variant="ghost" 
            style={{ 
              color: 'white', 
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginTop: '8px'
            }} 
            onClick={() => loadMoreItemsCallback()}
          >
            Voir plus de parties
          </Button>
        </Flex>
      )}
    </Card>
  );
};

export default MatchHistory; 