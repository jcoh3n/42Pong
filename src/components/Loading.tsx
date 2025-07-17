import { Box, Flex } from "@radix-ui/themes";
import { Component as LumaSpin } from "@/components/ui/luma-spin";

export default function Loading() {
  return (
    <Flex align="center" justify="center" style={{ height: "100%", width: "100%" }}>
      <LumaSpin />
    </Flex>
  );
}