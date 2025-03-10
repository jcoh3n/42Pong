import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { FunctionResponse } from '@/types/functionsTypes';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

/**
 * Add a player to the matchmaking queue
 * @param playerId The ID of the player to add to the queue
 * @returns The queue entry or error
 */
export const addToQueue = async (playerId: string) => {
  // Check if player is already in queue
  	const { data } = await supabase.rpc('add_player_to_queue', {
   		player_id: playerId
	});

	return data as {
		data?: Database['public']['Tables']['matchmaking_queue']['Row'];
		error?: {
		  message: string;
		  code: string;
		};
	};
};

/**
 * Remove a player from the matchmaking queue
 * @param playerId The ID of the player to remove
 * @returns Success or error
 */
export const removeFromQueue = async (playerId: string) => {
  const { data, error } = await supabase
    .from('matchmaking_queue')
    .update({ status: 'cancelled' })
    .eq('player_id', playerId)
    .eq('status', 'waiting')
    .select();

  return { data, error };
};

/**
 * Get all players currently waiting in the queue
 * @returns Array of players in the queue
 */
export const getWaitingPlayers = async () => {
  const { data, error } = await supabase
    .from('matchmaking_queue')
    .select('*, player:player_id(id, login, avatar_url, elo_score)')
    .eq('status', 'waiting')
    .order('joined_at', { ascending: true });

  return { data, error };
};

/**
 * Update the status of a player in the queue
 * @param playerId The ID of the player
 * @param status The new status
 * @returns Success or error
 */
export const updatePlayerStatus = async (
  playerId: string,
  status: Database['public']['Enums']['matchmaking_status']
) => {
  const { data, error } = await supabase
    .from('matchmaking_queue')
    .update({ status })
    .eq('player_id', playerId)
    .select();

  return { data, error };
};

/**
 * Process the matchmaking queue and match players
 * This function would typically be called by a cron job or timer
 * @returns Array of created matches
 */
export const processMatchmakingQueue = async () => {
  // Get all waiting players
  const { data: waitingPlayers, error } = await getWaitingPlayers();

  if (error || !waitingPlayers || waitingPlayers.length < 2) {
    return { data: [], error };
  }

  const createdMatches = [];
  const matchedPlayerIds = [];

  // Match players in pairs (first come, first served)
  for (let i = 0; i < Math.floor(waitingPlayers.length / 2) * 2; i += 2) {
    const player1 = waitingPlayers[i];
    const player2 = waitingPlayers[i + 1];

    // Create a match between these two players
    const { data: match, error: matchError } = await createMatch(
      player1.player_id,
      player2.player_id
    );

    if (matchError) {
      console.error('Error creating match:', matchError);
      continue;
    }

    if (match) {
      createdMatches.push(match);
      matchedPlayerIds.push(player1.player_id, player2.player_id);
    }
  }

  // Update status for all matched players
  if (matchedPlayerIds.length > 0) {
    const { error: updateError } = await supabase
      .from('matchmaking_queue')
      .update({ status: 'matched' })
      .in('player_id', matchedPlayerIds);

    if (updateError) {
      console.error('Error updating player statuses:', updateError);
    }
  }

  return { data: createdMatches, error: null };
};

/**
 * Create a match between two players
 * @param player1_id The ID of the first player
 * @param player2_id The ID of the second player
 * @returns The created match or error
 */
export const createMatch = async (player1_id: string, player2_id: string) => {
  	const { data, error } = await supabase.rpc('create_match_from_queue', {
		player1_id,
		player2_id
	});

	if (!data) {
		return { data: null, error };
	}

	return data as {
			data: Database['public']['Tables']['Matches']['Row'];
			error: {
			  message: string;
			  code: string;
			};
		};
};

/**
 * Get the status of a player in the matchmaking queue
 * @param playerId The ID of the player
 * @returns The queue status or null if not in queue
 */
export const getPlayerQueueStatus = async (playerId: string) => {
  const { data, error } = await supabase
    .from('matchmaking_queue')
    .select('*')
    .eq('player_id', playerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return { data: null, error: null };
    }
    return { data: null, error };
  }

  return { data, error: null };
};

/**
 * Check if a player has a match
 * @param playerId The ID of the player
 * @returns The match ID if found, null otherwise
 */
export const getPlayerActiveMatch = async (playerId: string) => {
  // First check if player was recently matched
  const { data: queueEntry } = await supabase
    .from('matchmaking_queue')
    .select('*')
    .eq('player_id', playerId)
    .eq('status', 'matched')
    .single();

  if (queueEntry) {
    // Look for recent match with this player
    const { data: match, error } = await supabase
      .from('Matches')
      .select('*')
      .or(`user_1_id.eq.${playerId},user_2_id.eq.${playerId}`)
      .is('finished_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: match, error: null };
  }

  return { data: null, error: null };
}; 