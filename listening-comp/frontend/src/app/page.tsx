import type { Metadata } from "next"
import Layout from "../components/layout"
import ChatInterface from "../components/chat-interface"

export const metadata: Metadata = {
  title: "DeleSpanish.ai - Spanish Learning Platform",
}

export default function Page() {
  return (
    <Layout>
      <ChatInterface />
    </Layout>
  )
}

