"use client";

import { useState } from "react";
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

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("en");

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
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
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
                <Select.Root value={theme} onValueChange={setTheme}>
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
                <Select.Root value={language} onValueChange={setLanguage}>
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="en">English</Select.Item>
                    <Select.Item value="fr">Français</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
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