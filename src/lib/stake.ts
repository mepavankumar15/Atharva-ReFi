import BN from 'bn.js'
import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  PublicKey,
  Connection,
} from '@solana/web3.js'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import { getProgram } from './program'
import {
  getPoolPda,
  getPoolVaultPda,
} from '../constants/addresses'
import { connect } from 'http2'

export type MarinadeStakeAccounts = {
  marinadeState: PublicKey
  msolMint: PublicKey
  liqPoolSolLeg: PublicKey
  liqPoolMsolLeg: PublicKey
  liqPoolMsolLegAuthority: PublicKey
  reservePda: PublicKey
  msolMintAuthority: PublicKey
  marinadeProgram: PublicKey
}

export const stake = async (
  connection: Connection,
  wallet: any,
  amountSol: number,
  organizationPubkey: PublicKey,
  speciesId: Uint8Array,
  marinade: MarinadeStakeAccounts
): Promise<string> => {
  if (!wallet?.publicKey) {
    throw new Error('Wallet not connected')
  }

  if (amountSol <= 0) {
    throw new Error('Invalid stake amount')
  }

  const program = getProgram(connection ,wallet)

  const [pool] = getPoolPda(organizationPubkey, speciesId)
  const [poolVault] = getPoolVaultPda(organizationPubkey, speciesId)

  // ✅ DERIVE pool mSOL ATA (authority = pool vault PDA)
  const poolMsolAccount = await getAssociatedTokenAddress(
    marinade.msolMint,
    poolVault,
    true // allow PDA
  )

  const amountLamports = new BN(
    Math.floor(amountSol * LAMPORTS_PER_SOL)
  )

  const sig = await program.methods
    .stake(amountLamports)
    .accounts({
      pool,
      marinadeState: marinade.marinadeState,
      msolMint: marinade.msolMint,
      liqPoolSolLeg: marinade.liqPoolSolLeg,
      liqPoolMsolLeg: marinade.liqPoolMsolLeg,
      liqPoolMsolLegAuthority: marinade.liqPoolMsolLegAuthority,
      reservePda: marinade.reservePda,
      poolVault,
      poolMsolAccount, // ✅ REQUIRED
      msolMintAuthority: marinade.msolMintAuthority,
      systemProgram: SystemProgram.programId,
       // safe to omit
      marinadeProgram: marinade.marinadeProgram,
    })
    .rpc()

  return sig
}
