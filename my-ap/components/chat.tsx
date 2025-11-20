'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Send, Loader2 } from 'lucide-react'
import MessageBubble from './message-bubble'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

const EXAMPLE_PROMPTS = [
  "How do I save money as a trader?",
  "I am a manager, help me solve staff conflict.",
  "Nijix tell me a story in Krio.",
  "What's the best advice for starting a business?"
]

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/nijix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: text }
          ],
          userType: getUserType(text),
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'assistant',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('0:')) {
            const jsonStr = line.slice(2)
            try {
              const parsed = JSON.parse(jsonStr)
              if (parsed.type === 'text-delta') {
                assistantContent += parsed.delta
                setMessages((prev) => {
                  const updated = [...prev]
                  const lastMsg = updated[updated.length - 1]
                  if (lastMsg.role === 'assistant') {
                    lastMsg.content = assistantContent
                  }
                  return updated
                })
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error('[v0] Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getUserType = (input: string): string => {
    const lowerInput = input.toLowerCase()
    if (lowerInput.includes('trader') || lowerInput.includes('trading')) return 'trader'
    if (lowerInput.includes('manager') || lowerInput.includes('team')) return 'manager'
    if (lowerInput.includes('student') || lowerInput.includes('study')) return 'student'
    if (lowerInput.includes('business') || lowerInput.includes('start')) return 'business'
    if (lowerInput.includes('work') || lowerInput.includes('job')) return 'worker'
    return 'general'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card shadow-sm p-6">
        <h1 className="text-3xl font-bold text-balance">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Nijix AI
          </span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Your personal AI assistant for advice and solutions</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="text-center max-w-2xl">
              <h2 className="text-2xl font-bold mb-2">Welcome to Nijix AI</h2>
              <p className="text-muted-foreground mb-8">
                I'm here to give advice to kids, students, workers, managers, traders, and business owners. Ask me anything!
              </p>
            </div>

            {/* Example Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {EXAMPLE_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-muted transition-all text-left hover:border-primary"
                >
                  <p className="text-sm font-medium text-foreground">{prompt}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
                <div className="text-muted-foreground text-sm">Nijix is thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-6">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Nijix anything..."
            className="flex-1 bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            onClick={() => alert('Microphone feature coming soon!')}
            className="p-3 rounded-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground transition-colors"
            aria-label="Voice input"
          >
            <Mic size={20} />
          </button>

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground transition-colors"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
