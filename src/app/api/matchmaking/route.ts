import { NextResponse } from "next/server";
import serverAuth from "@/libs/auth/serverAuth";
import { createClient } from "@/libs/supabase/server";
import { addToQueue, getPlayerActiveMatch, getPlayerQueueStatus, MatchmakingQueue, removeFromQueue } from "@/services/matchmakingService";
import { Database } from "@/types/database.types";
import { Match } from "@/services/matchService";
import { PostgrestError } from "@supabase/supabase-js";

export type MatchmakingResponse = {
	data?: {
		inQueue: boolean;
		inMatch: boolean;
		queueData: MatchmakingQueue | null;
		matchData: Match | null;
	};
	error?: PostgrestError | string | null;
};

export async function GET(): Promise<NextResponse<MatchmakingResponse>> {
	try {
		// Authenticate user
		const currentUser = await serverAuth();
		if (!currentUser) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const { data: queueData, error: queueError } = await getPlayerQueueStatus(currentUser.id);
		if (queueError) {
			return NextResponse.json({ error: queueError?.message }, { status: 500 });
		}

		// Check if user is in matchmaking queue
		const { data: activeMatch, error: activeMatchError } = await getPlayerActiveMatch(currentUser.id);

		if (activeMatchError) {
			return NextResponse.json({ error: activeMatchError?.message }, { status: 500 });
		}

		return NextResponse.json({ data: {
			inQueue: queueData ? true : false,
			inMatch: activeMatch ? true : false,
			queueData,
			matchData: activeMatch,
		} });
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
		return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
	}
}


export async function DELETE() {
	try {
		const currentUser = await serverAuth();
		if (!currentUser) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const { status, message, error } = await removeFromQueue(currentUser.id);
		if (status === 'error') {
			return NextResponse.json({ error: error?.message }, { status: 500 });
		}

		if (status === 'failed') {
			return NextResponse.json({ message }, { status: 400 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error in matchmaking DELETE route:", error);
		return NextResponse.json({ error: "Failed to remove from queue" }, { status: 500 });
	}
}
