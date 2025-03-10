import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session } = useSession();

  return {
    user: session?.user ? {
      id: session.user.id as string,
      name: session.user.name,
      email: session.user.email,
    } : null
  };
} 