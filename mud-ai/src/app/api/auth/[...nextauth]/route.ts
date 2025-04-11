import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { AuthOptions } from "next-auth"
import { v4 as uuidv4 } from "uuid"
import { getUserByEmail, createUser } from "@/app/lib/dynamodb"
// import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // Google provider configuration
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Credentials provider for custom email/password auth CredentialsProvider({ name:
    // "Credentials", credentials: { email: { label: "Email", type: "email", placeholder:
    //   "email@example.com" }, password: { label: "Password", type: "password" }, }, async
    //   authorize(credentials, req) { // Replace this with your own logic to validate the user, //
    //     e.g. by querying your database for the credentials. const user = await
    //     yourUserAuthFunction(credentials.email, credentials.password) if (user) { // Any object
    //   returned will be saved in the session return user } // Returning null or throwing an error
    //   will cause the sign in to fail return null }, }),
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
            session.user.id = String(dbUser.id);
            // session.user.geminiToken = dbUser.geminiToken || "";
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

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
