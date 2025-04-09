import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
// import CredentialsProvider from "next-auth/providers/credentials"

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // Google provider configuration
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Credentials provider for custom email/password auth
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email", placeholder: "email@example.com" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials, req) {
    //     // Replace this with your own logic to validate the user,
    //     // e.g. by querying your database for the credentials.
    //     const user = await yourUserAuthFunction(credentials.email, credentials.password)
    //     if (user) {
    //       // Any object returned will be saved in the session
    //       return user
    //     }
    //     // Returning null or throwing an error will cause the sign in to fail
    //     return null
    //   },
    // }),
  ],
  session: {
    // Use JSON Web Tokens (JWT) for session handling
    strategy: "jwt",
  },
  // A secret is required to encrypt the session token
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
