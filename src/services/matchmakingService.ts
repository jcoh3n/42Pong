import { createClient, PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { Match } from './matchService';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);


// Define challenge-specific types
export type MatchmakingQueue = Database['public']['Tables']['matchmaking_queue']['Row'];
export type MatchmakingQueueInsert = Database['public']['Tables']['matchmaking_queue']['Insert'];
export type MatchmakingQueueUpdate = Database['public']['Tables']['matchmaking_queue']['Update'];
export type MatchmakingQueueStatus = Database['public']['Enums']['matchmaking_status'];

 
/**
 * Add a player to the matchmaking queue
 * @param playerId The ID of the player to add to the queue
 * @returns The queue entry or error
 */
export const addToQueue = async (playerId: string) => {
  // Check if player is already in queue
  	const { data, error } = await supabase.rpc('add_player_to_queue', {
   		player_id: playerId
	});

	console.log('addToQueue: ', data, error);
	

	return data as {
		data?: MatchmakingQueue;
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
export const removeFromQueue = async (playerId: string): Promise<{
	status: 'failed' | 'success' | 'error';
	message: string | null;
	error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from('matchmaking_queue')
    .delete()
    .eq('player_id', playerId);

	if (error?.code === 'PGRST116') {
		return { status: 'failed', message: 'Player not found in queue', error: null };
	}

	if (error) {
		console.error('Error removing player from queue:', error);
		return { status: 'error', message: error.message, error };
	}

	return { status: 'success', message: 'Player removed from queue', error: null };
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
  status: MatchmakingQueueStatus
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
export const createMatch = async (
	player1_id: string,
	player2_id: string,
	mode: Database['public']['Enums']['matche_type'] = 'normal',
	points_to_win: 5 | 7 | 11 = 7,
) => {
  	const { data, error } = await supabase.rpc('create_matche', {
		player1_id,
		player2_id,
		matche_type: mode,
		score_to_win: points_to_win
	});

	if (!data) {
		return { data: null, error };
	}

	return data as {
			data: Match;
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
export const getPlayerQueueStatus = async (playerId: string): Promise<{
	data: MatchmakingQueue | null;
	error: PostgrestError | null;
}> => {
  const { data, error } = await supabase
    .from('matchmaking_queue')
    .select('*')
    .eq('player_id', playerId)
    .single();

	if (error?.code === 'PGRST116') {
		return { data: null, error: null };
	}

	if (error) {
		return { data: null, error };
	}

	if (!data) {
		return { data: null, error: null };
	}

	return { data, error: null };
};

/**
 * Check if a player has a match
 * @param playerId The ID of the player
 * @returns The match ID if found, null otherwise
 */
export const getPlayerActiveMatch = async (
	playerId: string
): Promise<{
	data: Match | null;
	error: PostgrestError | null;
}> => {
  // First check if player was recently matched
  const { data, error } = await supabase
    .from('Matches')
    .select('*')
    .or(`user_1_id.eq.${playerId},user_2_id.eq.${playerId}`)
    .not('status', 'eq', 'completed')
    .single();

	if (error?.code === 'PGRST116') {
		return { data: null, error: null };
	}

	if (error) {
		console.error('Error fetching player active match:', error);
		return { data: null, error };
	}

	if (!data) {
		return { data: null, error: null };
	}

	return { data, error: null };
}; 