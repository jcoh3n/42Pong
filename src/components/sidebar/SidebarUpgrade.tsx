import { Box, Flex, Text, Button } from "@radix-ui/themes";

export function SidebarUpgrade() {
  return (
    <Box py="4" px="4">
      <Flex direction="column" gap="2" align="center">
        <Text weight="medium" size="2" align="center">
          Upgrade to Pro
        </Text>
        <Text size="1" color="gray" align="center">
          Get 1 month free and unlock
        </Text>
        <Button size="2" variant="soft" mt="2" style={{ width: '100%' }}>
          Upgrade
        </Button>
      </Flex>
    </Box>
  );
} 