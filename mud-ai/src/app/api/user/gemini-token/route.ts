import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { updateUserGeminiToken } from "@/app/lib/dynamodb";
import { decrypt } from "@/app/lib/crypto";

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
    
    // Get token from request body
    const { token } = await request.json();

    // Check if token is a string (including empty string)
    if (typeof token !== "string") {
      return NextResponse.json({
        status: "error",
        message: "Invalid key provided"
      }, { status: 400 });
    }
    
    // // Update user's Gemini token in DynamoDB
    await updateUserGeminiToken(session.user.id, token);
    
    return NextResponse.json({
      status: "success",
      message: "Gemini key updated successfully"
    });
  } catch (error) {
    console.error("Error updating Gemini token:", error);
    return NextResponse.json({
      status: "error",
      message: "Failed to update Gemini key",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// GET endpoint to update a user's Gemini token
export async function GET() {
  try {
    // Get session from NextAuth
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({
        status: "error",
        message: "Not authenticated"
      }, { status: 401 });
    }
    
    const token = session?.user?.geminiToken;

    // Check if token is a string (including empty string)
    if (typeof token !== "string" || token === "") {
      return NextResponse.json({
        status: "error",
        message: "Invalid key provided"
      }, { status: 400 });
    }
    

    const decryptedToken = decrypt(token);

    return NextResponse.json({
      status: "success",
      message: "Gemini key updated successfully",
      decryptedToken: decryptedToken
    });
  } catch (error) {
    console.error("Error updating Gemini token:", error);
    return NextResponse.json({
      status: "error",
      message: "Failed to update Gemini key",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 