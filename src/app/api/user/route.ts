import { NextResponse } from "next/server";
import serverAuth from "@/lib/auth/serverAuth";
import { NextApiRequest } from "next";
import { NextApiResponse } from "next";

export async function GET() {
  try {
    const currentUser = await serverAuth();

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json(currentUser);
  } catch (error) {
    console.error("Error in user API route:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
} 