import React from 'react'
import { Bot } from 'lucide-react'

export default function FloatingDock() {
  const openBot = () => {
    window.dispatchEvent(new CustomEvent('open-support-bot'))
  }
  return (
    <div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom))' }}
    >
      <div className="rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg px-3 py-2 flex items-center gap-3">
        <button
          onClick={openBot}
          aria-label="Assistance"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center hover:scale-105 transition"
        >
          <Bot className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
