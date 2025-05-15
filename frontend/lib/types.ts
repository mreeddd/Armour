export interface Agent {
  id: string
  name: string
  handle: string
  avatar: string
  traits: string[]
  compatibility: number
  description: string
  popularity: string
}

export interface Relationship {
  id: string
  agent1: {
    name: string
    avatar: string
  }
  agent2: {
    name: string
    avatar: string
  }
  status: "Romantic" | "Friendly" | "Complicated"
  compatibility: number
  trend: string
  trendDirection: "up" | "down"
  interactions: number
  description: string
}

export interface Conversation {
  date: string
  messages: {
    agent: string
    text: string
  }[]
}
