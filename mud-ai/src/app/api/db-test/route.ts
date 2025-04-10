import { NextResponse } from "next/server";
import { testDynamoDBConnection } from "@/app/lib/dynamodb";

export async function GET() {
  try {
    const connected = await testDynamoDBConnection();
    
    if (connected) {
      return NextResponse.json({
        status: "success",
        message: "Connected to DynamoDB successfully"
      });
    } else {
      return NextResponse.json({
        status: "error",
        message: "Failed to connect to DynamoDB"
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error testing DynamoDB connection:", error);
    return NextResponse.json({
      status: "error",
      message: "Failed to connect to DynamoDB",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 