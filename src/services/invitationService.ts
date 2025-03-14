import { createClient } from '@/libs/supabase/client';
import { Database } from '@/types/database.types';
import { NotificationService } from './notificationService';

type FriendlyInvitation = Database['public']['Tables']['friendly_invitation']['Row'];

export class InvitationService {
  private getClient() {
    return createClient<Database>();
  }

  async createFriendlyInvitation(senderId: string, receiverId: string, points_to_win: '5' | '7' | '11' = '7'): Promise<FriendlyInvitation> {
    const { data, error } = await this.getClient()
      .from('friendly_invitation')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        points_to_win
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating friendly invitation:', error);
      throw error;
    }

    return data;
  }

  async getFriendlyInvitations(userId: string): Promise<FriendlyInvitation[]> {
    const { data, error } = await this.getClient()
      .from('friendly_invitation')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching friendly invitations:', error);
      throw error;
    }

    return data || [];
  }

  async getInvitationById(invitationId: string): Promise<FriendlyInvitation> {
    const { data, error } = await this.getClient()
      .from('friendly_invitation')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (error) {
      console.error('Error fetching friendly invitation by ID:', error);
      throw error;
    }

    return data;
  }

  async updateInvitationStatus(invitationId: string, status: 'accepted' | 'cancelled' | 'refused'): Promise<FriendlyInvitation> {
    const { data, error } = await this.getClient()
      .from('friendly_invitation')
      .update({
        status,
        ...(status === 'accepted' && { accepted_at: new Date().toISOString() })
      })
      .eq('id', invitationId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating invitation status:', error);
      throw error;
    }

    return data;
  }
} 