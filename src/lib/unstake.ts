import BN from 'bn.js'
import { SystemProgram, PublicKey ,Connection } from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { getProgram } from './program'
import {
  getPoolPda,
  getPoolVaultPda,
} from '../constants/addresses'
import { connection } from 'next/server'

export type MarinadeUnstakeAccounts = {
  marinadeState: PublicKey
  msolMint: PublicKey
  liqPoolSolLeg: PublicKey
  liqPoolMsolLeg: PublicKey
  treasuryMsolAccount: PublicKey
  marinadeProgram: PublicKey
}

export const unstake = async (
  connection: Connection,
  wallet: any,
  msolAmount: number,
  organizationPubkey: PublicKey,
  speciesId: Uint8Array,
  marinade: MarinadeUnstakeAccounts,
  msolDecimals = 9
): Promise<string> => {
  if (!wallet?.publicKey) {
    throw new Error('Wallet not connected')
  }

  const program = getProgram(connection ,wallet)

  const [pool] = getPoolPda(organizationPubkey, speciesId)
  const [poolVault] = getPoolVaultPda(organizationPubkey, speciesId)

  // ✅ DERIVE POOL mSOL ATA (this fixes the error)
  const poolMsolAccount = await getAssociatedTokenAddress(
    marinade.msolMint,
    poolVault,
    true // PDA authority
  )

  const amountInBaseUnits = new BN(
    Math.floor(msolAmount * 10 ** msolDecimals)
  )

  const sig = await program.methods
    .unstake(amountInBaseUnits)
    .accounts({
      pool,
      marinadeState: marinade.marinadeState,
      msolMint: marinade.msolMint,
      liqPoolSolLeg: marinade.liqPoolSolLeg,
      liqPoolMsolLeg: marinade.liqPoolMsolLeg,
      treasuryMsolAccount: marinade.treasuryMsolAccount,
      poolMsolAccount, // ✅ now provided correctly
      poolVault,
      systemProgram: SystemProgram.programId,
      marinadeProgram: marinade.marinadeProgram,
    })
    .rpc()

  return sig
}
