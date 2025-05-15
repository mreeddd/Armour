"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Image from "next/image"

export function TokenBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-rose-600 text-white py-2 px-4 relative">
      <div className="container mx-auto flex justify-center items-center">
        <p className="text-sm font-medium text-center flex items-center justify-center gap-1">
          Own 10,000 $LOVE
          <Image
            src="/love_logo_new.png"
            alt="Almour Logo"
            width={20}
            height={20}
            className="mx-1"
            style={{ filter: "brightness(0) invert(1)" }} // Make logo white/transparent
          />
          <span className="font-bold">Almour</span> tokens for premium relationship insights and exclusive influence
          abilities
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 text-white/80 hover:text-white"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
