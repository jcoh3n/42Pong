"use client";

import React, { useState, useMemo } from 'react';
import { Box, Container, Flex, Text, Heading, Button, TextField, Select } from "@radix-ui/themes";
import { MagnifyingGlassIcon, MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";
import useCurrentUser from "@/hooks/useCurrentUser";
import useUsers from "@/hooks/users/useUsers";
import useUserMatches from "@/hooks/matches/useUserMatches";
import { LoadingState } from '@/components/home';
import MatchList from '@/components/home/MatchList';
import { motion } from 'framer-motion';
import { Match } from '@/services/matchService';

type FilterType = 'all' | 'ranked' | 'normal' | 'friendly';
type ResultFilter = 'all' | 'wins' | 'losses';
type SortFilter = 'newest' | 'oldest';

export default function HistoryPage() {
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { users: topPlayers = [], isLoading: isLoadingUsers } = useUsers({ 
    page: 1, 
    pageSize: 100, 
    sortBy: 'elo_score', 
    sortOrder: 'desc' 
  });
  
  // Récupérer tous les matchs de l'utilisateur
  const { matches = [], isLoading: isLoadingMatches } = useUserMatches(
    currentUser?.id,
    { pageSize: 100 } // Récupérer plus de matchs pour l'historique
  );

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [resultFilter, setResultFilter] = useState<ResultFilter>('all');
  const [sortFilter, setSortFilter] = useState<SortFilter>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrer et trier les matchs
  const filteredMatches = useMemo(() => {
    if (!currentUser) return [];

    let filtered = matches.filter((match: Match) => {
      // Filtre par type de match
      if (typeFilter !== 'all' && match.type !== typeFilter) {
        return false;
      }

      // Filtre par résultat
      if (resultFilter === 'wins' && match.winner_id !== currentUser.id) {
        return false;
      }
      if (resultFilter === 'losses' && match.winner_id === currentUser.id) {
        return false;
      }

      // Filtre par recherche d'adversaire
      if (searchTerm) {
        const opponentId = match.user_1_id === currentUser.id ? match.user_2_id : match.user_1_id;
        const opponent = topPlayers.find(player => player.id === opponentId);
        if (!opponent?.login.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      return true;
    });

    // Trier les matchs
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortFilter === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [matches, currentUser, typeFilter, resultFilter, searchTerm, sortFilter, topPlayers]);

  // Statistiques calculées
  const stats = useMemo(() => {
    if (!currentUser) return { total: 0, wins: 0, losses: 0, winRate: 0 };
    
    const total = filteredMatches.length;
    const wins = filteredMatches.filter(match => match.winner_id === currentUser.id).length;
    const losses = filteredMatches.filter(match => match.winner_id !== currentUser.id && match.winner_id !== null).length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

    return { total, wins, losses, winRate };
  }, [filteredMatches, currentUser]);

  // Créer un currentUser étendu avec les statistiques pour éviter les erreurs TypeScript
  const currentUserWithStats = useMemo(() => {
    if (!currentUser) return null;
    return {
      ...currentUser,
      wins: stats.wins,
      total_games: stats.total
    };
  }, [currentUser, stats]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setResultFilter('all');
    setSortFilter('newest');
  };

  // Afficher un écran de chargement pendant le chargement des données
  if (isLoadingUser || !currentUser || isLoadingUsers || isLoadingMatches) {
    return <LoadingState />;
  }

  return (
    <Box className="h-full w-full relative">
      <Container size="4" className="relative z-10">
        <Flex 
          direction="column" 
          align="center" 
          justify="start" 
          className="h-full py-4 px-4 sm:py-8"
          gap={{ initial: "4", sm: "6" }}
        >
          
          {/* Barre de recherche et filtres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <Box className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
              <Flex direction="column" gap="3">
                
                {/* Ligne principale avec recherche et bouton filtres */}
                <Flex gap="3" align="center">
                  <Box className="flex-1">
                    <TextField.Root
                      placeholder="Rechercher un adversaire..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    >
                      <TextField.Slot>
                        <MagnifyingGlassIcon height="16" width="16" />
                      </TextField.Slot>
                    </TextField.Root>
                  </Box>
                  
                  <Button
                    variant="ghost"
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                      background: showFilters ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                  >
                    <MixerHorizontalIcon width="16" height="16" />
                    Filtres
                  </Button>
                </Flex>

                {/* Panneau de filtres déroulant */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Flex direction="column" gap="3" className="pt-3 border-t border-white/10">
                      
                      {/* Filtres en ligne */}
                      <Flex gap="3" wrap="wrap">
                        
                        {/* Type de match */}
                        <Box>
                          <Text size="2" className="text-white/70 mb-1 block">Type</Text>
                          <Select.Root value={typeFilter} onValueChange={(value) => setTypeFilter(value as FilterType)}>
                            <Select.Trigger 
                              className="w-32" 
                              style={{ 
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white'
                              }}
                            />
                            <Select.Content>
                              <Select.Item value="all">Tous</Select.Item>
                              <Select.Item value="ranked">Ranked</Select.Item>
                              <Select.Item value="normal">Normal</Select.Item>
                              <Select.Item value="friendly">Amical</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </Box>

                        {/* Résultat */}
                        <Box>
                          <Text size="2" className="text-white/70 mb-1 block">Résultat</Text>
                          <Select.Root value={resultFilter} onValueChange={(value) => setResultFilter(value as ResultFilter)}>
                            <Select.Trigger 
                              className="w-32"
                              style={{ 
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white'
                              }}
                            />
                            <Select.Content>
                              <Select.Item value="all">Tous</Select.Item>
                              <Select.Item value="wins">Victoires</Select.Item>
                              <Select.Item value="losses">Défaites</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </Box>

                        {/* Tri */}
                        <Box>
                          <Text size="2" className="text-white/70 mb-1 block">Tri</Text>
                          <Select.Root value={sortFilter} onValueChange={(value) => setSortFilter(value as SortFilter)}>
                            <Select.Trigger 
                              className="w-32"
                              style={{ 
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white'
                              }}
                            />
                            <Select.Content>
                              <Select.Item value="newest">Plus récent</Select.Item>
                              <Select.Item value="oldest">Plus ancien</Select.Item>
                            </Select.Content>
                          </Select.Root>
                        </Box>

                        {/* Bouton reset */}
                        <Box className="flex items-end">
                          <Button
                            variant="ghost"
                            onClick={resetFilters}
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: 'white'
                            }}
                          >
                            <Cross2Icon width="14" height="14" />
                            Reset
                          </Button>
                        </Box>
                      </Flex>
                    </Flex>
                  </motion.div>
                )}
              </Flex>
            </Box>
          </motion.div>

          {/* Liste des matchs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            {filteredMatches.length > 0 ? (
              <MatchList 
                matches={filteredMatches}
                currentUser={currentUserWithStats}
                topPlayers={topPlayers}
              />
            ) : (
              <Box className="text-center py-16">
                <Text size="3" className="text-white/40">
                  {matches.length === 0 
                    ? "Aucun match dans votre historique" 
                    : "Aucun résultat pour ces critères"
                  }
                </Text>
              </Box>
            )}
          </motion.div>

        </Flex>
      </Container>
    </Box>
  );
} 