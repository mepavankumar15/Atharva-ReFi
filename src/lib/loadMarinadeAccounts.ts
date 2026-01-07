// lib/loadMarinadeAccounts.ts
import { Connection, SystemProgram, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  MARINADE_PROGRAM_ID,
  MARINADE_STATE,
  MSOL_MINT,
  MSOL_MINT_AUTHORITY,
  LIQ_POOL_SOL_LEG,
  LIQ_POOL_MSOL_LEG,
  LIQ_POOL_MSOL_LEG_AUTHORITY,
  RESERVE_PDA,
  TREASURY_MSOL_ACCOUNT,
} from '../constants/marinade'

// ✅ EXPORT THE TYPE
export type MarinadeAccounts = {
  marinadeState: PublicKey
  msolMint: PublicKey
  liqPoolSolLeg: PublicKey
  liqPoolMsolLeg: PublicKey
  liqPoolMsolLegAuthority: PublicKey
  reservePda: PublicKey
  msolMintAuthority: PublicKey
  treasuryMsolAccount: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  marinadeProgram: PublicKey
}

export const loadMarinadeAccounts = async (
  _connection: Connection
): Promise<MarinadeAccounts> => {
  return {
    marinadeState: MARINADE_STATE,
    msolMint: MSOL_MINT,
    liqPoolSolLeg: LIQ_POOL_SOL_LEG,
    liqPoolMsolLeg: LIQ_POOL_MSOL_LEG,
    liqPoolMsolLegAuthority: LIQ_POOL_MSOL_LEG_AUTHORITY,
    reservePda: RESERVE_PDA,
    msolMintAuthority: MSOL_MINT_AUTHORITY,
    treasuryMsolAccount: TREASURY_MSOL_ACCOUNT,
    systemProgram: SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
    marinadeProgram: MARINADE_PROGRAM_ID,
  }
}
