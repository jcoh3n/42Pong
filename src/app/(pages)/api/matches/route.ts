import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/libs/auth/auth-options";
import { matchService } from "@/services";

// Valid column names for sorting
type SortByColumn = "id" | "user_1_id" | "user_2_id" | "winner_id" | "created_at" | "finished_at" | "user_1_score" | "user_2_score";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

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
    const onlyCompleted = searchParams.get("onlyCompleted") === "true";

    const matches = await matchService.getAllMatches({
      page,
      pageSize,
      sortBy,
      sortOrder: sortOrder as "asc" | "desc",
      onlyCompleted
    });
    
    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error in matches API route:", error);
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 });
  }
} 