"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from "next/navigation";
import { 
  Box, 
  Container, 
  Flex, 
  Text,
  Card,
  Badge,
  Button,
  TextField
} from "@radix-ui/themes";
import { 
  MagnifyingGlassIcon,
  Cross2Icon
} from "@radix-ui/react-icons";
import { FaTrophy, FaRegSadTear, FaHistory, FaFilter } from 'react-icons/fa';
import { GiPingPongBat } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import useCurrentUser from "@/hooks/useCurrentUser";
import useUsers from "@/hooks/users/useUsers";
import useUserMatches from "@/hooks/matches/useUserMatches";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA_QUERIES } from "@/constants/breakpoints";
import { Match } from "@/services";
import { MatchList } from "@/components/home";
import Loading from '@/components/Loading';

type FilterType = 'all' | 'normal' | 'ranked' | 'friendly';
type ResultType = 'all' | 'wins' | 'losses';

interface HistoryFilters {
  matchType: FilterType;
  result: ResultType;
  search: string;
}

// Composant de filtres simplifié
interface FilterBarProps {
  filters: HistoryFilters;
  setFilters: React.Dispatch<React.SetStateAction<HistoryFilters>>;
  isMobile: boolean;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  setFilters, 
  isMobile, 
  hasActiveFilters, 
  clearFilters 
}) => {
  const getFilterCount = () => {
    let count = 0;
    if (filters.matchType !== 'all') count++;
    if (filters.result !== 'all') count++;
    if (filters.search !== '') count++;
    return count;
  };

  const filterCount = getFilterCount();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="overflow-hidden"
        style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Flex direction="column" gap={isMobile ? "3" : "4"} p={isMobile ? "3" : "4"}>
          {/* Recherche en haut */}
          <Flex align="center" gap="3">
            <Box style={{ flex: 1 }}>
              <TextField.Root
                placeholder="Rechercher un adversaire..."
                value={filters.search}
                size={isMobile ? "2" : "3"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFilters(prev => ({ ...prev, search: e.target.value }))
                }
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" className="text-gray-400" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
            
            {/* Compteur de filtres + bouton effacer discret */}
            <Flex align="center" gap="2">
              {filterCount > 0 && (
                <Badge 
                  size="2"
                  style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}
                >
                  {filterCount}
                </Badge>
              )}
              
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="1" 
                      onClick={clearFilters}
                      style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        padding: '6px'
                      }}
                      className="hover:bg-white/5"
                    >
                      <Cross2Icon width="14" height="14" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Flex>
          </Flex>

          {/* Filtres simplifiés */}
          <Flex direction={isMobile ? "column" : "row"} gap="3">
            {/* Type de match */}
            <Flex direction="column" gap="2" style={{ flex: 1 }}>
              <Text className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </Text>
              <Flex gap="2" wrap="wrap">
                {[
                  { value: 'all', label: 'Tous', icon: <FaFilter size={10} />, color: 'gray' },
                  { value: 'normal', label: 'Quick', icon: <GiPingPongBat size={10} />, color: 'green' },
                  { value: 'ranked', label: 'Ranked', icon: <FaTrophy size={10} />, color: 'blue' },
                  { value: 'friendly', label: 'Amical', icon: <FaHistory size={10} />, color: 'orange' }
                ].map((type, index) => (
                  <Button
                    key={type.value}
                    variant={filters.matchType === type.value ? "solid" : "ghost"}
                    size="1"
                    onClick={() => setFilters(prev => ({ ...prev, matchType: type.value as FilterType }))}
                    className={`transition-all duration-200 text-xs ${
                      filters.matchType === type.value 
                        ? `bg-${type.color}-500 text-white` 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    style={{
                      minWidth: isMobile ? '70px' : '80px',
                      backgroundColor: filters.matchType === type.value ? 
                        (type.color === 'gray' ? '#6b7280' : 
                         type.color === 'green' ? '#10b981' : 
                         type.color === 'blue' ? '#3b82f6' : '#f59e0b') : 
                        'transparent'
                    }}
                  >
                    <Flex align="center" gap="1">
                      {type.icon}
                      <Text size="1">{type.label}</Text>
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </Flex>

            {/* Résultat */}
            <Flex direction="column" gap="2" style={{ flex: 1 }}>
              <Text className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Résultat
              </Text>
              <Flex gap="2" wrap="wrap">
                {[
                  { value: 'all', label: 'Tous', icon: <FaFilter size={10} />, color: 'gray' },
                  { value: 'wins', label: 'Victoires', icon: <FaTrophy size={10} />, color: 'green' },
                  { value: 'losses', label: 'Défaites', icon: <FaRegSadTear size={10} />, color: 'red' }
                ].map((result, index) => (
                  <Button
                    key={result.value}
                    variant={filters.result === result.value ? "solid" : "ghost"}
                    size="1"
                    onClick={() => setFilters(prev => ({ ...prev, result: result.value as ResultType }))}
                    className={`transition-all duration-200 text-xs ${
                      filters.result === result.value 
                        ? `bg-${result.color}-500 text-white` 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    style={{
                      minWidth: isMobile ? '70px' : '80px',
                      backgroundColor: filters.result === result.value ? 
                        (result.color === 'gray' ? '#6b7280' : 
                         result.color === 'green' ? '#10b981' : '#ef4444') : 
                        'transparent'
                    }}
                  >
                    <Flex align="center" gap="1">
                      {result.icon}
                      <Text size="1">{result.label}</Text>
                    </Flex>
                  </Button>
                ))}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </motion.div>
  );
};

