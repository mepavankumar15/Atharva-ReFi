// src/lib/ReadPool.ts
import { PublicKey } from '@solana/web3.js'
import { getProgram } from './program'
import { getPoolPda } from '../constants/addresses'
import { PoolAccount } from '../types/pool'

export const fetchPoolState = async (
  connection: any,
  wallet: any | null,
  organizationPubkey: PublicKey,
  speciesId: Uint8Array
): Promise<PoolAccount | null> => {
  try {
    const program = getProgram(connection, wallet)

    const [poolPda] = getPoolPda(organizationPubkey, speciesId)

    return (await program.account.pool.fetch(
      poolPda
    )) as PoolAccount
  } catch {
    return null
  }
}
