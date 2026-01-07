import { PublicKey } from '@solana/web3.js'
import { getProgram } from './program'
import { getPoolPda } from '../constants/addresses'
import { PoolAccount } from '../types/pool'

export const fetchPool = async (
  wallet: any,
  organizationPubkey: PublicKey,
  speciesId: Uint8Array
): Promise<PoolAccount | null> => {
  const program = getProgram(wallet)
  const [poolPda] = getPoolPda(organizationPubkey, speciesId)

  try {
    const pool = await program.account.pool.fetch(poolPda)
    return pool as PoolAccount
  } catch {
    return null
  }
}