export default function HistoryPage() {
  const router = useRouter();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { users: allUsers = [], isLoading: isLoadingUsers } = useUsers({ 
    page: 1, 
    pageSize: 1000
  });
  
  const { matches: allMatches = [], isLoading: isLoadingMatches } = useUserMatches(
    currentUser?.id,
    { pageSize: 1000 }
  );

  const [filters, setFilters] = useState<HistoryFilters>({
    matchType: 'all',
    result: 'all',
    search: ''
  });

  // Détection mobile
  const isMobile = !useMediaQuery(MEDIA_QUERIES.md);

  // Fonctions de filtrage réutilisées
  const getMatchResult = (match: Match) => {
    if (!match || !currentUser) return null;
    
    const isWinner = match.winner_id === currentUser.id;
    const isDraw = match.winner_id === null && match.status === 'completed';
    
    if (isDraw) return { type: 'draw' };
    if (isWinner) return { type: 'win' };
    return { type: 'loss' };
  };

  const getOpponentName = (match: Match) => {
    if (!match || !currentUser) return "Inconnu";
    
    const opponentId = match.user_1_id === currentUser.id ? match.user_2_id : match.user_1_id;
    const opponent = allUsers.find(user => user?.id === opponentId);
    return opponent?.login || "Inconnu";
  };

  const filteredMatches = useMemo(() => {
    return allMatches.filter(match => {
      if (!match) return false;
      
      if (filters.matchType !== 'all') {
        const matchType = match.match_type || match.type;
        if (matchType !== filters.matchType) return false;
      }
      
      if (filters.result !== 'all') {
        const result = getMatchResult(match);
        if (!result) return false;
        
        if (filters.result === 'wins' && result.type !== 'win') return false;
        if (filters.result === 'losses' && result.type !== 'loss') return false;
      }
      
      if (filters.search) {
        const opponentName = getOpponentName(match);
        if (!opponentName.toLowerCase().includes(filters.search.toLowerCase())) return false;
      }
      
      return true;
    });
  }, [allMatches, filters, currentUser, allUsers]);

  const clearFilters = () => {
    setFilters({
      matchType: 'all',
      result: 'all',
      search: ''
    });
  };

  const hasActiveFilters = filters.matchType !== 'all' || 
                          filters.result !== 'all' || 
                          filters.search !== '';

  if (isLoadingUser || isLoadingMatches || isLoadingUsers) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <Loading />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen">
      <Container size={isMobile ? "2" : "4"} className={isMobile ? "py-4" : "py-6"}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Flex direction="column" gap={isMobile ? "4" : "6"}>
            {/* Barre de filtres simplifiée */}
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              isMobile={isMobile}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
            />

            {/* Utilisation directe du composant MatchHistory */}
            <Box>
              <Flex align="center" justify="between" mb="4">
                <Text className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-100`}>
                  Historique des matchs
                </Text>
                <Badge 
                  color="gray" 
                  size="2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--gray-11)'
                  }}
                >
                  {filteredMatches.length} {filteredMatches.length <= 1 ? 'match' : 'matchs'}
                </Badge>
              </Flex>

              {filteredMatches.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center ${isMobile ? 'py-8' : 'py-12'}`}
                >
                  <Card 
                    style={{
                      background: 'rgba(30, 41, 59, 0.7)',
                      border: '1px dashed rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Flex 
                      align="center" 
                      justify="center" 
                      direction="column"
                      gap="3"
                      p={isMobile ? "6" : "8"}
                    >
                      <FaHistory size={isMobile ? 48 : 64} color="#6b7280" className="opacity-50" />
                      <Text className={`text-gray-400 ${isMobile ? 'text-base' : 'text-lg'} font-medium`}>
                        {allMatches.length === 0 ? "Aucun match dans votre historique" : "Aucun match ne correspond aux filtres"}
                      </Text>
                      <Text className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {allMatches.length === 0 
                          ? "Commencez à jouer pour construire votre historique !"
                          : "Modifiez vos filtres pour voir plus de résultats."
                        }
                      </Text>
                    </Flex>
                  </Card>
                </motion.div>
              ) : (
                <MatchList 
                  matches={filteredMatches}
                  currentUser={currentUser}
                  topPlayers={allUsers}
                />
              )}
            </Box>
          </Flex>
        </motion.div>
      </Container>
    </Box>
  );
} 