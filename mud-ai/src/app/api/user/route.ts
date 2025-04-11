import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getUserByEmail } from "@/app/lib/dynamodb";

// GET endpoint to retrieve user data
export async function GET() {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({
        status: "error",
        message: "Not authenticated"
      }, { status: 401 });
    }
    
    // Get user data from DynamoDB
    const dbUser = await getUserByEmail(session.user.email);
    
    if (!dbUser) {
      return NextResponse.json({
        status: "error",
        message: "User not found in database"
      }, { status: 404 });
    }
    
    return NextResponse.json({
      status: "success",
      user: {
        id: dbUser.id,
        email: dbUser.email,
        provider: dbUser.provider,
        hasGeminiToken: !!dbUser.geminiToken,
      }
    });
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return NextResponse.json({
      status: "error",
      message: "Failed to retrieve user data",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}