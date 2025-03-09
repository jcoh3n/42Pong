import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/auth-options";
import { matchService } from "@/services";

// Valid column names for sorting
type SortByColumn = "id" | "user_1_id" | "user_2_id" | "winner_id" | "created_at" | "finished_at" | "user_1_score" | "user_2_score";

export async function GET(
  request: Request
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Extract userId from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.length - 1];

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    
    // Get sortBy parameter and validate it
    const sortByParam = searchParams.get("sortBy") || "created_at";
    // Ensure sortBy is a valid column name
    const sortBy = (["id", "user_1_id", "user_2_id", "winner_id", "created_at", "finished_at", "user_1_score", "user_2_score"].includes(sortByParam) 
      ? sortByParam 
      : "created_at") as SortByColumn;
    
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const matches = await matchService.getMatchesByUserId(userId, {
      page,
      pageSize,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc"
    });
    
    return NextResponse.json(matches);
  } catch (error) {
    console.error(`Error fetching matches:`, error);
    return NextResponse.json({ error: "Failed to fetch user matches" }, { status: 500 });
  }
} 