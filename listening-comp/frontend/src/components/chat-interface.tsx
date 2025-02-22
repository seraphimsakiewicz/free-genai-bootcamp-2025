"use client"

import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { cn } from "@/lib/utils"

export default function ChatInterface() {
  const [messages, setMessages] = useState<string[]>([])
  const [inputMessage, setInputMessage] = useState('')

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: inputMessage }),
      })

      const data = await response.json()
      console.log(data, "data")
      setMessages([...messages, `User: ${inputMessage}`, `AI: ${JSON.stringify(data)}`])
      setInputMessage('')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4 h-[400px] overflow-y-auto border p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 border p-2"
          placeholder="Enter your video url..."
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 px-4 py-2 text-white"
        >
          Send
        </button>
      </div>
    </div>
  )
}

