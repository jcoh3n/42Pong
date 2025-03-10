"use client";

import { useState, useEffect } from "react";
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
import useCurrentUser from "@/hooks/useCurrentUser";

export default function SettingsPage() {
  const { data: currentUser, isLoading: isLoadingUser, mutate: mutateCurrentUser } = useCurrentUser();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const [preferences, setPreferences] = useState({
    notifications: currentUser?.notifications || true,
    theme: global?.window?.localStorage.getItem('theme') as 'inherit' | 'dark' | 'light' || 'inherit',
    language: "en"
  });

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (currentUser?.id) {
        const user = await userService.getUserById(currentUser.id);
        if (user) {
          setPreferences({
            notifications: user.notifications || true,
            theme: user.theme as 'inherit' | 'dark' | 'light' || 'inherit',
            language: user.language || "en"
          });
        }
      }
    };
    loadUserPreferences();
  }, [currentUser]);

  const handlePreferenceChange = async (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setIsSaving(true);

    try {
      if (currentUser?.id) {
        await userService.updateUser(currentUser.id, {
          [key]: value
        });

		mutateCurrentUser();
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (currentUser?.id) {
      try {
        await userService.deleteUser(currentUser.id);
        router.push('/login');

		  mutateCurrentUser();
        } catch (error) {
          console.error('Error deleting account:', error);
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
          />

          <AccountCard onDeleteAccount={handleDeleteAccount} />
        </Flex>
      </Container>
    </Box>
  );
} 