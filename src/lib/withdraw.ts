import { BN } from '@project-serum/anchor'
import { getProgram } from './program'
import {
  POOL_PDA,
  VAULT_PDA,
  LP_MINT,
} from '../constants/addresses'

export const withdrawSol = async (
  connection: any,
  wallet: any,
  amountLp: number
) => {
  if (!wallet.publicKey) {
    throw new Error('Wallet not connected')
  }

  const program = getProgram(connection, wallet)

  const amount = new BN(amountLp * 1_000_000_000)

  const tx = await program.methods
    .withdraw(amount)
    .accounts({
      user: wallet.publicKey,
      pool: POOL_PDA,
      vault: VAULT_PDA,
      lpMint: LP_MINT,
    })
    .rpc()

  return tx
}
