import { useState } from "react";
import { Button, Flex, Popover, Box, Text, TextField } from "@radix-ui/themes";
import { CalendarIcon } from "@radix-ui/react-icons";

// Mock date range for the example
const DEFAULT_START_DATE = "Dec 27, 2023";
const DEFAULT_END_DATE = "Jan 03, 2024";

export function DateRangeSelector() {
  const [startDate, setStartDate] = useState(DEFAULT_START_DATE);
  const [endDate, setEndDate] = useState(DEFAULT_END_DATE);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleApply = () => {
    // In a real app, you would handle the date selection here
    setIsOpen(false);
  };
  
  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <Button variant="soft" color="gray" size="2">
          <CalendarIcon />
          <Text size="2">{startDate} - {endDate}</Text>
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <Box p="3" style={{ width: "300px" }}>
          <Flex direction="column" gap="3">
            <Box>
              <Text as="label" size="2" mb="1" weight="medium">Start Date</Text>
              <TextField 
                placeholder="Start date" 
                value={startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                size="2"
              />
            </Box>
            <Box>
              <Text as="label" size="2" mb="1" weight="medium">End Date</Text>
              <TextField 
                placeholder="End date" 
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                size="2"
              />
            </Box>
            <Flex gap="2" mt="2" justify="end">
              <Button 
                variant="soft" 
                color="gray" 
                size="2" 
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button size="2" onClick={handleApply}>
                Apply Range
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Popover.Content>
    </Popover.Root>
  );
} 