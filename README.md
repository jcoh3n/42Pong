# 42Pong

A real-time ping pong match tracker for 42 students.

## Live Platform

Access the application at: **https://42-pong.vercel.app/**

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
git clone https://github.com/yourusername/42Pong.git
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

For detailed information about the project, see [ABOUT.md](./ABOUT.md).