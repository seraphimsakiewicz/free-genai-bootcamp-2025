import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { updateUserGeminiToken } from "@/app/lib/dynamodb";

// POST endpoint to update a user's Gemini token
export async function POST(request: NextRequest) {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);

    
    if (!session || !session.user?.id) {
      return NextResponse.json({
        status: "error",
        message: "Not authenticated"
      }, { status: 401 });
    }
    
    // // Get token from request body
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({
        status: "error",
        message: "Invalid token provided"
      }, { status: 400 });
    }
    
    // // Update user's Gemini token in DynamoDB
    await updateUserGeminiToken(session.user.id, token);
    
    return NextResponse.json({
      status: "success",
      message: "Gemini token updated successfully"
    });
  } catch (error) {
    console.error("Error updating Gemini token:", error);
    return NextResponse.json({
      status: "error",
      message: "Failed to update Gemini token",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 