# 42Pong

A real-time ping pong match tracker for 42 students.

## Live Platform

Access the application at: **https://42-pong.vercel.app/**

## Screenshots

### Dashboard & Matchmaking
Real-time matchmaking and player statistics:

![Dashboard](https://github.com/jcoh3n/42Pong/public/screenshots/dashboard.png)
*Player dashboard with live matchmaking, leaderboard preview, and match history*

### Game Modes
Choose from three different ways to play:

![Game Modes](https://github.com/jcoh3n/42Pong/public/screenshots/game-modes.png)
*Quick Match, Ranked Match, and Challenge Friend options*



### Leaderboard
Global ranking system with ELO ratings:

![Leaderboard](https://github.com/jcoh3n/42Pong/public/screenshots/leaderboard.png)
*Complete leaderboard with player rankings, match counts, and win rates*

### Player Profile
Detailed statistics and performance tracking:

![Player Profile](https://github.com/jcoh3n/42Pong/public/screenshots/profile.png)
*Individual player profile showing ELO rating and match statistics*

## Features

- **Multiple Game Modes**: Quick matches, ranked games, and friend challenges
- **Real-Time Matchmaking**: Smart queue system to find opponents
- **Live Score Tracking**: Record and track scores during physical matches
- **ELO Rating System**: Competitive ranking for players
- **Friend System**: Send invitations and challenge friends
- **Match History**: Complete statistics and gameplay history

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: 42 School OAuth + NextAuth
- **Real-time**: Supabase Realtime subscriptions
- **Deployment**: Vercel

## Local Development

1. Clone and install:
```bash
git clone https://github.com/jcoh3n/42Pong.git
cd 42Pong
npm install
```

2. Configure environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_42_CLIENT_ID=your_42_client_id
FORTYTWO_CLIENT_SECRET=your_42_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

3. Run development server:
```bash
npm run dev
```

## Usage

1. Sign in with your 42 School account
2. Choose a game mode (Quick Match, Ranked, or Challenge Friend)
3. Play your physical ping pong match
4. Record scores in real-time
5. Track your progress and statistics
