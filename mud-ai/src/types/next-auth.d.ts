import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      id?: string;
      geminiToken?: string;
    } & DefaultSession["user"]
  }

  /**
   * Extend the built-in user types
   */
  interface User {
    id?: string;
    geminiToken?: string;
  }
}