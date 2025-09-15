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
import usePreferences from "@/hooks/usePreferences";

export default function SettingsPage() {
  const { data: currentUser, isLoading: isLoadingUser, mutate: mutateCurrentUser } = useCurrentUser();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const preferences = usePreferences();

  const handlePreferenceChange = async (key: string, value: any) => {
	if (isSaving) return ;

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
    <Box className="h-full">
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