import { PublicKey } from '@solana/web3.js'
import { getProgram } from './program'
import { getPoolPda } from '../constants/addresses'

export const fetchPool = async (
  wallet: any,
  organizationPubkey: PublicKey,
  speciesId: Uint8Array
) => {
  const program = getProgram(wallet)
  const [poolPda] = getPoolPda(organizationPubkey, speciesId)

  try {
    const pool = await program.account.pool.fetch(poolPda)
    return pool
  } catch (err) {
    // Pool does not exist OR not initialized
    return null
  }
}