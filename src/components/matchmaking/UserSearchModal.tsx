import React, { useState, useEffect, useCallback } from 'react';
import { UserService } from '@/services/userService';
import { createClient } from '@/libs/supabase/client';
import { Database } from '@/types/database.types';
import { FaSearch, FaTimes } from 'react-icons/fa';

type User = Database['public']['Tables']['Users']['Row'];

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
  currentUserId: string;
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
  currentUserId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userService = new UserService();

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await createClient()
          .from('Users')
          .select('*')
          .ilike('login', `%${searchQuery}%`)
          .neq('id', currentUserId)
          .limit(10);

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        setError('Failed to search users');
        console.error('Error searching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    searchUsers();
  }, [searchQuery, currentUserId]);

  const handleClose = useCallback(() => {
	setSearchQuery('');
	setUsers([]);
	setError(null);

	onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
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

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-400">
              {searchQuery.length < 2 ? 'Type at least 2 characters to search' : 'No users found'}
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user.id)}
                  className="w-full flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="text-white">{user.login}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;
