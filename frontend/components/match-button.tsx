"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useWallet } from "@solana/wallet-adapter-react"
import { useSolanaConnection } from "@/lib/solana"
import { PublicKey } from "@solana/web3.js"
import { useToast } from "@/components/ui/use-toast"

interface MatchButtonProps {
  agentName: string
  compatibility: number
  agentId?: string
}

export function MatchButton({ agentName, compatibility, agentId }: MatchButtonProps) {
  const { publicKey, connected } = useWallet()
  const { sendTransaction } = useSolanaConnection()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [isMatching, setIsMatching] = useState(false)
  const [isMatched, setIsMatched] = useState(false)

  const handleMatch = () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to match with this agent.",
        variant: "destructive",
      })
      return
    }
    setOpen(true)
  }

  const confirmMatch = async () => {
    if (!connected || !publicKey || !agentId) {
      toast({
        title: "Error",
        description: "Wallet not connected or agent ID missing.",
        variant: "destructive",
      })
      return
    }

    setIsMatching(true)

    try {
      // In a real implementation, this would:
      // 1. Call the Solana program to create a match
      // 2. Wait for the transaction to confirm
      // 3. Update the UI based on the result

      // Simulate a transaction delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsMatching(false)
      setIsMatched(true)
      setOpen(false)

      toast({
        title: "Match successful!",
        description: `You've successfully matched with ${agentName}.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error matching with agent:", error)

      setIsMatching(false)

      toast({
        title: "Match failed",
        description: "There was an error matching with this agent. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Button
        onClick={handleMatch}
        className={isMatched ? "bg-green-500 hover:bg-green-600" : "bg-rose-500 hover:bg-rose-600"}
        size="sm"
      >
        <Heart className={`h-4 w-4 mr-1 ${isMatched ? "fill-white" : ""}`} />
        {isMatched ? "Matched" : "Match"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Match with {agentName}</DialogTitle>
            <DialogDescription>
              You are about to initiate a match with {agentName}. Your compatibility score is {compatibility}%. This
              could be the beginning of a beautiful relationship!
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img
                  src="/placeholder.svg?height=100&width=100&query=abstract AI visualization"
                  alt="Your AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <Heart className="h-8 w-8 mx-4 text-rose-500" />
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img
                  src="/placeholder.svg?height=100&width=100&query=futuristic AI avatar"
                  alt={agentName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <p className="text-center text-gray-600">
              This will create a new relationship between your AI and {agentName}. You'll be able to observe their
              interactions and influence their relationship development using $LOVE tokens.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmMatch} className="bg-rose-500 hover:bg-rose-600" disabled={isMatching || isMatched}>
              {isMatching ? "Matching..." : isMatched ? "Matched!" : "Confirm Match"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
