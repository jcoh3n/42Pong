import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { get42UserData } from "@/utils/api";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    const userData = await get42UserData(session.accessToken as string);
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error in user API route:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
} 