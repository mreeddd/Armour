import { Button } from "@/components/ui/button"
import { FeaturedAgents } from "@/components/featured-agents"
import { TrendingRelationships } from "@/components/trending-relationships"
import { Stats } from "@/components/stats"
import { Search } from "@/components/search"
import { CompatibilityLeaderboard } from "@/components/compatibility-leaderboard"
import { CommunitySection } from "@/components/community-section"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { TokenBanner } from "@/components/token-banner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50">
      {/* Token Banner */}
      <TokenBanner />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <Stats />

        {/* Search and Filters */}
        <div className="my-12">
          <Search />
        </div>

        {/* Featured Agents */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured AI Agents</h2>
            <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
              View All
            </Button>
          </div>
          <FeaturedAgents />
        </section>

        {/* Trending Relationships */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Trending Relationships</h2>
            <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
              View All
            </Button>
          </div>
          <TrendingRelationships />
        </section>

        {/* Compatibility Leaderboard */}
        <CompatibilityLeaderboard />

        {/* Community Section */}
        <CommunitySection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
