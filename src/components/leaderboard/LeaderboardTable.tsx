import { Table, Text, Flex, Badge } from "@radix-ui/themes";
import Image from "next/image";
import { type User } from "@/services/userService";
import { PositionChange } from "./PositionChange";
import "./leaderboard.css"; // We'll create this CSS file

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
    <Table.Root variant="surface" className="leaderboard-table">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell width="100px">
            <Text size="2" weight="medium">Position</Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Text size="2" weight="medium">Name</Text>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell align="right" width="120px">
            <Text size="2" weight="medium">ELO</Text>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((item, index) => (
          <Table.Row 
            key={item.user.id} 
            className={`leaderboard-row ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}
          >
            <Table.Cell>
              <Flex align="center" gap="2">
                <Text size="2" weight="medium">{item.position}</Text>
                <PositionChange change={item.positionChange} />
              </Flex>
            </Table.Cell>
            <Table.Cell>
              <Flex align="center" gap="3">
                <div className="relative w-8 h-8 overflow-hidden rounded-full">
                  <Image
                    src={item.user.avatar_url || "https://via.placeholder.com/40"}
                    alt={`${item.user.login}'s avatar`}
                    fill
                    className="object-cover"
                  />
                </div>
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