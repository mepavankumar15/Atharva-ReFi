// src/lib/program.ts
import { Program, AnchorProvider } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { ATHARVA_IDL } from '../idl/atharva_refi'

export const PROGRAM_ID = new PublicKey(
  '5MQdy7SUtMR5qQqryuizd7WXKE18RRn7sNS4uX64ih96'
)

/**
 * READ + WRITE safe Program factory
 */
export const getProgram = (
  connection: Connection,
  wallet?: WalletContextState | null
) => {
  // 🔹 READ-ONLY provider (no wallet)
  const provider = wallet?.publicKey &&
    wallet.signTransaction &&
    wallet.signAllTransactions
    ? new AnchorProvider(
        connection,
        {
          publicKey: wallet.publicKey,
          signTransaction: wallet.signTransaction,
          signAllTransactions: wallet.signAllTransactions,
        },
        { commitment: 'confirmed' }
      )
    : new AnchorProvider(
        connection,
        // dummy wallet for READ-ONLY
        {
          publicKey: PublicKey.default,
          signTransaction: async (tx) => tx,
          signAllTransactions: async (txs) => txs,
        },
        { commitment: 'confirmed' }
      )

  return new Program<any>(ATHARVA_IDL, PROGRAM_ID, provider)
}
