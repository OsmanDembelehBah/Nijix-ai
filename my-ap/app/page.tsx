'use client'

import { useState } from 'react'
import Sidebar from '@/components/sidebar'
import Chat from '@/components/chat'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        <Chat />
      </main>
    </div>
  )
}
