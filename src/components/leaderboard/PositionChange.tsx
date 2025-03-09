import { Text, Flex } from "@radix-ui/themes";
import { CaretUpIcon, CaretDownIcon, DotFilledIcon } from "@radix-ui/react-icons";

interface PositionChangeProps {
  change: number;
}

export function PositionChange({ change }: PositionChangeProps) {
  if (change > 0) {
    return (
      <Flex align="center" gap="1">
        <CaretUpIcon className="text-emerald-500" />
        <Text size="1" color="green" weight="medium">
          {change}
        </Text>
      </Flex>
    );
  }
  
  if (change < 0) {
    return (
      <Flex align="center" gap="1">
        <CaretDownIcon className="text-rose-500" />
        <Text size="1" color="red" weight="medium">
          {Math.abs(change)}
        </Text>
      </Flex>
    );
  }
  
  return (
    <Flex align="center" gap="1">
      <DotFilledIcon className="text-gray-400" />
      <Text size="1" color="gray">
        0
      </Text>
    </Flex>
  );
} 