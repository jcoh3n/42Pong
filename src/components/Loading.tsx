import { Box, Flex } from "@radix-ui/themes";

export default function Loading() {
  return (
    <Flex align="center" justify="center" style={{ height: "100%", width: "100%" }}>
      <Box className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
    </Flex>
  );
}