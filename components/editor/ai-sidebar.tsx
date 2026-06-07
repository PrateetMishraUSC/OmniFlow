"use client"

import { useState, useRef, useCallback } from "react"
import { Bot, X, FileText, Download } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const STARTER_CHIPS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
]

interface AISidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AISidebar({ isOpen, onClose }: AISidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: content.trim() },
    ])
    setInput("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "72px"
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = "72px"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <aside
      aria-label="AI chat"
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={cn(
        "fixed top-12 right-0 bottom-0 z-30 w-80",
        "flex flex-col bg-base/95 border-l border-surface-border",
        "transition-transform duration-200 ease-in-out",
        "shadow-[-4px_0_24px_rgba(0,0,0,0.4)] backdrop-blur-sm",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-surface-border shrink-0">
        <Bot className="h-4 w-4 text-[#f0a030] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-copy-primary leading-none">AI Workspace</p>
          <p className="text-[11px] text-copy-muted mt-0.5">Collaborate with OmniFlow</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-copy-muted hover:text-copy-primary transition-colors"
          aria-label="Close AI sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="architect" className="flex flex-col flex-1 min-h-0">
        <TabsList className="shrink-0 mx-3 mt-3 mb-0 w-[calc(100%-1.5rem)] bg-subtle rounded-md">
          <TabsTrigger
            value="architect"
            className="flex-1 text-xs data-active:bg-[rgba(240,160,48,0.12)] data-active:text-[#f0a030] text-copy-muted"
          >
            AI Architect
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="flex-1 text-xs data-active:bg-[rgba(240,160,48,0.12)] data-active:text-[#f0a030] text-copy-muted"
          >
            Specs
          </TabsTrigger>
        </TabsList>

        {/* AI Architect Tab */}
        <TabsContent value="architect" className="flex flex-col flex-1 min-h-0 mt-0">
          <ScrollArea className="flex-1">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-4 px-4 py-10 text-center">
                <div className="h-10 w-10 rounded-full bg-[rgba(240,160,48,0.12)] flex items-center justify-center">
                  <Bot className="h-5 w-5 text-[#f0a030]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-copy-primary">AI Architect</p>
                  <p className="text-xs text-copy-muted mt-1 leading-relaxed">
                    Describe what you want to build and I&apos;ll help design the architecture.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  {STARTER_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="text-left text-xs px-3 py-2 rounded-full bg-subtle text-[#f0a030] border border-surface-border hover:border-[#f0a030]/30 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-3 py-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[85%] text-xs px-3 py-2 rounded-xl leading-relaxed",
                      msg.role === "user"
                        ? "self-end bg-[rgba(240,160,48,0.12)] border-2 border-[#f0a030]/50 text-copy-primary"
                        : "self-start bg-elevated border border-surface-border text-copy-secondary"
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input area */}
          <div className="shrink-0 px-3 pb-3 pt-2 border-t border-surface-border">
            <div className="flex flex-col gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI Architect…"
                className="resize-none text-xs bg-subtle border-surface-border text-copy-primary placeholder:text-copy-muted overflow-y-auto"
                style={{ minHeight: "72px", maxHeight: "160px", height: "72px" }}
              />
              <Button
                size="sm"
                className="self-end bg-[#f0a030] hover:bg-[#f0a030]/90 text-base text-xs h-7 px-3"
                onClick={() => sendMessage(input)}
              >
                Send
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Specs Tab */}
        <TabsContent value="specs" className="flex flex-col flex-1 min-h-0 mt-0">
          <div className="flex flex-col gap-3 p-3">
            <Button size="sm" className="w-full bg-[#f0a030] hover:bg-[#f0a030]/90 text-base text-xs">
              Generate Spec
            </Button>

            <div className="rounded-lg border border-surface-border bg-elevated p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#f0a030] shrink-0" />
                <span className="text-xs font-medium text-copy-primary">E-Commerce Architecture</span>
              </div>
              <p className="text-[11px] text-copy-muted leading-relaxed">
                Microservices layout with API gateway, order service, payment service, and async event queues.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-copy-muted">Generated just now</span>
                <button
                  disabled
                  className="flex items-center gap-1 text-[10px] text-copy-muted opacity-40 cursor-not-allowed"
                  aria-label="Download spec"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
