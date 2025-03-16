import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Database } from '@/types/database.types';
import useCurrentUser from '@/hooks/useCurrentUser';
import { generatePassword } from '@/libs/utils/auth';

export default function useSupabase() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient<Database>> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: currentUser, isLoading: isUserLoading, error: userError } = useCurrentUser();

  useEffect(() => {
    if (isUserLoading || userError) {
      return;
    }

    const initSupabase = async () => {
      try {
        setIsLoading(true);
        
        if (!currentUser || !currentUser.email || !currentUser.login) {
          setSupabase(null);
          return;
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Supabase URL or Anon Key is missing');
        }

        const client = createClient<Database>(supabaseUrl, supabaseAnonKey);
        
        // Check if user is already logged in
        const { data, error: authError } = await client.auth.getUser();
        
        // If not logged in, attempt to sign in
        if (authError || !data.user) {
          const password = generatePassword(currentUser.login, currentUser.email);
          const { error: signInError } = await client.auth.signInWithPassword({
            email: currentUser.email,
            password: password,
          });
          
          if (signInError) {
            throw signInError;
          }
        }
        
        setSupabase(client);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setSupabase(null);
      } finally {
        setIsLoading(false);
      }
    };

    initSupabase();
  }, [currentUser, isUserLoading, userError]);

  return { supabase, isLoading, error };
}
