import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { encrypt } from "./crypto";

// Initialize the DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Create a document client for easier handling of items
export const docClient = DynamoDBDocumentClient.from(client);

// Table name
export const USER_TABLE_NAME = process.env.DYNAMODB_USER_TABLE || "Users";

// Utility function to get a user by email
export const getUserByEmail = async (email: string) => {
  try {
    // Use ScanCommand with a filter instead of a secondary index
    const params = {
      TableName: USER_TABLE_NAME,
      FilterExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: email }
      },
    };

    const data = await docClient.send(new ScanCommand(params));
    return data.Items?.[0] || null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
};

// Utility function to create a new user
export const createUser = async (userData: {
  id: string;
  email: string;
  provider: string;
  geminiToken?: string;
}) => {
  try {
    // Make a copy of the user data to avoid modifying the original
    const userDataToSave = { ...userData };
    
    // Encrypt the Gemini token if it exists
    if (userDataToSave.geminiToken) {
      const encryptedToken = encrypt(userDataToSave.geminiToken);
      userDataToSave.geminiToken = encryptedToken;
    }
    
    const params = {
      TableName: USER_TABLE_NAME,
      Item: userDataToSave,
    };

    await docClient.send(new PutCommand(params));
    return userData; // Return the original unencrypted user data
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Utility function to update a user's Gemini token
export const updateUserGeminiToken = async (id: string, geminiToken: string) => {
  try {
    if (!id) {
      throw new Error("Id not provided");
    }

    // Encrypt the token before storing it
    const encryptedToken = encrypt(geminiToken);

    // Update the user with the new encrypted token
    const params = {
      TableName: USER_TABLE_NAME,
      Key: {
        id: id,
      },
      UpdateExpression: "set geminiToken = :token",
      ExpressionAttributeValues: {
        ":token": encryptedToken,
      },
      ReturnValues: "UPDATED_NEW" as const,
    };

    await docClient.send(new UpdateCommand(params));
    return true;
  } catch (error) {
    console.error("Error updating Gemini token:", error);
    throw error;
  }
};

// Test connection to DynamoDB
export const testDynamoDBConnection = async () => {
  try {
    // Just attempt to query the Users table
    const params = {
      TableName: USER_TABLE_NAME,
      Limit: 1,
    };
    
    const data = await docClient.send(new ScanCommand(params));
    console.log("Successfully connected to DynamoDB:", data);
    return true;
  } catch (error) {
    console.error("Error connecting to DynamoDB:", error);
    return false;
  }
}; 