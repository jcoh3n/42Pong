import React, { useState } from 'react';
import { Box, Container, Text, Flex, Button } from "@radix-ui/themes";
import MatchInfo from './MatchInfo';
import ScoreButtons from './ScoreButtons';
import WinPopup from './WinPopup';
import LosePopup from './LosePopup';

// Mock data for development
const mockMatch = {
    id: 'dev-match-1',
    status: 'in_progress',
    user_1_id: 'current-user',
    user_2_id: 'opponent',
    user_1_score: 0,
    user_2_score: 0,
    winner_id: null,
};

const mockCurrentUser = {
    id: 'current-user',
    login: 'Developer',
    avatar_url: '',
};

const mockOpponent = {
    id: 'opponent',
    login: 'Test Opponent',
    avatar_url: '',
};

const MatchPageDev = () => {
    const [match, setMatch] = useState(mockMatch);
    const [showWinPopup, setShowWinPopup] = useState(false);
    const [showLosePopup, setShowLosePopup] = useState(false);

    // Simulate score increment
    const incrementScore = () => {
        setMatch(prev => ({
            ...prev,
            user_1_score: prev.user_1_score + 1,
        }));

        // Check for win condition (for example, first to 11)
        if (match.user_1_score + 1 >= 11) {
            setMatch(prev => ({
                ...prev,
                status: 'completed',
                winner_id: 'current-user',
            }));
            setShowWinPopup(true);
        }
    };

    // Simulate opponent scoring
    const incrementOpponentScore = () => {
        setMatch(prev => ({
            ...prev,
            user_2_score: prev.user_2_score + 1,
        }));

        // Check for lose condition
        if (match.user_2_score + 1 >= 11) {
            setMatch(prev => ({
                ...prev,
                status: 'completed',
                winner_id: 'opponent',
            }));
            setShowLosePopup(true);
        }
    };

    // Simulate forfeit
    const forfeitMatch = () => {
        setMatch(prev => ({
            ...prev,
            status: 'completed',
            winner_id: 'opponent',
        }));
        setShowLosePopup(true);
    };

    // Reset match
    const resetMatch = () => {
        setMatch(mockMatch);
        setShowWinPopup(false);
        setShowLosePopup(false);
    };

    return (
        <Box className="min-h-screen">
            <Container size="3" py="9">
                {/* Win Popup */}
                <WinPopup
                    isOpen={showWinPopup}
                    onClose={resetMatch}
                />

                {/* Lose Popup */}
                <LosePopup
                    isOpen={showLosePopup}
                    onClose={resetMatch}
                />

                <Flex direction="column" gap="6" align="center">
                    {/* Match information */}
                    <MatchInfo
                        currentUser={mockCurrentUser}
                        opponent={mockOpponent}
                        match={match}
                    />

                    {/* Score buttons */}
                    <Flex gap="6" className="mt-auto mb-6" justify="center">
                        <Button
                            size="4"
                            variant="soft"
                            className="h-20 w-40 text-xl transition-all duration-200 hover:scale-105"
                            onClick={incrementScore}
                        >
                            {mockCurrentUser.login}
                        </Button>

                        <Button
                            size="4"
                            variant="soft"
                            className="h-20 w-40 text-xl transition-all duration-200 hover:scale-105"
                            onClick={incrementOpponentScore}
                        >
                            {mockOpponent.login}
                        </Button>
                    </Flex>

                    {/* Dev controls */}
                    <Flex gap="4">
                        <Button
                            size="2"
                            variant="soft"
                            onClick={resetMatch}
                        >
                            Reset Match
                        </Button>
                        <Button
                            size="2"
                            variant="soft"
                            color="red"
                            onClick={forfeitMatch}
                        >
                            Forfeit Match
                        </Button>
                    </Flex>
                </Flex>
            </Container>
        </Box>
    );
};

export default MatchPageDev; 