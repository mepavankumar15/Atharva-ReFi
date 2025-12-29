import { BN } from '@project-serum/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { getProgram } from './program'
import {
  POOL_PDA,
  VAULT_PDA,
  LP_MINT,
} from '../constants/addresses'

export const stakeSol = async (
  connection: any,
  wallet: any,
  amountSol: number
) => {
  if (!wallet.publicKey) {
    throw new Error('Wallet not connected')
  }

  const program = getProgram(connection, wallet)

  const amountLamports = new BN(amountSol * 1_000_000_000)

  const tx = await program.methods
    .stake(amountLamports)
    .accounts({
      user: wallet.publicKey,
      pool: POOL_PDA,
      vault: VAULT_PDA,
      lpMint: LP_MINT,
    })
    .rpc()

  return tx
}
