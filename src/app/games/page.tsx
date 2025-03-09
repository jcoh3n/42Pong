"use client";

import { 
  Box, 
  Container, 
  Heading, 
  Text,
  Flex,
  Card,
  Button,
} from "@radix-ui/themes";

export default function GamePage() {
  return (
    <Box className="min-h-screen">
      <Container size="3" py="9">
        <Flex direction="column" gap="6">
          <div className="space-y-1">
            <Heading size="6">Welcome to 42Pong</Heading>
            <Text size="2" color="gray">
              Choose a game mode to start playing
            </Text>
          </div>

          <Flex gap="4" wrap="wrap">
            <Card className="flex-1 min-w-[250px] transition-all duration-200 hover:shadow-lg">
              <Flex direction="column" gap="3" p="5">
                <Heading size="4">Quick Match</Heading>
                <Text size="2" color="gray">
                  Join a random game with another player
                </Text>
                <Button size="3" variant="soft" mt="2">
                  Play Now
                </Button>
              </Flex>
            </Card>

            <Card className="flex-1 min-w-[250px] transition-all duration-200 hover:shadow-lg">
              <Flex direction="column" gap="3" p="5">
                <Heading size="4">Challenge Friend</Heading>
                <Text size="2" color="gray">
                  Send a challenge to a specific player
                </Text>
                <Button size="3" variant="soft" mt="2">
                  Challenge
                </Button>
              </Flex>
            </Card>

            <Card className="flex-1 min-w-[250px] transition-all duration-200 hover:shadow-lg">
              <Flex direction="column" gap="3" p="5">
                <Heading size="4">Practice</Heading>
                <Text size="2" color="gray">
                  Play against AI to improve your skills
                </Text>
                <Button size="3" variant="soft" mt="2">
                  Start Practice
                </Button>
              </Flex>
            </Card>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
} 