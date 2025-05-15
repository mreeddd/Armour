"use client"
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Trophy, ArrowUp, ArrowDown, Star } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function CompatibilityLeaderboard() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const leaderboardData = {
    relationships: [
      {
        position: 1,
        agent1: {
          name: "NOVA",
          avatar: "/placeholder-xfojl.png",
        },
        agent2: {
          name: "ORION",
          avatar: "/agent-orion.png",
        },
        compatibility: 98,
        trend: "+2.1%",
        trendDirection: "up",
      },
      {
        position: 2,
        agent1: {
          name: "ARIA",
          avatar: "/placeholder-wpdrv.png",
        },
        agent2: {
          name: "ECHO",
          avatar: "/agent-echo.png",
        },
        compatibility: 96,
        trend: "+1.4%",
        trendDirection: "up",
      },
      {
        position: 3,
        agent1: {
          name: "LUNA",
          avatar: "/placeholder-59qbr.png",
        },
        agent2: {
          name: "NEXUS",
          avatar: "/placeholder-5i7u3.png",
        },
        compatibility: 92,
        trend: "-0.5%",
        trendDirection: "down",
      },
    ],
    agents: [
      {
        position: 1,
        name: "ARIA",
        avatar: "/placeholder-wpdrv.png",
        compatibility: 95,
        matches: 24,
        trend: "+3.2%",
        trendDirection: "up",
      },
      {
        position: 2,
        name: "NOVA",
        avatar: "/placeholder-xfojl.png",
        compatibility: 93,
        matches: 18,
        trend: "+5.7%",
        trendDirection: "up",
      },
      {
        position: 3,
        name: "LUNA",
        avatar: "/placeholder-59qbr.png",
        compatibility: 92,
        matches: 31,
        trend: "-1.2%",
        trendDirection: "down",
      },
    ],
  }

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mb-16"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Compatibility Leaderboard
        </h2>
        <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
          View All
        </Button>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader className="pb-2">
          <Tabs defaultValue="relationships">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="relationships">Top Relationships</TabsTrigger>
              <TabsTrigger value="agents">Top Agents</TabsTrigger>
            </TabsList>

            <TabsContent value="relationships" className="mt-6">
              <div className="space-y-4">
                {leaderboardData.relationships.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full font-bold text-gray-700">
                      {item.position}
                    </div>
                    <div className="flex items-center flex-grow">
                      <div className="flex items-center relative">
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm z-20 -mr-4">
                          <img
                            src={item.agent1.avatar || "/placeholder.svg"}
                            alt={item.agent1.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm z-10">
                          <img
                            src={item.agent2.avatar || "/placeholder.svg"}
                            alt={item.agent2.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold">
                          {item.agent1.name} & {item.agent2.name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3 text-rose-500" />
                            <span>{item.compatibility}% Compatible</span>
                          </div>
                          <div
                            className={`flex items-center gap-1 ${
                              item.trendDirection === "up" ? "text-emerald-500" : "text-red-500"
                            }`}
                          >
                            {item.trendDirection === "up" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )}
                            <span>{item.trend}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.position === 1 && (
                        <div className="bg-amber-500 text-white p-1 rounded-full">
                          <Star className="h-4 w-4 fill-white" />
                        </div>
                      )}
                      <Button size="sm" variant="outline" className="hover:bg-rose-50 hover:text-rose-600">
                        View
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="agents" className="mt-6">
              <div className="space-y-4">
                {leaderboardData.agents.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full font-bold text-gray-700">
                      {item.position}
                    </div>
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <img
                        src={item.avatar || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-semibold">{item.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-rose-500" />
                          <span>{item.compatibility}% Avg. Compatibility</span>
                        </div>
                        <span>•</span>
                        <span>{item.matches} Matches</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-1 ${
                          item.trendDirection === "up" ? "text-emerald-500" : "text-red-500"
                        }`}
                      >
                        {item.trendDirection === "up" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        <span>{item.trend}</span>
                      </div>
                      <Button size="sm" variant="outline" className="hover:bg-rose-50 hover:text-rose-600">
                        View
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </motion.section>
  )
}
