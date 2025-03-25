# Ping Pong Match Tracker

A modern, real-time application built with Next.js and Supabase for tracking real-life ping pong matches. This platform helps players organize games, record scores, manage matchmaking, and track statistics for physical ping pong matches played in real life.

## Features

### Multiple Game Modes
- **Quick Match**: Quickly record casual games with automatic opponent matching
- **Ranked Match**: Track competitive play that affects your ELO rating
- **Challenge Friend**: Send direct invitations to friends for arranged matches

### Robust Matchmaking System
- Smart queue system to find available opponents for real-life games
- Real-time matchmaking notifications when potential opponents are found
- Players can cancel matchmaking requests if desired
- Matchmaking respects player skill levels (in ranked mode)

### Real-Time Score Tracking
- Easy-to-use interface for recording points during physical matches
- Live score updates visible to both players and spectators
- Customizable match settings (points to win: 5, 7, or 11)
- Complete match history and statistics

### Friend System
- Send and receive game invitations to/from friends
- Invitation management (accept, refuse, or cancel)
- Track your gameplay history with friends

### User Profiles
- Personal profiles with customizable avatars
- ELO rating system for competitive players
- Match history and statistics tracking

### Backend Intelligence
- All game winners, matchmaking, and invitation management handled by PostgreSQL Triggers in Supabase
- Efficient database design for real-time operations and data consistency
- Secure authentication and authorization

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Real-time Communication**: Supabase Realtime
- **Authentication**: Supabase Auth
- **Styling**: [Your styling solution - likely CSS modules, styled-components, or Tailwind based on code]

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ping-pong-tracker.git
cd ping-pong-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

## Database Setup

The application relies on a properly configured Supabase instance with the following main tables:
- `matchmaking_queue`: Tracks players looking for real-life opponents
- `matches`: Records ongoing and completed physical matches
- `game_moves`: Stores score updates during gameplay
- `friendly_invitation`: Manages friend challenge invitations
- `users`: Player profiles and authentication

Several PostgreSQL triggers automate:
- Match winner determination
- ELO rating updates
- Matchmaking pairing
- Invitation processing

## Usage

1. Create an account or sign in
2. Choose your preferred game mode:
   - Click "Quick Match" to find an available opponent
   - Select "Ranked Match" to play competitive games
   - Use "Challenge Friend" to invite specific players
3. Play your physical ping pong match
4. Record the scores in real-time through the application
5. Review your statistics and improve your skills!