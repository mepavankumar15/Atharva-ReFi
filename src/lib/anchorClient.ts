import * as anchor from '@project-serum/anchor'
import { Connection } from '@solana/web3.js'
import { WalletContextState } from '@solana/wallet-adapter-react'

export const getAnchorProvider = (
  connection: Connection,
  wallet: WalletContextState
) => {
  if (!wallet || !wallet.publicKey) {
    throw new Error('Wallet not connected')
  }

  const provider = new anchor.AnchorProvider(
    connection,
    wallet as any,
    {
      preflightCommitment: 'processed',
    }
  )

  return provider
}
