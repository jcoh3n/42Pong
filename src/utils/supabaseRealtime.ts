import { createClient } from '@/libs/supabase/client';
import { Database } from '@/types/database.types';
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, RealtimeChannel, RealtimePostgresChangesFilter } from '@supabase/supabase-js';

type Table = keyof Database['public']['Tables'];
type TableEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

type SupabaseRealtimeHandler<T> = (payload: {
	new: T;
	old: T;
	eventType: TableEvent;
}) => void;

interface SubscriptionOptions {
	schema?: string;
	filter?: string;
}
function getInsertChannel<T extends { [key: string]: any }>(
	supabase: ReturnType<typeof createClient>, 
	channel: RealtimeChannel,
	table: Table, 
	schema: string, 
	filter?: string, 
	handler?: SupabaseRealtimeHandler<T>
) {
	return channel
		.on<T>('postgres_changes', {
			event: 'INSERT',
			schema,
			table: table as string,
			...(filter ? { filter } : {})
		} as RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT}`>,
			(payload) => {
				handler?.({
					new: payload.new as T,
					old: payload.old as T,
					eventType: 'INSERT'
				});
			});
}

function getUpdateChannel<T extends { [key: string]: any }>(
	supabase: ReturnType<typeof createClient>, 
	channel: RealtimeChannel,
	table: Table, 
	schema: string, 
	filter?: string, 
	handler?: SupabaseRealtimeHandler<T>
) {
	return channel
		.on<T>('postgres_changes', {
			event: 'UPDATE',
			schema,
			table: table as string,
			...(filter ? { filter } : {})
		} as RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE}`>,
			(payload) => {
				handler?.({
					new: payload.new as T,
					old: payload.old as T,
					eventType: 'UPDATE'
				});
			});
}

function getDeleteChannel<T extends { [key: string]: any }>(
	supabase: ReturnType<typeof createClient>, 
	channel: RealtimeChannel,
	table: Table, 
	schema: string, 
	filter?: string, 
	handler?: SupabaseRealtimeHandler<T>
) {
	return channel
		.on<T>('postgres_changes', {
			event: 'DELETE',
			schema,
			table: table as string,
			...(filter ? { filter } : {})
		} as RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE}`>,
			(payload) => {
				handler?.({
					new: payload.new as T,
					old: payload.old as T,
					eventType: 'DELETE'
				});
			});
}

function getAllChannel<T extends { [key: string]: any }>(
	supabase: ReturnType<typeof createClient>, 
	channel: RealtimeChannel,
	table: Table, 
	schema: string, 
	filter?: string, 
	handler?: SupabaseRealtimeHandler<T>
) {
	return channel
		.on<T>('postgres_changes', {
			event: '*',
			schema,
			table: table as string,
			...(filter ? { filter } : {})
		} as RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL}`>,
			(payload) => {
				handler?.({
					new: payload.new as T,
					old: payload.old as T,
					eventType: '*'
				});
			});
}

/**
 * Creates a Supabase Realtime subscription to a database table
 * 
 * @param channelName A unique name for the channel
 * @param table The database table to subscribe to
 * @param event The database event to listen for (INSERT, UPDATE, DELETE, or *)
 * @param handler The function to call when an event occurs
 * @param options Additional options like schema and filter
 * @returns A function to unsubscribe from the channel
 */
export function subscribeToTable<T extends { [key: string]: any }>(
	channelName: string,
	table: Table,
	event: TableEvent,
	handler: SupabaseRealtimeHandler<T>,
	options: SubscriptionOptions = {}
): () => void {
	const supabase = createClient();

	const { schema = 'public', filter } = options;

	const channel = supabase.channel(channelName);

	if (event === 'INSERT') {
		getInsertChannel(supabase, channel, table, schema, filter, handler);
	} else if (event === 'UPDATE') {
		getUpdateChannel(supabase, channel, table, schema, filter, handler);
	} else if (event === 'DELETE') {
		getDeleteChannel(supabase, channel, table, schema, filter, handler);
	} else if (event === '*') {
		getAllChannel(supabase, channel, table, schema, filter, handler);
	} else {
		throw new Error(`Unsupported event type: ${event}`);
	}

	// Subscribe to the channel
	channel.subscribe();

	// Return an unsubscribe function
	return () => {
		supabase.removeChannel(channel);
	};
}

/**
 * Creates a Supabase Realtime subscription to multiple database events on a table
 * 
 * @param channelName A unique name for the channel
 * @param table The database table to subscribe to
 * @param handlers Object with handlers for different events
 * @param options Additional options like schema and filter
 * @returns A function to unsubscribe from the channel
 */
export function subscribeToTableEvents<T extends Record<string, any>>(
	channelName: string,
	table: Table,
	handlers: Partial<Record<TableEvent, SupabaseRealtimeHandler<T>>>,
	options: SubscriptionOptions = {}
): () => void {
	const supabase = createClient();
	const { schema = 'public', filter } = options;
	
	// Create a single channel for all events
	const channel = supabase.channel(channelName);

	// Add listeners for each event type
	Object.entries(handlers).forEach(([eventType, handler]) => {
		if (handler) {
			if (eventType === 'INSERT') {
				getInsertChannel(supabase, channel, table, schema, filter, handler);
			} else if (eventType === 'UPDATE') {
				getUpdateChannel(supabase, channel, table, schema, filter, handler);
			} else if (eventType === 'DELETE') {
				getDeleteChannel(supabase, channel, table, schema, filter, handler);
			} else if (eventType === '*') {
				getAllChannel(supabase, channel, table, schema, filter, handler);
			} else {
				throw new Error(`Unsupported event type: ${eventType}`);
			}
		}
	});

	// Subscribe to the channel
	channel.subscribe();

	// Return an unsubscribe function
	return () => {
		supabase.removeChannel(channel);
	};
}

/**
 * Creates a Supabase Realtime subscription to a database table for a specific user
 * 
 * @param channelName A unique name for the channel
 * @param table The database table to subscribe to
 * @param userId The user ID to filter by
 * @param userIdColumn The column name that contains the user ID
 * @param handlers Object with handlers for different events
 * @returns A function to unsubscribe from the channel
 */
export function subscribeToUserTable<T extends Record<string, any>>(
	channelName: string,
	table: Table,
	userId: string,
	userIdColumn: string = 'user_id',
	handlers: Partial<Record<TableEvent, SupabaseRealtimeHandler<T>>>
): () => void {
	return subscribeToTableEvents(
		channelName,
		table,
		handlers,
		{
			filter: `${userIdColumn}=eq.${userId}`
		}
	);
} 