"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Container, 
  Heading, 
  Card, 
  Flex, 
  Text,
  Switch,
  Select,
  Button,
} from "@radix-ui/themes";
import { userService } from "@/services";

export default function SettingsPage() {
  const { data: session, status } = useSession();
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

  if (status === "loading") {
    return (
      <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
        <Container size="3" py="9">
          <Flex align="center" justify="center" style={{ minHeight: "70vh" }}>
            <Text size="3">Loading...</Text>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <Box style={{ minHeight: "100vh", backgroundColor: "var(--gray-2)" }}>
      <Container size="3" py="9">
        <Flex direction="column" gap="6">
          <Heading size="6">Settings</Heading>

          <Card size="2">
            <Flex direction="column" gap="5" p="5">
              <Heading size="3">Preferences</Heading>

              <Flex justify="between" align="center">
                <Box>
                  <Text as="div" size="2" weight="bold">
                    Notifications
                  </Text>
                  <Text as="div" size="2" color="gray">
                    Receive game and challenge notifications
                  </Text>
                </Box>
                <Switch 
                  checked={preferences.notifications} 
                  onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                />
              </Flex>

              <Flex justify="between" align="center">
                <Box>
                  <Text as="div" size="2" weight="bold">
                    Theme
                  </Text>
                  <Text as="div" size="2" color="gray">
                    Choose your preferred theme
                  </Text>
                </Box>
                <Select.Root 
                  value={preferences.theme} 
                  onValueChange={(value) => handlePreferenceChange('theme', value)}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="system">System</Select.Item>
                    <Select.Item value="light">Light</Select.Item>
                    <Select.Item value="dark">Dark</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex justify="between" align="center">
                <Box>
                  <Text as="div" size="2" weight="bold">
                    Language
                  </Text>
                  <Text as="div" size="2" color="gray">
                    Select your preferred language
                  </Text>
                </Box>
                <Select.Root 
                  value={preferences.language} 
                  onValueChange={(value) => handlePreferenceChange('language', value)}
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="en">English</Select.Item>
                    <Select.Item value="fr">Français</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              {isSaving && (
                <Text size="2" color="gray" align="center">
                  Saving changes...
                </Text>
              )}
            </Flex>
          </Card>

          <Card size="2">
            <Flex direction="column" gap="5" p="5">
              <Heading size="3">Account</Heading>

              <Flex justify="between" align="center">
                <Box>
                  <Text as="div" size="2" weight="bold">
                    Delete Account
                  </Text>
                  <Text as="div" size="2" color="gray">
                    Permanently delete your account and all data
                  </Text>
                </Box>
                <Button color="red" variant="soft">
                  Delete Account
                </Button>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Container>
    </Box>
  );
} 