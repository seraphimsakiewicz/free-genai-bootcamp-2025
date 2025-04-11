"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import AdventureGame from './components/AdventureGame';
import GeminiTokenButton from './components/GeminiTokenButton';

export default function Home() {
  const { data: session } = useSession()

  return (
    <main className="relative min-h-screen">
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        {session ? (
          <>
            <span className="text-sm font-medium">{session.user?.email}</span>
            <GeminiTokenButton />
            <button
              onClick={() => signOut()}
              className="auth-btn sign-out"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="auth-btn sign-in"
          >
            Sign in with Google
          </button>
        )}
      </div>

      {session ?
        <AdventureGame />
        : (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl mb-4">Text Adventure Game</h1>
            <p className="mb-6">Sign in to start your adventure</p>
            <button
              onClick={() => signIn("google")}
              className="auth-btn sign-in"
            >
              Sign in with Google
            </button>
          </div>
        )}
    </main>
  )
}
