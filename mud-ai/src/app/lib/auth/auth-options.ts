import GoogleProvider from "next-auth/providers/google"
import { AuthOptions } from "next-auth"
import { v4 as uuidv4 } from "uuid"
import { getUserByEmail, createUser } from "@/app/lib/dynamodb"

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // Google provider configuration
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    // Use JSON Web Tokens (JWT) for session handling
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Only handle Google sign-ins
      if (account?.provider !== "google") return true;
      
      try {
        // Check if user already exists in DynamoDB
        const email = user.email as string;
        const existingUser = await getUserByEmail(email);
        
        if (!existingUser) {
          // Create new user with UUID
          const newUser = {
            id: uuidv4(),
            email,
            provider: "google",
            geminiToken: "", // Empty string initially
          };
          
          await createUser(newUser);
          console.log(`Created new user in DynamoDB: ${email}`);
        } else {
          console.log(`User already exists in DynamoDB: ${email}`);
        }
        
        return true;
      } catch (error) {
        console.error("Error saving user to DynamoDB:", error);
        // Still allow sign-in even if DB storage fails
        return true;
      }
    },
    async session({ session }) {
      // Add user ID from DynamoDB to the session
      if (session.user?.email) {
        try {
          const dbUser = await getUserByEmail(session.user.email);
          if (dbUser) {
            console.log("dbUser", dbUser);
            // The ID is stored as an AttributeValue object with an S property
            session.user.id = String(dbUser.id.S);
            
            // The geminiToken is already decrypted in the getUserByEmail function
            // and returned as an AttributeValue object with an S property
            session.user.geminiToken = dbUser.geminiToken ? String(dbUser.geminiToken.S) : "";
          }
        } catch (error) {
          console.error("Error fetching user data for session:", error);
        }
      }
      return session;
    },
  },
  // A secret is required to encrypt the session token
  secret: process.env.NEXTAUTH_SECRET,
} 