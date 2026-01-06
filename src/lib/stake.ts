import BN from 'bn.js'
import { LAMPORTS_PER_SOL, SystemProgram , PublicKey } from '@solana/web3.js'
import { getProgram } from './program'
import {
  getPoolPda,
  getPoolVaultPda,
} from '../constants/addresses'

export const stake = async (
  wallet: any,
  amountSol: number,
  organizationPubkey: PublicKey,
  speciesId: Uint8Array,
  marinadeAccounts: {
    marinadeState: PublicKey
    msolMint: PublicKey
    liqPoolSolLeg: PublicKey
    liqPoolMsolLeg: PublicKey
    liqPoolMsolLegAuthority: PublicKey
    reservePda: PublicKey
    msolMintAuthority: PublicKey
    marinadeProgram: PublicKey
  }
) => {
  const program = getProgram(wallet)

  const [pool] = getPoolPda(organizationPubkey, speciesId)
  const [poolVault] = getPoolVaultPda(organizationPubkey, speciesId)

  await program.methods
    .stake(new BN(amountSol * LAMPORTS_PER_SOL))
    .accounts({
      pool,
      poolVault,
      ...marinadeAccounts,
      systemProgram: SystemProgram.programId,
    })
    .rpc()
}
