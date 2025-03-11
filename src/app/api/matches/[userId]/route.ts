import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/auth-options";
import { Match, matchService } from "@/services";
import serverAuth from "@/lib/auth/serverAuth";
import { NextApiRequest } from "next";

// Valid column names for sorting
type SortByColumn = "id" | "user_1_id" | "user_2_id" | "winner_id" | "created_at" | "finished_at" | "user_1_score" | "user_2_score";

export async function GET(
  request: NextRequest
) {
  try {
    const currentUser = await serverAuth();
    
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

	const userId = request.nextUrl.searchParams.get('userId');
	if (!userId) {
		return NextResponse.json({ error: "User ID is required" }, { status: 400 });
	}

	const page = request.nextUrl.searchParams.get('page');
	const limit = request.nextUrl.searchParams.get('limit');
	const sortBy = request.nextUrl.searchParams.get('sortBy');
	const order = request.nextUrl.searchParams.get('order');

    // Ensure sortBy is a valid column name
    const validColumns: string[] = ["id", "user_1_id", "user_2_id", "winner_id", "created_at", "finished_at", "user_1_score", "user_2_score"];
    var sort: keyof Match;
	if (validColumns.includes(sortBy as string)) {
      sort = sortBy as keyof Match;
    } else {
		sort = 'created_at' as keyof Match;
	}

    // Ensure order is a valid sort order
    let sortOrder = (order as string)?.toLowerCase();
    if (!['asc', 'desc'].includes(sortOrder)) {
      sortOrder = 'desc';
    }

    // Convert page to a number and provide a default value
    var pageNumber = page ? parseInt(page as string, 10) : 1;
    if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = 1;
    }

    // Convert limit to a number and provide a default value
    var pageSize = limit ? parseInt(limit as string, 10) : 10;
    if (isNaN(pageSize) || pageSize < 1) {
		pageSize = 10;
    }

    const matches = await matchService.getMatchesByUserId(userId as string, {
      page: pageNumber,
      pageSize,
      sortBy: sort,
      sortOrder: sortOrder as "asc" | "desc"
    });
    
    return NextResponse.json(matches);
  } catch (error) {
    console.error(`Error fetching matches:`, error);
    return NextResponse.json({ error: "Failed to fetch user matches" }, { status: 500 });
  }
} 