# 42Pong

A Pong game for 42 students with OAuth authentication.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/42pong.git
cd 42pong
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_42_CLIENT_ID=your_client_id
FORTYTWO_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

**Note**: When accessing the `42_CLIENT_SECRET` in your code, you must use bracket notation since it starts with a number:
```typescript
// Correct way to access it:
process.env["42_CLIENT_SECRET"]

// This will cause an error:
process.env.42_CLIENT_SECRET
```

### Setting up 42 OAuth

1. Go to the 42 Intranet: https://profile.intra.42.fr/oauth/applications
2. Create a new application
3. Set the redirect URI to `http://localhost:3000/api/auth/callback/42-school` (important: this must match exactly)
4. Copy the Client ID and Client Secret to your `.env.local` file

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- 42 OAuth Authentication
- User Profile
- Session Management

## Built With

- [Next.js](https://nextjs.org/) - The React framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
