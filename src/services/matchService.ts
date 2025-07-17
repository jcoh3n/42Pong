import { createClient } from "@/libs/supabase/client";
import { Database } from "@/types/database.types";
import { PaginatedResponse } from "./userService";
import { eloService } from './eloService';

// Define match-specific types
export type Match = Database['public']['Tables']['Matches']['Row'];
export type MatchInsert = Database['public']['Tables']['Matches']['Insert'];
export type MatchUpdate = Database['public']['Tables']['Matches']['Update'];

export class MatchService {
	private getClient() {
		return createClient<Database>();
	}

	async getUserMatchesCount(userId: string): Promise<number> {
		const { count, error } = await this.getClient()
			.from('Matches')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'completed')
			.or(`user_1_id.eq.${userId},user_2_id.eq.${userId}`);

		if (error) {
			console.error(`Error counting matches for user ${userId}:`, error);
			throw error;
		}

		return count || 0;
	}

	async getAllMatches(options?: {
		page?: number;
		pageSize?: number;
		sortBy?: keyof Match;
		sortOrder?: 'asc' | 'desc';
		onlyCompleted?: boolean;
	}): Promise<PaginatedResponse<Match>> {
		const {
			page = 1,
			pageSize = 10,
			sortBy = 'created_at',
			sortOrder = 'desc',
			onlyCompleted = false
		} = options || {};

		// Calculate offset based on page and pageSize
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		// Create query with pagination
		let query = this.getClient()
			.from('Matches')
			.select('*', { count: 'exact' });

		// Add filters and ordering
		if (onlyCompleted) {
			query = query.eq('status', 'completed');
		}

		query = query
			.order(sortBy, { ascending: sortOrder === 'asc' })
			.range(from, to);

		const { data, error, count } = await query;

		if (error) {
			console.error('Error fetching all matches:', error);
			throw error;
		}

		const totalCount = count || 0;

		return {
			data: data || [],
			count: totalCount,
			page,
			pageSize,
			hasMore: from + data.length < totalCount
		};
	}

	async getMatchById(id: string): Promise<Match | null> {
		const { data, error } = await this.getClient()
			.from('Matches')
			.select('*')
			.eq('id', id)
			.single();

		if (error) {
			console.error(`Error fetching match with id ${id}:`, error);
			if (error.code === 'PGRST116') {
				return null; // Record not found
			}
			throw error;
		}

		return data;
	}

	async getMatchesByUserId(userId: string, options?: {
		page?: number;
		pageSize?: number;
		sortBy?: keyof Match;
		sortOrder?: 'asc' | 'desc';
	}): Promise<PaginatedResponse<Match>> {
		const {
			page = 1,
			pageSize = 10,
			sortBy = 'created_at',
			sortOrder = 'desc'
		} = options || {};

		// Calculate offset based on page and pageSize
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		try {
			// Get matches where user is player 1
			const user1Matches = await this.getClient()
				.from('Matches')
				.select('*')
				.eq('user_1_id', userId);

			// Get matches where user is player 2
			const user2Matches = await this.getClient()
				.from('Matches')
				.select('*')
				.eq('user_2_id', userId);

			if (user1Matches.error) {
				console.error(`Error fetching user1 matches for user ${userId}:`, user1Matches.error);
				throw user1Matches.error;
			}

			if (user2Matches.error) {
				console.error(`Error fetching user2 matches for user ${userId}:`, user2Matches.error);
				throw user2Matches.error;
			}

			// Combine and sort matches
			const allMatches = [...(user1Matches.data || []), ...(user2Matches.data || [])];
			const sortedMatches = allMatches.sort((a, b) => {
				const aValue = a[sortBy];
				const bValue = b[sortBy];

				// Handle null/undefined values
				if (aValue == null && bValue == null) return 0;
				if (aValue == null) return 1;
				if (bValue == null) return -1;

				if (sortOrder === 'asc') {
					return aValue > bValue ? 1 : -1;
				}
				return aValue < bValue ? 1 : -1;
			});

			// Apply pagination
			const paginatedMatches = sortedMatches.slice(from, to + 1);

			return {
				data: paginatedMatches,
				count: allMatches.length,
				page,
				pageSize,
				hasMore: to < allMatches.length - 1
			};
		} catch (error) {
			console.error(`Error in getMatchesByUserId for user ${userId}:`, error);
			throw error;
		}
	}

	async getMatchesWonByUserId(userId: string, options?: {
		page?: number;
		pageSize?: number;
		sortBy?: keyof Match;
		sortOrder?: 'asc' | 'desc';
	}): Promise<PaginatedResponse<Match>> {
		const {
			page = 1,
			pageSize = 10,
			sortBy = 'created_at',
			sortOrder = 'desc'
		} = options || {};

		// Calculate offset based on page and pageSize
		const from = (page - 1) * pageSize;
		const to = from + pageSize - 1;

		// Create query with pagination
		const { data, error, count } = await this.getClient()
			.from('Matches')
			.select('*', { count: 'exact' })
			.eq('winner_id', userId)
			.order(sortBy, { ascending: sortOrder === 'asc' })
			.range(from, to);

		if (error) {
			console.error(`Error fetching matches won by user ${userId}:`, error);
			throw error;
		}

		const totalCount = count || 0;

		return {
			data: data || [],
			count: totalCount,
			page,
			pageSize,
			hasMore: from + data.length < totalCount
		};
	}

	async createMatch(match: MatchInsert): Promise<Match> {
		const { data, error } = await this.getClient()
			.from('Matches')
			.insert(match)
			.select('*')
			.single();

		if (error) {
			console.error('Error creating match:', error);
			throw error;
		}

		return data;
	}

	async updateMatch(id: string, updates: MatchUpdate): Promise<Match> {
		console.debug(`[updateMatch] Updating match ${id} with:`, updates);

		// Get the current match state before updating
		const currentMatch = await this.getMatchById(id);
		console.debug(`[updateMatch] Current match state:`, currentMatch);

		const { data, error } = await this.getClient()
			.from('Matches')
			.update(updates)
			.eq('id', id)
			.select('*')
			.single();

		if (error) {
			console.error(`Error updating match with id ${id}:`, error);
			throw error;
		}

		console.debug(`[updateMatch] Updated match data:`, data);

		// Check if the match was just completed and has a winner
		const wasCompleted = currentMatch?.status !== 'completed' && data.status === 'completed';
		const hasWinner = data.winner_id && data.winner_id.trim() !== '';
		const isRanked = data.match_type === 'ranked' || data.type === 'ranked';

		console.debug(`[updateMatch] wasCompleted: ${wasCompleted}, hasWinner: ${hasWinner}, isRanked: ${isRanked}`);

		// Trigger ELO update only for ranked matches
		if (wasCompleted && hasWinner && isRanked) {
			console.log(`Ranked match ${id} completed with winner ${data.winner_id}, updating ELO ratings...`);
			
			// Update ELO ratings synchronously to ensure data consistency
			try {
				const result = await eloService.updateEloAfterMatch(data);
				if (result.success) {
					console.log(`ELO ratings updated successfully for ranked match ${id}:`, result.eloChange);
				} else {
					console.error(`Failed to update ELO ratings for ranked match ${id}:`, result.error);
				}
			} catch (error) {
				console.error(`Error updating ELO ratings for ranked match ${id}:`, error);
			}
		}

		return data;
	}

	async updateScores(id: string, user1Score: number, user2Score: number): Promise<Match> {
		return this.updateMatch(id, {
			user_1_score: user1Score,
			user_2_score: user2Score
		});
	}

	async incrementUserScore(matchId: string, userId: string): Promise<{
		data?: {
			updated_score: number
		},
		error?: {
			code: string,
			message: string,
		}
	}> {
		// First, get the match to check its type
		const match = await this.getMatchById(matchId);
		
		if (!match) {
			return {
				error: {
					code: 'MATCH_NOT_FOUND',
					message: 'Match not found'
				}
			};
		}

		// Check if user is participant in the match
		if (match.user_1_id !== userId && match.user_2_id !== userId) {
			return {
				error: {
					code: 'USER_NOT_IN_MATCH',
					message: 'User is not a participant in this match'
				}
			};
		}

		// Determine which user's score to increment
		const isUser1 = match.user_1_id === userId;
		const currentScore = isUser1 ? match.user_1_score : match.user_2_score;
		const newScore = currentScore + 1;

		// Update the match score
		const updatedMatch = await this.updateMatch(matchId, {
			[isUser1 ? 'user_1_score' : 'user_2_score']: newScore
		});

		// Check if someone won (reached score_to_win)
		const user1Score = isUser1 ? newScore : match.user_1_score;
		const user2Score = isUser1 ? match.user_2_score : newScore;
		
		// Check if this is a ranked match for ELO updates
		const isRankedMatch = match.match_type === 'ranked' || match.type === 'ranked';
		let winnerId: string | null = null;

		if (user1Score >= match.score_to_win || user2Score >= match.score_to_win) {
			// Determine winner
			winnerId = user1Score >= match.score_to_win ? match.user_1_id : match.user_2_id;
			
			// Update match with winner and status
			const completedMatch = await this.updateMatch(matchId, {
				winner_id: winnerId,
				status: 'completed',
				finished_at: new Date().toISOString()
			});
		}

		return {
			data: {
				updated_score: newScore
			}
		};
	}

	async forfeitMatch(id: string, forfeitingUserId: string): Promise<Match> {
		// First, get the current match to determine the winner
		const match = await this.getMatchById(id);

		if (!match) {
			throw new Error(`Match with id ${id} not found`);
		}

		// Check if match is already finished
		if (match.status == 'completed') {
			throw new Error(`Match with id ${id} is already finished`);
		}

		// Determine the winner (the user who didn't forfeit)
		let winnerId: string;
		if (match.user_1_id === forfeitingUserId) {
			winnerId = match.user_2_id;
		} else if (match.user_2_id === forfeitingUserId) {
			winnerId = match.user_1_id;
		} else {
			throw new Error(`User ${forfeitingUserId} is not a participant in match ${id}`);
		}

		// Update the match with the forfeit information
		// This will automatically trigger ELO updates via updateMatch
		return this.updateMatch(id, {
			winner_id: winnerId,
			forfeited_by: forfeitingUserId,
			status: 'completed',
			finished_at: new Date().toISOString()
		});
	}
}

export const matchService = new MatchService(); 