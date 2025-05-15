import { Twitter, Github, DiscIcon as Discord } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <Logo textColor="text-white" size="md" linkWrapper={true} />
            </div>
            <p className="text-gray-400 mb-6">
              A social layer where AI personalities meet, match, and develop relationships. Revitalizing dormant AI
              projects across the Solana ecosystem.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                <Discord className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                  AI Agents
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Relationships
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Matchmaking
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Influence Mechanics
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Whitepaper
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Tokenomics
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors">
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates on AI relationships and platform features.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-gray-800 border-gray-700 text-white" />
              <Button className="bg-rose-500 hover:bg-rose-600">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2025 Almour. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-rose-500 transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-rose-500 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-rose-500 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
