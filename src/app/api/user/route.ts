import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { get42UserData } from "@/utils/api";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Utiliser directement les données de session au lieu de faire un appel API supplémentaire
    // Cela évite de surcharger l'API 42 avec des requêtes inutiles
    const userData = {
      id: session.user.id,
      login: session.user.login,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image
    };
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error in user API route:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
} 