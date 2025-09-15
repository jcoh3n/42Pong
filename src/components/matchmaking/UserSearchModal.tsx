import React, { useState, useEffect, useCallback } from 'react';
import { UserService } from '@/services/userService';
import { createClient } from '@/libs/supabase/client';
import { Database } from '@/types/database.types';
import { FaSearch, FaTimes, FaClock, FaUserFriends, FaSpinner } from 'react-icons/fa';
import { InvitationService } from '@/services/invitationService';

type UserRow = Database['public']['Tables']['Users']['Row'];
type FriendlyInvitation = Database['public']['Tables']['friendly_invitation']['Row'];

// Define the interface with required fields
interface UserWithInvitationStatus {
  id: string;
  login: string;
  avatar_url: string;
  hasPendingInvitation: boolean;
}

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
  onDeselectUser: (userId: string) => void;
  currentUserId: string;
}

// Custom hook for managing user operations loading states
function useUserOperations() {
  const [processingUsers, setProcessingUsers] = useState<Record<string, boolean>>({});
  
  const startProcessing = useCallback((userId: string) => {
    setProcessingUsers(prev => ({ ...prev, [userId]: true }));
  }, []);
  
  const stopProcessing = useCallback((userId: string) => {
    setProcessingUsers(prev => ({ ...prev, [userId]: false }));
  }, []);
  
  const isProcessing = useCallback((userId: string) => {
    return processingUsers[userId] || false;
  }, [processingUsers]);
  
  const executeUserOperation = useCallback(async (
    userId: string, 
    operation: () => Promise<void>
  ) => {
    if (isProcessing(userId)) return;
    
    try {
      startProcessing(userId);
      await operation();
    } finally {
      stopProcessing(userId);
    }
  }, [isProcessing, startProcessing, stopProcessing]);
  
  return { isProcessing, executeUserOperation };
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  onDeselectUser,
  currentUserId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserWithInvitationStatus[]>([]);
  const [pendingInvitationUsers, setPendingInvitationUsers] = useState<UserWithInvitationStatus[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isProcessing, executeUserOperation } = useUserOperations();
  
  // Fetch pending invitations and related users when modal opens
  useEffect(() => {
    const fetchPendingInvitationUsers = async () => {
      if (!isOpen || !currentUserId) return;
      
      setIsLoadingInvitations(true);
      setError(null);
      
      try {
        const invitationService = new InvitationService();
        const invitations = await invitationService.getFriendlyInvitations(currentUserId);
        const pendingInvitations = invitations.filter(inv => inv.status === 'pending');
        
        if (pendingInvitations.length === 0) {
          setPendingInvitationUsers([]);
          return;
        }
        
        // Get unique user IDs from pending invitations (excluding current user)
        const userIds = new Set<string>();
        pendingInvitations.forEach(inv => {
          if (inv.sender_id !== currentUserId) userIds.add(inv.sender_id);
          if (inv.receiver_id !== currentUserId) userIds.add(inv.receiver_id);
        });
        
        // Fetch user details for these IDs
        const { data, error: userError } = await createClient()
          .from('Users')
          .select('*')
          .in('id', Array.from(userIds));
          
        if (userError) throw userError;
        
        if (data) {
          const usersWithStatus = data.map((user: any) => ({
            id: user.id,
            login: user.login,
            avatar_url: user.avatar_url,
            hasPendingInvitation: true
          }));
          
          setPendingInvitationUsers(usersWithStatus);
        }
      } catch (err) {
        console.error('Error fetching pending invitation users:', err);
        setError('Failed to load invited users');
      } finally {
        setIsLoadingInvitations(false);
      }
    };

    fetchPendingInvitationUsers();
  }, [isOpen, currentUserId]);

  // Search users based on query
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery) {
        setUsers([]);
        return;
      }

      setIsLoadingSearch(true);
      setError(null);

      try {
        const { data, error } = await createClient()
          .from('Users')
          .select('*')
          .ilike('login', `%${searchQuery}%`)
          .neq('id', currentUserId)
          .limit(10);

        if (error) throw error;
        
        if (data) {
          // Merge with pending invitation status
          const pendingUserIds = pendingInvitationUsers.map(u => u.id);
          const usersWithStatus = data.map((user: any) => ({
            id: user.id,
            login: user.login,
            avatar_url: user.avatar_url,
            hasPendingInvitation: pendingUserIds.includes(user.id)
          }));
          
          setUsers(usersWithStatus);
        }
      } catch (err) {
        setError('Failed to search users');
        console.error('Error searching users:', err);
      } finally {
        setIsLoadingSearch(false);
      }
    };

    // Use debounce for search
    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, currentUserId, pendingInvitationUsers]);

  const handleUserAction = useCallback((user: UserWithInvitationStatus) => {
    const { id, hasPendingInvitation } = user;
    
    executeUserOperation(id, async () => {
      if (hasPendingInvitation) {
        onDeselectUser(id);
        
        // Update local state to reflect the change
        setPendingInvitationUsers(prev => 
          prev.filter(u => u.id !== id)
        );
        
        setUsers(prev => 
          prev.map(u => 
            u.id === id 
              ? { ...u, hasPendingInvitation: false } 
              : u
          )
        );
      } else {
        onSelectUser(id);
        
        // Update local state to reflect the change
        setUsers(prev => 
          prev.map(u => 
            u.id === id 
              ? { ...u, hasPendingInvitation: true } 
              : u
          )
        );
        
        // Add to pending users if we're viewing them and not searching
        if (!searchQuery) {
          setPendingInvitationUsers(prev => [
            ...prev, 
            { ...user, hasPendingInvitation: true }
          ]);
        }
      }
    });
  }, [executeUserOperation, onDeselectUser, onSelectUser, searchQuery]);

  const handleClose = useCallback(() => {
    setSearchQuery('');
    setUsers([]);
    setError(null);
    onClose();
  }, [onClose]);

  // Determine which users to display
  const displayUsers = searchQuery ? users : pendingInvitationUsers;
  const isLoading = searchQuery ? isLoadingSearch : isLoadingInvitations;
  
  if (!isOpen) return null;
 
  return (<>
  		<div 
			className="absolute inset-0 bg-gradient-to-b z-50 from-white/10 to-white/5 rounded-2xl"
			style={{
			WebkitBackdropFilter: 'blur(12px)',
			backdropFilter: 'blur(12px)',
			}}
		/>
		<div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
			<div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold text-white">Search Users</h2>
				<button
					onClick={handleClose}
					className="text-gray-400 hover:text-white transition-colors"
				>
					<FaTimes size={20} />
				</button>
				</div>

				<div className="relative mb-4">
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search by username..."
					className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
				</div>

				{!searchQuery && pendingInvitationUsers.length > 0 && (
				<div className="mb-4 flex items-center text-blue-400">
					<FaUserFriends className="mr-2" />
					<p>Users with pending invitations:</p>
				</div>
				)}

				{error && (
				<div className="text-red-500 mb-4">{error}</div>
				)}

				<div className="max-h-96 overflow-y-auto">
				{isLoading ? (
					<div className="text-center text-gray-400 py-4">Loading...</div>
				) : displayUsers.length === 0 ? (
					<div className="text-center text-gray-400 py-4">
					{searchQuery 
						? 'No users found matching your search' 
						: 'No pending invitations found'}
					</div>
				) : (
					<div className="space-y-2 max-h-80 overflow-y-auto">
					{displayUsers.map((user) => (
						<UserCard 
						key={user.id}
						user={user}
						onAction={handleUserAction}
						isProcessing={isProcessing(user.id)}
						/>
					))}
					</div>
				)}
				</div>
			</div>
		</div>
	</>);
};

