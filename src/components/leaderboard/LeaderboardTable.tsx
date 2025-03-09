import { Table, Text, Flex, Badge, Avatar, Box } from "@radix-ui/themes";
import { type User } from "@/services/userService";
import { PositionChange } from "./PositionChange";

interface LeaderboardData {
  position: number;
  user: User;
  positionChange: number;
  changeClass: string;
}

interface LeaderboardTableProps {
  data: LeaderboardData[];
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  return (
    <Table.Root 
      size="2" 
      style={{ 
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0
      }}
    >
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell 
            width="100px"
            style={{
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '12px 16px',
            }}
          >
            <Text size="2" weight="medium">Position</Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            style={{
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '12px 16px',
            }}
          >
            <Text size="2" weight="medium">Name</Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell 
            align="right" 
            width="120px"
            style={{
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '12px 16px',
            }}
          >
            <Text size="2" weight="medium">ELO</Text>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((item, index) => (
          <Table.Row 
            key={item.user.id} 
            style={{
              transition: 'background-color 0.2s',
            }}
          >
            <Table.Cell>
              <Flex align="center" gap="2">
                <Text size="2" weight="medium">{item.position}</Text>
                <PositionChange change={item.positionChange} />
              </Flex>
            </Table.Cell>
            <Table.Cell>
              <Flex align="center" gap="3">
                <Avatar
                  size="2"
                  src={item.user.avatar_url || "https://via.placeholder.com/40"}
                  fallback={item.user.login.substring(0, 2).toUpperCase()}
                  radius="full"
                />
                <Text size="2" weight="medium">{item.user.login}</Text>
              </Flex>
            </Table.Cell>
            <Table.Cell align="right">
              <Badge variant="soft" color="gray" radius="full">
                <Text size="2" weight="medium" className="font-mono">
                  {item.user.elo_score}
                </Text>
              </Badge>
            </Table.Cell>
          </Table.Row>
        ))}
        {data.length === 0 && (
          <Table.Row>
            <Table.Cell colSpan={3}>
              <Text align="center" size="2" color="gray">
                No players found
              </Text>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  );
} 