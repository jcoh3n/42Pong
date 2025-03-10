"use client";

import { 
  Card, 
  Flex, 
  Box, 
  Text, 
  Switch, 
  Select,
  Heading,
} from "@radix-ui/themes";

interface PreferencesCardProps {
  preferences: {
    notifications: boolean;
    theme: string;
    language: string;
  };
  onPreferenceChange: (key: string, value: any) => void;
  isSaving: boolean;
}

export default function PreferencesCard({ 
  preferences, 
  onPreferenceChange,
  isSaving 
}: PreferencesCardProps) {
  return (
    <Card size="2" className="transition-all duration-200 hover:shadow-lg">
      <Flex direction="column" gap="5" p="5">
        <Flex justify="between" align="center">
          <Heading size="3">Preferences</Heading>
          {isSaving && (
            <Text size="2" color="gray">
              Saving...
            </Text>
          )}
        </Flex>

        <Flex direction="column" gap="4">
          <Flex justify="between" align="center" className="p-2 rounded-lg hover:bg-neutral-700 transition-colors">
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
              onCheckedChange={(checked: boolean) => onPreferenceChange('notifications', checked)}
              className="data-[state=checked]:bg-blue-600"
            />
          </Flex>

          <Flex justify="between" align="center" className="p-2 rounded-lg hover:bg-neutral-700 transition-colors">
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
              onValueChange={(value: string) => onPreferenceChange('theme', value)}
            >
              <Select.Trigger className="w-32" />
              <Select.Content>
                <Select.Item value="system">System</Select.Item>
                <Select.Item value="light">Light</Select.Item>
                <Select.Item value="dark">Dark</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>

          <Flex justify="between" align="center" className="p-2 rounded-lg hover:bg-neutral-700 transition-colors">
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
              onValueChange={(value: string) => onPreferenceChange('language', value)}
            >
              <Select.Trigger className="w-32" />
              <Select.Content>
                <Select.Item value="en">English</Select.Item>
                <Select.Item value="fr">Français</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
} 