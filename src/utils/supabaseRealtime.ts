import { createClient } from '@/libs/supabase/client';
import { Database } from '@/types/database.types';
import { RealtimeChannel } from '@supabase/supabase-js';

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
export function subscribeToTable<T extends Record<string, any>>(
  channelName: string,
  table: Table,
  event: TableEvent,
  handler: SupabaseRealtimeHandler<T>,
  options: SubscriptionOptions = {}
): () => void {
  const supabase = createClient();
  
  const { schema = 'public', filter } = options;
  
  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', 
      { 
        event, 
        schema, 
        table: table as string,
        ...(filter ? { filter } : {})
      }, 
      (payload) => {
        handler({
          new: payload.new as T,
          old: payload.old as T,
          eventType: payload.eventType as TableEvent
        });
      }
    )
    .subscribe();
  
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
  let channel: RealtimeChannel | null = null;
  
  // Create a channel builder
  let channelBuilder = supabase.channel(channelName);
  
  // Add listeners for each event type
  Object.entries(handlers).forEach(([eventType, handler]) => {
    if (handler) {
      channelBuilder = channelBuilder.on(
        'postgres_changes',
        {
          event: eventType as TableEvent,
          schema,
          table: table as string,
          ...(filter ? { filter } : {})
        },
        (payload) => {
          handler({
            new: payload.new as T,
            old: payload.old as T,
            eventType: payload.eventType as TableEvent
          });
        }
      );
    }
  });
  
  // Subscribe to the channel
  channel = channelBuilder.subscribe();
  
  // Return an unsubscribe function
  return () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
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