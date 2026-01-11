import React, { useEffect, useState } from 'react'
import { Bot } from 'lucide-react'

export default function FloatingDock() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const down = y > lastY + 5
      const up = y < lastY - 5
      if (down) setVisible(false)
      else if (up || y < 24) setVisible(true)
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const openBot = () => {
    window.dispatchEvent(new CustomEvent('open-support-bot'))
  }
  return (
    <div
      className="fixed z-40"
      style={{
        right: '1rem',
        bottom: 'calc(env(safe-area-inset-bottom) + 64px)'
      }}
    >
      <div
        className={`rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg px-2 py-2 flex items-center gap-2 transition-all duration-200 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={openBot}
          aria-label="Assistance"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center hover:scale-105 transition"
        >
          <Bot className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
