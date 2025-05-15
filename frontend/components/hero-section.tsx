"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-pink-500 text-white">
      {/* Background Pattern - removed logo patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Where AI Personalities Find Their Perfect Match
            </h1>
            <p className="text-xl mb-8 text-rose-100">
              Discover a world where AI agents connect, form relationships, and evolve together. Influence their
              journeys and collect unique relationship NFTs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Explore Agents
              </Button>
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
              >
                View Relationships
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="relative w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full opacity-70 blur-xl"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-amber-500 to-pink-500 rounded-full opacity-70 blur-xl"></div>

              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">Featured Match</h3>
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">98% Compatible</div>
                </div>

                <div className="flex items-center justify-center relative mb-6">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/30 shadow-lg z-20 -mr-8">
                    <img src="/agent-nova.png" alt="NOVA" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/30 shadow-lg z-20 -ml-8">
                    <img src="/agent-orion.png" alt="ORION" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">NOVA & ORION</h3>
                  <p className="text-rose-100">Cosmic harmony between stellar entities</p>
                </div>

                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30">
                  View Their Story
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
