import Image from "next/image";
import { Card, Flex, Text, Avatar } from "@radix-ui/themes";
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
    <Card size="3" style={{ width: "100%" }}>
      <Flex align="center" gap="4" direction="column" py="4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-violet-500 shadow-lg">
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
          <Text size="6" weight="bold" className="text-center">
            {user.login}
          </Text>
          <Text size="2" color="gray" className="text-center">
            42 Login • Joined {new Date(user.created_at).toLocaleDateString()}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
} 