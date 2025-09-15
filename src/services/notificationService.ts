import { createClient } from "@/libs/supabase/client";
import { Database } from "@/types/database.types";
import { PaginatedResponse } from "./types";

// Define notification-specific types
export type Notification = Database['public']['Tables']['Notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['Notifications']['Insert'];
export type NotificationUpdate = Database['public']['Tables']['Notifications']['Update'];

export class NotificationService {
  private getClient() {
    return createClient<Database>();
  }

  /**
   * Create a new notification
   * @param notification 
   * @returns The created notification
   */
  async createNotification(notification: NotificationInsert): Promise<Notification> {
    const { data, error } = await this.getClient()
      .from('Notifications')
      .insert(notification)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get a notification by its ID
   * @param id 
   * @returns The notification or null if not found
   */
  async getNotificationById(id: string): Promise<Notification | null> {
    const { data, error } = await this.getClient()
      .from('Notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching notification with id ${id}:`, error);
      if (error.code === 'PGRST116') {
        return null; // Record not found
      }
      throw error;
    }

    return data;
  }

  /**
   * Get notifications for a specific user
   * @param userId 
   * @param options 
   * @returns Paginated notifications
   */
  async getNotificationsByUserId(userId: string, options?: { 
    page?: number; 
    pageSize?: number; 
    sortBy?: keyof Notification;
    sortOrder?: 'asc' | 'desc';
    onlyUnseen?: boolean;
  }): Promise<PaginatedResponse<Notification>> {
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      onlyUnseen = false
    } = options || {};

    // Calculate offset based on page and pageSize
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;


    // Create query with pagination
    let query = this.getClient()
      .from('Notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Filter by unseen if requested
    if (onlyUnseen) {
      query = query.eq('seen', false);
    }

    // Add sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error);
      throw error;
    }

    const totalCount = count || 0;
    
    return {
      data: data || [],
      count: totalCount,
      page,
      pageSize,
      hasMore: from + (data?.length || 0) < totalCount
    };
  }

  /**
   * Get all notifications with pagination
   * @param options 
   * @returns Paginated notifications
   */
  async getAllNotifications(options?: { 
    page?: number; 
    pageSize?: number; 
    sortBy?: keyof Notification;
    sortOrder?: 'asc' | 'desc' 
  }): Promise<PaginatedResponse<Notification>> {
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
      .from('Notifications')
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) {
      console.error('Error fetching all notifications:', error);
      throw error;
    }

    const totalCount = count || 0;
    
    return {
      data: data || [],
      count: totalCount,
      page,
      pageSize,
      hasMore: from + (data?.length || 0) < totalCount
    };
  }

  /**
   * Update a notification
   * @param id 
   * @param updates 
   * @returns The updated notification
   */
  async updateNotification(id: string, updates: NotificationUpdate): Promise<Notification> {
    const { data, error } = await this.getClient()
      .from('Notifications')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating notification with id ${id}:`, error);
      throw error;
    }

    return data;
  }

  /**
   * Mark a notification as seen
   * @param id 
   * @returns The updated notification
   */
  async markAsSeen(id: string): Promise<Notification> {
    return this.updateNotification(id, { seen: true });
  }

  /**
   * Mark all notifications for a user as seen
   * @param userId 
   * @returns Whether the operation was successful
   */
  async markAllAsSeenForUser(userId: string): Promise<boolean> {
    const { error } = await this.getClient()
      .from('Notifications')
      .update({ seen: true })
      .eq('user_id', userId);

    if (error) {
      console.error(`Error marking all notifications as seen for user ${userId}:`, error);
      throw error;
    }

    return true;
  }

  /**
   * Delete a notification
   * @param id 
   * @returns Whether the deletion was successful
   */
  async deleteNotification(id: string): Promise<boolean> {
    const { error } = await this.getClient()
      .from('Notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting notification with id ${id}:`, error);
      throw error;
    }

    return true;
  }

  /**
   * Delete all notifications for a user
   * @param userId 
   * @returns Whether the deletion was successful
   */
  async deleteAllNotificationsForUser(userId: string): Promise<boolean> {
    const { error } = await this.getClient()
      .from('Notifications')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error(`Error deleting all notifications for user ${userId}:`, error);
      throw error;
    }

    return true;
  }
} 