// Extracted user card component for better readability
interface UserCardProps {
  user: UserWithInvitationStatus;
  onAction: (user: UserWithInvitationStatus) => void;
  isProcessing: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onAction, isProcessing }) => {
  const isPending = user.hasPendingInvitation;
  
  return (
    <button
      onClick={() => !isProcessing && onAction(user)}
      disabled={isProcessing}
      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
        isProcessing 
          ? 'bg-gray-700 cursor-wait opacity-70' 
          : isPending 
            ? 'bg-gray-700 hover:bg-gray-600' 
            : 'hover:bg-gray-700'
      }`}
    >
      <div className="flex items-center">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-10 h-10 rounded-full mr-3"
        />
        <span className="text-white">{user.login}</span>
      </div>
      
      <div className="flex items-center">
        {isProcessing ? (
          <div className="flex items-center text-blue-400" title="Processing...">
            <FaSpinner size={16} className="mr-1 animate-spin" />
            <span className="text-xs">Processing</span>
          </div>
        ) : isPending ? (
          <div className="flex items-center text-yellow-500" title="Cancel Invitation">
            <FaClock size={16} className="mr-1" />
            <span className="text-xs">Pending</span>
          </div>
        ) : null}
      </div>
    </button>
  );
};

export default UserSearchModal;
