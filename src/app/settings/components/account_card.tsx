"use client";

import { 
  Card, 
  Flex, 
  Box, 
  Text, 
  Button,
  Heading,
  Dialog,
} from "@radix-ui/themes";

interface AccountCardProps {
  onDeleteAccount: () => void;
}

export default function AccountCard({ onDeleteAccount }: AccountCardProps) {
  return (
    <Card size="2" className="transition-all duration-200 hover:shadow-lg">
      <Flex direction="column" gap="5" p="5">
        <Heading size="3">Account</Heading>

        <Flex direction="column" gap="4">
          <Flex justify="between" align="center" className="p-2 rounded-lg hover:bg-neutral-700 transition-colors">
            <Box>
              <Text as="div" size="2" weight="bold">
                Delete Account
              </Text>
              <Text as="div" size="2" color="gray">
                Permanently delete your account and all data
              </Text>
            </Box>
            <Dialog.Root>
              <Dialog.Trigger>
                <Button color="red" variant="soft">
                  Delete Account
                </Button>
              </Dialog.Trigger>

              <Dialog.Content>
                <Dialog.Title>Delete Account</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                  Are you sure you want to delete your account? This action cannot be undone.
                </Dialog.Description>

                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button variant="solid" color="red" onClick={onDeleteAccount}>
                      Delete Account
                    </Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
} 