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

    const accountNamespace = program.account as any

    const pool = await accountNamespace.pool.fetch(poolPda)
    console.log('Account namespace:', program.account)
    console.log('✅ Pool account fetched:', pool)
    console.log(Object.keys(program.account))

    return pool as PoolAccount
  } catch (err) {
    console.error('❌ fetchPoolState failed:', err)
    return null
  }
}
