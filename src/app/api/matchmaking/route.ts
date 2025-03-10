import { NextResponse } from "next/server";
import serverAuth from "@/lib/auth/serverAuth";
import { createClient } from "@/libs/supabase/server";
import { addToQueue } from "@/services/matchmaking/queue";

export type MatchmakingResponse = {
	data: {
		inQueue: boolean;
		queueEntry: Database['public']['Tables']['matchmaking_queue']['Row'];
	};
	error: {
		message: string;
		code: string;
	};
};
export async function GET() {
	try {
		// Authenticate user
		const currentUser = await serverAuth();
		if (!currentUser) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		// Check if user is in matchmaking queue
		const { data, error } = await get

	} catch (error) {
		console.error("Error in matchmaking GET route:", error);
		return NextResponse.json({ error: "Failed to fetch queue status" }, { status: 500 });
	}
}

export async function POST() {
	try {
		const currentUser = await serverAuth();
		if (!currentUser) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}
		const { data, error } = await addToQueue(currentUser.id);
		if (error || !data) {
			return NextResponse.json({ error: error?.message }, { status: 500 });
		}
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error in user API route:", error);
		return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
	}
}
