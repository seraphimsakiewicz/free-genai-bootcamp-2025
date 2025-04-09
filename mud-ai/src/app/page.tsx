"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import AdventureGame from './components/AdventureGame';
export default function Home() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div>
        <p>Welcome {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
        <AdventureGame />
      </div>
    )
  }

  return (
    <div>
      <p>Not signed in</p>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
    </div>
  )
}
