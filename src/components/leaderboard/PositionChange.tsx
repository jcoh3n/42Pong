import { Text, Flex } from "@radix-ui/themes";
import { CaretUpIcon, CaretDownIcon, DotFilledIcon } from "@radix-ui/react-icons";

interface PositionChangeProps {
  change: number;
}

// CSS color variables from the original CSS
const colors = {
  positive: "#10b981",
  negative: "#ef4444",
  neutral: "#9ca3af"
};

export function PositionChange({ change }: PositionChangeProps) {
  if (change > 0) {
    return (
      <Flex align="center" gap="1">
        <CaretUpIcon style={{ color: colors.positive }} />
        <Text size="1" style={{ color: colors.positive }} weight="medium">
          {change}
        </Text>
      </Flex>
    );
  }
  
  if (change < 0) {
    return (
      <Flex align="center" gap="1">
        <CaretDownIcon style={{ color: colors.negative }} />
        <Text size="1" style={{ color: colors.negative }} weight="medium">
          {Math.abs(change)}
        </Text>
      </Flex>
    );
  }
  
  return (
    <Flex align="center" gap="1">
      <DotFilledIcon style={{ color: colors.neutral }} />
      <Text size="1" style={{ color: colors.neutral }}>
        0
      </Text>
    </Flex>
  );
} 