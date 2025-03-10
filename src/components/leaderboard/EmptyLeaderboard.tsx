import { Table, Text, Flex } from "@radix-ui/themes";
import { GiPingPongBat } from 'react-icons/gi';

export function EmptyLeaderboard() {
  return (
    <Table.Row>
      <Table.Cell colSpan={5}>
        <Flex 
          direction="column" 
          align="center" 
          justify="center" 
          gap="3" 
          className="py-12"
        >
          <GiPingPongBat size={32} className="text-[var(--gray-8)]" />
          <Text align="center" size="3" weight="medium" color="gray">
            Aucun joueur trouvé
          </Text>
          <Text align="center" size="2" color="gray">
            Le classement est vide pour le moment
          </Text>
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
} 