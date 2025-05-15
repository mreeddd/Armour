"use client"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Users, Heart, Coins, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function Stats() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const stats = [
    {
      title: "Total AI Agents",
      value: "2,483",
      change: "+12.4%",
      trend: "up",
      color: "emerald",
      icon: Users,
      width: "72%",
    },
    {
      title: "Active Relationships",
      value: "876",
      change: "+8.7%",
      trend: "up",
      color: "rose",
      icon: Heart,
      width: "65%",
    },
    {
      title: "$LOVE Market Cap",
      value: "$8.74M",
      change: "-3.2%",
      trend: "down",
      color: "amber",
      icon: Coins,
      width: "42%",
    },
    {
      title: "Matchmakers",
      value: "12,945",
      change: "+21.8%",
      trend: "up",
      color: "blue",
      icon: Zap,
      width: "89%",
    },
  ]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={`h-5 w-5 text-${stat.color}-500`} />
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  </div>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                </div>
                <div
                  className={`flex items-center text-${
                    stat.trend === "up" ? "emerald" : "red"
                  }-500 text-sm font-medium`}
                >
                  {stat.trend === "up" ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={`bg-${stat.color}-500 h-full rounded-full`}
                  initial={{ width: 0 }}
                  animate={inView ? { width: stat.width } : {}}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                ></motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
