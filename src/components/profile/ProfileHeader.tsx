import Image from "next/image";
import { Card, Flex, Text } from "@radix-ui/themes";
import { User } from "@/services";
import React from 'react';
import { useSession } from "next-auth/react";

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { data: session } = useSession();
  const [imageError, setImageError] = React.useState(false);

  // Utiliser l'image de la session (qui vient de l'API 42) si disponible
  const avatarUrl = imageError 
    ? "/default-avatar.svg" 
    : (session?.user?.image || user.avatar_url || "/default-avatar.svg");

  return (
    <Card size="3" style={{ 
      width: "100%",
      background: "linear-gradient(135deg, var(--gray-2), var(--gray-1))",
      border: "1px solid var(--gray-6)",
    }}>
      <Flex align="center" gap="4" direction="column" py="6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-violet-500 shadow-lg" style={{
          borderColor: "var(--violet-6)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}>
          <Image
            src={avatarUrl}
            alt={`${user.login}'s profile`}
            width={128}
            height={128}
            className="object-cover"
            onError={() => setImageError(true)}
            priority
          />
        </div>
        
        <Flex direction="column" align="center" gap="2">
          <Text size="6" weight="bold" style={{ color: "var(--gray-12)" }}>
            {user.login}
          </Text>
          <Text size="2" style={{ color: "var(--gray-11)" }}>
            42 Login • Joined {new Date(user.created_at).toLocaleDateString()}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
} 