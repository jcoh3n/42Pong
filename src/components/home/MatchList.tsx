import React from "react";
import {
  Box,
  Card,
  Flex,
  Text,
  Badge,
  Avatar,
  Separator,
} from "@radix-ui/themes";
import { FaTrophy, FaRegSadTear, FaClock, FaGamepad } from "react-icons/fa";
import { Match } from "@/services/matchService";
import { FetchedUser } from "@/services/userService";

interface MatchListProps {
  matches: Match[];
  currentUser: FetchedUser | null;
  topPlayers: FetchedUser[];
  limit?: number;
}

const MatchList: React.FC<MatchListProps> = ({
  matches = [],
  currentUser,
  topPlayers = [],
  limit,
}) => {
  // Calculer le résultat des matchs pour l'affichage
  const getMatchResult = (match: Match) => {
    if (!match || !currentUser)
      return {
        result: "Inconnu",
        color: "rgba(255, 255, 255, 0.7)",
        eloChange: "?",
        icon: null,
      };

    // Pour les matchs non-ranked, utiliser un symbole discret
    let eloChange = "—"; // Tiret cadratin pour indiquer neutralité
    const isRankedMatch = getMatchType(match) === "ranked";
    if (isRankedMatch) {
      eloChange =
        currentUser.id === match.user_1_id
          ? match.user_1_elo_change?.toString() || "—"
          : match.user_2_elo_change?.toString() || "—";
    }

    if (match.winner_id === currentUser.id) {
      return {
        result: "Victoire",
        color: "#4ade80", // Vert clair
        eloChange: eloChange,
        icon: <FaTrophy size={14} color="#4ade80" />,
      };
    } else {
      return {
        result: "Défaite",
        color: "#f87171", // Rouge clair
        eloChange: eloChange,
        icon: <FaRegSadTear size={14} color="#f87171" />,
      };
    }
  };

  // Récupérer les informations de l'adversaire
  const getOpponent = (match: Match) => {
    if (!currentUser) return null;

    const opponentId =
      match.user_1_id === currentUser.id ? match.user_2_id : match.user_1_id;
    return topPlayers.find((player) => player.id === opponentId) || null;
  };

  // Obtenir le score de l'utilisateur actuel
  const getUserScore = (match: Match) => {
    if (!currentUser) return 0;
    return match.user_1_id === currentUser.id
      ? match.user_1_score
      : match.user_2_score;
  };

  // Obtenir le score de l'adversaire
  const getOpponentScore = (match: Match) => {
    if (!currentUser) return 0;
    return match.user_1_id === currentUser.id
      ? match.user_2_score
      : match.user_1_score;
  };

  // Formater la date du match
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Obtenir la couleur du badge selon le type de match
  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case "ranked":
        return "linear-gradient(135deg, #007BFF, #0056B3)"; // Bleu pour ranked
      case "friendly":
        return "linear-gradient(135deg, #FF9800, #F57C00)"; // Orange pour friendly
      case "normal":
      default:
        return "linear-gradient(135deg, #4CAF50, #388E3C)"; // Vert pour normal/quick
    }
  };

  // Obtenir le label du type de match
  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case "ranked":
        return "Ranked";
      case "friendly":
        return "Friend";
      case "normal":
      default:
        return "Quick";
    }
  };

  // Obtenir le type de match réel (vérifier les deux champs possibles)
  const getMatchType = (match: Match) => {
    const matchType = match.type || "normal";
    console.log(
      `Match ${match.id} - match_type: ${match.type}, type: ${match.type}, final: ${matchType}`
    );
    return matchType;
  };

  const displayedMatches = limit ? matches.slice(0, limit) : matches;

  if (displayedMatches.length === 0) {
    return (
      <Card
        style={{
          padding: "2rem",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box style={{ marginBottom: "1rem" }}>
          <FaGamepad size={48} color="rgba(255, 255, 255, 0.3)" />
        </Box>
        <Text size="3" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
          Aucun match récent
        </Text>
        <Text
          size="2"
          style={{ color: "rgba(255, 255, 255, 0.5)", marginTop: "0.5rem" }}
        >
          Lancez un match pour commencer !
        </Text>
      </Card>
    );
  }

  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {displayedMatches.map((match) => {
        const result = getMatchResult(match);
        const opponent = getOpponent(match);
        const userScore = getUserScore(match);
        const opponentScore = getOpponentScore(match);
        const isRanked = getMatchType(match) === "ranked";

        return (
          <Card
            key={match.id}
            style={{
              padding: "1rem",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            className="hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)]"
          >
            <Flex justify="between" align="center">
              {/* Informations du match - Gauche */}
              <Flex align="center" gap="3" style={{ flex: 1 }}>
                {/* Avatar et nom de l'adversaire */}
                <Avatar
                  size="2"
                  src={opponent?.avatar_url || "https://via.placeholder.com/32"}
                  fallback={
                    opponent?.login?.substring(0, 2).toUpperCase() || "??"
                  }
                  radius="full"
                />

                <Box>
                  <Text size="2" weight="medium" style={{ color: "white" }}>
                    vs {opponent?.login || "Inconnu"}
                  </Text>
                  <Flex align="center" gap="2" style={{ marginTop: "0.25rem" }}>
                    <FaClock size={10} color="rgba(255, 255, 255, 0.5)" />
                    <Text
                      size="1"
                      style={{ color: "rgba(255, 255, 255, 0.5)" }}
                    >
                      {formatDate(match.created_at)}
                    </Text>
                  </Flex>
                </Box>
              </Flex>

              {/* Score et ELO - Milieu */}
              <Flex
                direction="column"
                align="center"
                gap="1"
                style={{ flex: 1 }}
              >
                <Text size="3" weight="bold" style={{ color: "white" }}>
                  {userScore} - {opponentScore}
                </Text>
                {/* Affichage ELO centré */}
                <Text
                  size="1"
                  weight="medium"
                  style={{
                    color: isRanked
                      ? result.eloChange.startsWith("+")
                        ? "#4ade80"
                        : result.eloChange.startsWith("-")
                        ? "#f87171"
                        : "rgba(255, 255, 255, 0.7)"
                      : "rgba(255, 255, 255, 0.3)",
                    fontFamily: "monospace",
                  }}
                >
                  {isRanked && result.eloChange}
                </Text>
              </Flex>

              {/* Badge et résultat - Droite */}
              <Flex
                direction="column"
                align="center"
                gap="2"
                style={{ flex: 1 }}
              >
                {/* Badge du type de match */}
                <Badge
                  variant="solid"
                  style={{
                    background: getMatchTypeColor(getMatchType(match)),
                    fontSize: "0.7rem",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "12px",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {getMatchTypeLabel(getMatchType(match))}
                </Badge>

                {/* Résultat */}
                <Flex align="center" gap="1">
                  {result.icon}
                  <Text
                    size="2"
                    weight="medium"
                    style={{ color: result.color }}
                  >
                    {result.result}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        );
      })}
    </Box>
  );
};

export default MatchList;
