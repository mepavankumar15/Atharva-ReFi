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
    console.log('🔍 fetchPoolState called')

    console.log('Organization:', organizationPubkey.toBase58())
    console.log('SpeciesId (len):', speciesId.length)
    console.log('SpeciesId (hex):', Buffer.from(speciesId).toString('hex'))
 
console.log('🔍 RPC endpoint:', connection.rpcEndpoint)



    const [poolPda] = getPoolPda(organizationPubkey, speciesId)

    console.log('Derived Pool PDA:', poolPda.toBase58())

    if (!wallet?.publicKey) {
      console.warn('⚠️ Wallet not connected yet, skipping fetch')
      return null
    }

    const program = getProgram(connection, wallet)
     console.log('🔍 Reading pool from program:', program.programId.toBase58())
    console.log('🔍 Pool PDA:', poolPda.toBase58())

    const pool = await program.account.pool.fetch(poolPda)

    console.log('✅ Pool account fetched:', pool)

    return pool as PoolAccount
  } catch (err) {
    console.error('❌ fetchPoolState failed:', err)
    return null
  }
}
