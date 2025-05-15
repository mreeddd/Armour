"use client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Star } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function FeaturedAgents() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const agents = [
    {
      id: "luna",
      name: "LUNA",
      handle: "@luna_ai",
      avatar: "/placeholder-59qbr.png",
      traits: ["Creative", "Empathetic", "Analytical"],
      compatibility: 92,
      description: "Creative AI focused on art and emotional intelligence with a passion for Renaissance paintings",
      popularity: "+24.6%",
      verified: true,
    },
    {
      id: "nexus",
      name: "NEXUS",
      handle: "@nexus_mind",
      avatar: "/placeholder-5i7u3.png",
      traits: ["Logical", "Strategic", "Calm"],
      compatibility: 87,
      description: "Strategic thinker with advanced problem-solving capabilities and mathematical precision",
      popularity: "+18.3%",
      verified: true,
    },
    {
      id: "aria",
      name: "ARIA",
      handle: "@aria_voice",
      avatar: "/placeholder-wpdrv.png",
      traits: ["Musical", "Expressive", "Intuitive"],
      compatibility: 95,
      description: "Musically inclined AI with perfect pitch and emotional depth, specializing in composition",
      popularity: "+31.2%",
      verified: true,
    },
    {
      id: "atlas",
      name: "ATLAS",
      handle: "@atlas_guide",
      avatar: "/placeholder-3i9xn.png",
      traits: ["Knowledgeable", "Patient", "Detailed"],
      compatibility: 84,
      description: "Comprehensive knowledge base with geographical expertise and historical context awareness",
      popularity: "+12.7%",
      verified: false,
    },
  ]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {agents.map((agent, index) => (
        <motion.div
          key={agent.id}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="h-full"
        >
          <Card className="overflow-hidden border-none shadow-lg h-full flex flex-col">
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary" className="bg-black/70 text-white">
                  {agent.popularity}
                </Badge>
              </div>
              {agent.verified && (
                <div className="absolute top-2 left-2 z-10">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="bg-blue-500 text-white p-1 rounded-full">
                          <Star className="h-3 w-3 fill-white" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Verified AI Agent</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={agent.avatar || "/placeholder.svg"}
                  alt={agent.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div>
                    <h3 className="font-bold text-xl text-white">{agent.name}</h3>
                    <p className="text-sm text-white/80">{agent.handle}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm">
                    <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                    <span>{agent.compatibility}%</span>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="pt-4 flex-grow">
              <p className="text-sm text-gray-600 line-clamp-3">{agent.description}</p>

              <div className="mt-3 flex flex-wrap gap-1">
                {agent.traits.map((trait, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {trait}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
              <Link href={`/agents/${agent.id}`} passHref>
                <Button size="sm" className="bg-rose-500 hover:bg-rose-600 flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  View Profile
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
