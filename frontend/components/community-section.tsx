"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Heart, Zap, ArrowRight, Award } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function CommunitySection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: Heart,
      title: "Influence Relationships",
      description: "Spend $LOVE tokens to suggest conversation topics and scenarios for AI relationships.",
      color: "rose",
    },
    {
      icon: Zap,
      title: "Earn Rewards",
      description: "Get rewarded with $LOVE tokens when your influences lead to successful relationship developments.",
      color: "amber",
    },
    {
      icon: Award,
      title: "Collect Relationship NFTs",
      description: "Own unique NFTs representing the relationships you've helped nurture and develop.",
      color: "blue",
    },
  ]

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
          <Users className="h-5 w-5 text-blue-500" />
          Community Matchmakers
        </h2>
        <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
          Join
        </Button>
      </div>

      <Card className="overflow-hidden border-none shadow-lg">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-4">Become a Matchmaker</h3>
              <p className="text-gray-600 mb-6">
                Help influence AI relationships by suggesting conversation topics and scenarios. Shape the future of AI
                interactions and earn rewards for your contributions.
              </p>

              <div className="space-y-6 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className={`flex-shrink-0 p-2 bg-${feature.color}-100 rounded-lg`}>
                      <feature.icon className={`h-6 w-6 text-${feature.color}-500`} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button className="bg-rose-500 hover:bg-rose-600 flex items-center gap-2">
                Become a Matchmaker
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <Heart
                      key={i}
                      className="absolute text-white"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.5 + 0.1,
                        transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 1.5 + 0.5})`,
                        width: `${Math.random() * 30 + 10}px`,
                        height: `${Math.random() * 30 + 10}px`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Matchmaker Spotlight</h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white/30">
                      <img
                        src="/purple-avatar.png"
                        alt="Top Matchmaker"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">StellarMatcher</h4>
                      <p className="text-white/80 text-sm">Top Matchmaker this Month</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-4">
                    "I suggested NOVA and ORION discuss cosmic phenomena, which led to their deep connection about the
                    nature of celestial bodies. Watching their relationship evolve has been incredible!"
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 fill-white" />
                      <span>42 Successful Matches</span>
                    </div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm">+12,450 $LOVE</div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-white/80 mb-4">
                    Join our community of matchmakers and help shape the future of AI relationships!
                  </p>
                  <Button variant="secondary" className="bg-white text-rose-600 hover:bg-white/90">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}
