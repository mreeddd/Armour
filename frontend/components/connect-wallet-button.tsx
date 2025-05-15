"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useSolanaConnection } from "@/lib/solana"
import { useState, useEffect } from "react"

interface ConnectWalletButtonProps {
  isScrolled?: boolean
  isMobile?: boolean
}

export function ConnectWalletButton({ isScrolled = true, isMobile = false }: ConnectWalletButtonProps) {
  const { publicKey, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const { getBalance } = useSolanaConnection()
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    if (connected && publicKey) {
      const fetchBalance = async () => {
        const bal = await getBalance()
        setBalance(bal)
      }
      fetchBalance()
    } else {
      setBalance(null)
    }
  }, [connected, publicKey, getBalance])

  const handleConnect = () => {
    setVisible(true)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <Button
      onClick={handleConnect}
      className={`bg-white text-rose-600 hover:bg-white/90 ${isMobile ? "w-full justify-center" : ""}`}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {connected && publicKey ? (
        <span>
          {formatAddress(publicKey.toString())}
          {balance !== null && ` (${balance.toFixed(2)} SOL)`}
        </span>
      ) : (
        "Connect Wallet"
      )}
    </Button>
  )
}
