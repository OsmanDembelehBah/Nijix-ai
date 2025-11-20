'use client'

import { useState } from 'react'
import { Menu, Home, MessageSquare, Settings, Moon, Sun, Globe } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState<'en' | 'krio'>('en')

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (darkMode) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'krio' : 'en')
  }

  const navItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: MessageSquare, label: 'Chat', active: true },
    { icon: Settings, label: 'Settings', active: false },
  ]

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-card border-r border-border transition-all duration-300 flex flex-col shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-primary" />
        </button>
        {isOpen && <span className="text-sm font-semibold text-primary">Menu</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              item.active
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <item.icon size={20} />
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer Controls */}
      <div className="p-4 border-t border-border space-y-3">
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground"
          title={`Switch to ${language === 'en' ? 'Krio' : 'English'}`}
        >
          <Globe size={20} />
          {isOpen && <span className="text-sm">{language.toUpperCase()}</span>}
        </button>

        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-foreground"
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          {isOpen && <span className="text-sm">{darkMode ? 'Light' : 'Dark'}</span>}
        </button>
      </div>
    </aside>
  )
}
