# 42Pong

A real-time ping pong match tracker for 42 students.

## Live Platform

**https://42-pong.vercel.app/**

## Features

- Multiple game modes: Quick matches, ranked games, friend challenges
- Real-time matchmaking system
- Live score tracking during matches
- ELO rating system for competitive ranking
- Friend system with invitations
- Complete match history and statistics

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: 42 School OAuth + NextAuth
- **Real-time**: Supabase Realtime subscriptions
- **Deployment**: Vercel

## Development Setup

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
2. Choose a game mode
3. Play your physical ping pong match
4. Record scores in real-time
5. Track your progress and statistics

## Contributors

- [@me](https://github.com/jcoh3n)
- [@iibabyy](https://github.com/iibabyy)
