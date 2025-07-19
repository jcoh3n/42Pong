import { Box, Flex } from "@radix-ui/themes";
import PongPaddle from "@/components/PongPaddle/PongPaddle";

export default function Loading() {
  return (
    <Flex align="center" justify="center" style={{ height: "100%", width: "100%" }}>
      <PongPaddle />
    </Flex>
  );
}