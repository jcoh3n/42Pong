import { Table, Text } from "@radix-ui/themes";

export function LeaderboardHeader() {
  return (
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeaderCell 
          className="w-[80px] sm:w-[100px] font-semibold uppercase tracking-wider py-4 px-3 sm:px-4 bg-[var(--color-background)] sticky top-0 z-10 text-sm"
        >
          <Text size="1" className="hidden sm:block">Position</Text>
          <Text size="1" className="sm:hidden">#</Text>
        </Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell
          className="font-semibold uppercase tracking-wider py-4 px-3 sm:px-4 bg-[var(--color-background)] sticky top-0 z-10 text-sm"
        >
          <Text size="1">Joueur</Text>
        </Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell 
          className="w-[80px] sm:w-[120px] font-semibold uppercase tracking-wider py-4 px-3 sm:px-4 bg-[var(--color-background)] sticky top-0 z-10 text-sm hidden sm:table-cell"
        >
          <Text size="1">Parties</Text>
        </Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell 
          className="w-[80px] sm:w-[100px] font-semibold uppercase tracking-wider py-4 px-3 sm:px-4 bg-[var(--color-background)] sticky top-0 z-10 text-sm hidden sm:table-cell"
        >
          <Text size="1">Win Rate</Text>
        </Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell 
          align="right" 
          className="w-[80px] sm:w-[120px] font-semibold uppercase tracking-wider py-4 px-3 sm:px-4 bg-[var(--color-background)] sticky top-0 z-10 text-sm"
        >
          <Text size="1">ELO</Text>
        </Table.ColumnHeaderCell>
      </Table.Row>
    </Table.Header>
  );
} 