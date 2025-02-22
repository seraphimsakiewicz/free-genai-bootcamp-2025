"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutGrid, BookOpen, Sun, Moon, Headphones } from "lucide-react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary" />
            <span className="font-semibold text-foreground">DeleSpanish.ai</span>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="space-y-4 p-4">
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-foreground">
                <BookOpen className="mr-2 h-4 w-4" />
                Reading Comprehension
              </Button>
              <Button variant="ghost" className="w-full justify-start text-foreground">
                <Headphones className="mr-2 h-4 w-4" />
                Listening Comprehension
              </Button>
            </nav>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b px-4 flex items-center justify-between">
            <h1 className="text-sm font-medium text-foreground">Reading Comprehension</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.documentElement.classList.toggle("dark")}
                className="text-foreground"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-foreground">
                Save lesson
              </Button>
            </div>
          </header>
          {children}
        </div>

        {/* Right Panel */}
        <div className="w-80 border-l">
          <div className="h-14 border-b px-4 flex items-center">
            <h2 className="font-medium text-foreground">Lesson details</h2>
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-2 text-foreground">Level</h3>
            <div className="inline-block px-2 py-1 rounded-md bg-primary/10 text-primary">B2</div>
          </div>
        </div>
      </div>
    </div>
  )
}

