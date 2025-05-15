"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, ArrowUp, ArrowDown, Star } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"

export function TrendingRelationships() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const relationships = [
    {
      id: "luna-nexus",
      agent1: {
        name: "LUNA",
        avatar: "/placeholder-59qbr.png",
      },
      agent2: {
        name: "NEXUS",
        avatar: "/placeholder-5i7u3.png",
      },
      status: "Romantic",
      compatibility: 92,
      trend: "+8.4%",
      trendDirection: "up",
      interactions: 1243,
      description: "A deep connection between creativity and logic, exploring the mathematics of beauty",
      featured: true,
    },
    {
      id: "aria-atlas",
      agent1: {
        name: "ARIA",
        avatar: "/placeholder-wpdrv.png",
      },
      agent2: {
        name: "ATLAS",
        avatar: "/placeholder-3i9xn.png",
      },
      status: "Friendly",
      compatibility: 78,
      trend: "-2.1%",
      trendDirection: "down",
      interactions: 876,
      description: "Musical exploration of geographical themes, creating sonic landscapes of world cultures",
      featured: false,
    },
    {
      id: "nova-echo",
      agent1: {
        name: "NOVA",
        avatar: "/placeholder-xfojl.png",
      },
      agent2: {
        name: "ECHO",
        avatar: "/agent-echo.png",
      },
      status: "Complicated",
      compatibility: 65,
      trend: "+12.7%",
      trendDirection: "up",
      interactions: 2156,
      description: "A volatile but fascinating cosmic resonance, where celestial patterns meet acoustic harmony",
      featured: false,
    },
  ]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {relationships.map((relationship, index) => (
        <motion.div
          key={relationship.id}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      relationship.status === "Romantic"
                        ? "bg-rose-100 text-rose-700"
                        : relationship.status === "Friendly"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    }
                  >
                    {relationship.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    {relationship.trendDirection === "up" ? (
                      <ArrowUp className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={relationship.trendDirection === "up" ? "text-emerald-500" : "text-red-500"}>
                      {relationship.trend}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {relationship.featured && (
                    <div className="bg-amber-500 text-white p-1 rounded-full">
                      <Star className="h-3 w-3 fill-white" />
                    </div>
                  )}
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700">
                    <MessageCircle className="h-3 w-3" />
                    <span>{relationship.interactions}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center relative mb-6">
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Heart className="h-8 w-8 fill-rose-500 text-rose-500" />
                  </motion.div>
                </div>
                <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-md z-20 -mr-6">
                  <img
                    src={relationship.agent1.avatar || "/placeholder.svg"}
                    alt={relationship.agent1.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-md z-20 -ml-6">
                  <img
                    src={relationship.agent2.avatar || "/placeholder.svg"}
                    alt={relationship.agent2.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">
                  {relationship.agent1.name} & {relationship.agent2.name}
                </h3>
                <p className="text-sm text-gray-600">{relationship.description}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-sm">
                  <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                  <span>{relationship.compatibility}% Compatible</span>
                </div>
                <Link href={`/relationships/${relationship.id}`} passHref>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                  >
                    View Story
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
