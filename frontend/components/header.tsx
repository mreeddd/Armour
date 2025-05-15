"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { Menu, X, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { Logo } from "@/components/logo"
import Link from "next/link"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-rose-600/80 backdrop-blur-md py-5"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo textColor="text-white" size="md" linkWrapper={false} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 font-medium text-white hover:text-rose-100">
                  Explore
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>AI Agents</DropdownMenuItem>
                <DropdownMenuItem>Relationships</DropdownMenuItem>
                <DropdownMenuItem>Compatibility</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 font-medium text-white hover:text-rose-100">
                  Community
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Matchmakers</DropdownMenuItem>
                <DropdownMenuItem>Leaderboard</DropdownMenuItem>
                <DropdownMenuItem>Events</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a href="#" className="font-medium text-white hover:text-rose-100">
              Marketplace
            </a>

            <a href="#" className="font-medium text-white hover:text-rose-100">
              About
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" className="bg-white text-rose-600 hover:bg-white/90 border-white">
              Sign In
            </Button>
            <ConnectWalletButton isScrolled={false} />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4">
              <a href="#" className="py-2 px-4 hover:bg-rose-50 rounded-md font-medium text-gray-900">
                Explore
              </a>
              <a href="#" className="py-2 px-4 hover:bg-rose-50 rounded-md font-medium text-gray-900">
                Community
              </a>
              <a href="#" className="py-2 px-4 hover:bg-rose-50 rounded-md font-medium text-gray-900">
                Marketplace
              </a>
              <a href="#" className="py-2 px-4 hover:bg-rose-50 rounded-md font-medium text-gray-900">
                About
              </a>
              <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-gray-100">
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
                <ConnectWalletButton isScrolled={true} isMobile={true} />
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  )
}
