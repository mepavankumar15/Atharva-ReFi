import BN from 'bn.js'
import { SystemProgram, PublicKey } from '@solana/web3.js'
import { getProgram } from './program'
import {
  getPoolPda,
  getPoolVaultPda,
} from '../constants/addresses'

export type MarinadeUnstakeAccounts = {
  marinadeState: PublicKey
  msolMint: PublicKey
  liqPoolSolLeg: PublicKey
  liqPoolMsolLeg: PublicKey
  treasuryMsolAccount: PublicKey
  poolMsolAccount: PublicKey
  marinadeProgram: PublicKey
}

export const unstake = async (
  wallet: any,
  msolAmount: number, // human-readable mSOL (e.g. 0.5)
  organizationPubkey: PublicKey,
  speciesId: Uint8Array,
  marinade: MarinadeUnstakeAccounts,
  msolDecimals = 9 // confirm with MSOL_MINT (usually 9)
) => {
  if (!wallet?.publicKey) {
    throw new Error('Wallet not connected')
  }

  const program = getProgram(wallet)

  const [pool] = getPoolPda(organizationPubkey, speciesId)
  const [poolVault] = getPoolVaultPda(organizationPubkey, speciesId)

  const amountInBaseUnits = new BN(
    Math.floor(msolAmount * 10 ** msolDecimals)
  )

  await program.methods
    .unstake(amountInBaseUnits)
    .accounts({
      pool,
      marinadeState: marinade.marinadeState,
      msolMint: marinade.msolMint,
      liqPoolSolLeg: marinade.liqPoolSolLeg,
      liqPoolMsolLeg: marinade.liqPoolMsolLeg,
      treasuryMsolAccount: marinade.treasuryMsolAccount,
      poolMsolAccount: marinade.poolMsolAccount,
      poolVault,
      systemProgram: SystemProgram.programId,
      tokenProgram: program.provider.connection
        ? undefined
        : undefined, // Anchor auto-resolves; safe to omit
      marinadeProgram: marinade.marinadeProgram,
    })
    .rpc()
}
