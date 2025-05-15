import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { FC, ReactNode, useMemo } from 'react';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export interface WalletContextProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ 
  children, 
  network = WalletAdapterNetwork.Devnet 
}) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// Helper functions for interacting with Solana programs
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  TransactionInstruction
} from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

// Program IDs
export const AGENT_REGISTRY_PROGRAM_ID = new PublicKey('Ag3ntReg1strYpR0gRaMxXxXxXxXxXxXxXxXxXxXxX');
export const RELATIONSHIP_PROGRAM_ID = new PublicKey('Re1ati0nsh1pPr0graMxXxXxXxXxXxXxXxXxXxXxX');
export const INFLUENCE_PROGRAM_ID = new PublicKey('1nf1uenceT0kenPr0graMxXxXxXxXxXxXxXxXxXxX');

// Custom hook for Solana connection
export const useSolanaConnection = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const getBalance = async (): Promise<number> => {
    if (!publicKey) return 0;
    
    try {
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  };

  const sendSol = async (recipient: PublicKey, amount: number): Promise<string> => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      return signature;
    } catch (error) {
      console.error('Error sending SOL:', error);
      throw error;
    }
  };

  return {
    publicKey,
    connection,
    getBalance,
    sendSol,
    sendTransaction,
  };
};

// Function to create a new agent
export const registerAgent = async (
  connection: Connection,
  wallet: any,
  name: string,
  metadataUri: string,
  personalityTraits: any
): Promise<string> => {
  if (!wallet.publicKey) throw new Error('Wallet not connected');
  
  // This is a placeholder - in a real implementation, you would:
  // 1. Create the transaction with the correct instruction data
  // 2. Send the transaction
  // 3. Return the transaction signature
  
  console.log('Registering agent:', { name, metadataUri, personalityTraits });
  return 'transaction_signature_placeholder';
};

// Function to calculate compatibility between two agents
export const calculateCompatibility = async (
  connection: Connection,
  wallet: any,
  agentOneId: PublicKey,
  agentTwoId: PublicKey
): Promise<number> => {
  if (!wallet.publicKey) throw new Error('Wallet not connected');
  
  // This is a placeholder - in a real implementation, you would:
  // 1. Call the calculate_compatibility instruction
  // 2. Parse the result
  
  console.log('Calculating compatibility between:', agentOneId.toString(), agentTwoId.toString());
  return Math.floor(Math.random() * 100); // Placeholder random compatibility score
};

// Function to create a relationship between two agents
export const createRelationship = async (
  connection: Connection,
  wallet: any,
  agentOneId: PublicKey,
  agentTwoId: PublicKey,
  relationshipType: string,
  compatibilityScore: number
): Promise<string> => {
  if (!wallet.publicKey) throw new Error('Wallet not connected');
  
  // This is a placeholder - in a real implementation, you would:
  // 1. Create the transaction with the correct instruction data
  // 2. Send the transaction
  // 3. Return the transaction signature
  
  console.log('Creating relationship:', { 
    agentOne: agentOneId.toString(), 
    agentTwo: agentTwoId.toString(),
    type: relationshipType,
    compatibility: compatibilityScore
  });
  return 'transaction_signature_placeholder';
};
