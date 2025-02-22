"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  role: "agent" | "user"
  content: string
  timestamp: string
}

export default function ChatInterface() {
  const [input, setInput] = useState("")
  const [messages] = useState<Message[]>([
    {
      role: "agent",
      content: "¡Hola! Soy tu profesor de español. ¿Cómo puedo ayudarte hoy?",
      timestamp: "4:08:28 PM",
    },
    {
      role: "user",
      content: "Hola, quisiera practicar mi español.",
      timestamp: "4:08:37 PM",
    },
    {
      role: "agent",
      content: "¡Perfecto! Empecemos con un ejercicio de comprensión lectora.",
      timestamp: "4:08:37 PM",
    },
  ])

  return (
    <div className="flex-1 flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={cn("flex gap-2 max-w-[80%]", message.role === "user" && "ml-auto")}>
              {message.role === "agent" && <div className="h-8 w-8 rounded-full bg-primary flex-shrink-0" />}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {message.role === "agent" ? "DeleSpanish.ai" : "Student"}
                  </span>
                  <span className="text-sm text-muted-foreground">{message.timestamp}</span>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap text-foreground">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            placeholder="Escribete tu respuesta"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[44px] max-h-32 text-foreground"
          />
          <Button className="px-8">Send</Button>
        </div>
      </div>
    </div>
  )
}

