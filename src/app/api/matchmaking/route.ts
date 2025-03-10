import { NextResponse } from "next/server";
import serverAuth from "@/lib/auth/serverAuth";
import { createClient } from "@/libs/supabase/server";
import { addToQueue } from "@/services/matchmaking/queue";

export async function POST() {
  try {
    const currentUser = await serverAuth();

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

	const { data, error } = await addToQueue(currentUser.id);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in user API route:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
} 