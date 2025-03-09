"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Container, 
  Heading, 
  Flex, 
  Text,
  Separator,
} from "@radix-ui/themes";
import { userService } from "@/services";
import PreferencesCard from "./components/preferences_card";
import AccountCard from "./components/account_card";

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [preferences, setPreferences] = useState({
    notifications: true,
    theme: "system",
    language: "en"
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (session?.user?.email) {
        const login = session.user.email.split('@')[0];
        const user = await userService.getUserByLogin(login);
        if (user) {
          setPreferences({
            notifications: user.notifications || true,
            theme: user.theme || "system",
            language: user.language || "en"
          });
        }
      }
    };
    loadUserPreferences();
  }, [session]);

  const handlePreferenceChange = async (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setIsSaving(true);
    
    try {
      if (session?.user?.email) {
        const login = session.user.email.split('@')[0];
        const user = await userService.getUserByLogin(login);
        if (user) {
          await userService.updateUser(user.id, {
            [key]: value
          });
        }
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (session?.user?.email) {
      const login = session.user.email.split('@')[0];
      const user = await userService.getUserByLogin(login);
      if (user) {
        try {
          await userService.deleteUser(user.id);
          router.push('/login');
        } catch (error) {
          console.error('Error deleting account:', error);
        }
      }
    }
  };

  return (
    <Box className="min-h-screen">
      <Container size="3" py="9">
        <Flex direction="column" gap="6">
          <div className="space-y-1">
            <Heading size="6">Settings</Heading>
            <Text size="2" color="gray">
              Manage your account settings and preferences
            </Text>
          </div>

          <Separator size="4" />

          <PreferencesCard 
            preferences={preferences}
            onPreferenceChange={handlePreferenceChange}
            isSaving={isSaving}
          />

          <AccountCard onDeleteAccount={handleDeleteAccount} />
        </Flex>
      </Container>
    </Box>
  );
} 