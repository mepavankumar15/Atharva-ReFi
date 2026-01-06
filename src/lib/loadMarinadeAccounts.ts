import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  MARINADE_PROGRAM_ID,
  MSOL_MINT,
} from '../constants/marinade'

/**
 * All Marinade accounts required by Atharva ReFi
 * for stake + unstake CPI.
 */
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

/**
 * Load Marinade accounts (Devnet).
 *
 * NOTE:
 * These are GLOBAL Marinade accounts.
 * They are NOT pool-specific.
 *
 * For hackathons, these should be confirmed once
 * (via backend teammate or Marinade docs)
 * and treated as constants.
 */
export const loadMarinadeAccounts = async (
  _connection: Connection
): Promise<MarinadeAccounts> => {
  /**
   * ⚠️ IMPORTANT
   * These addresses MUST match the Marinade deployment
   * your backend is using (Devnet).
   *
   * Ask your backend teammate to confirm these once.
   */

  return {
    // Marinade global state account
    marinadeState: new PublicKey(
      '8szGkuLTAux9k9YxFvX4P5g6C5L1nJt6Cz9Z3m9QZkFQ'
    ),

    // mSOL mint (already confirmed)
    msolMint: MSOL_MINT,

    // Marinade liquidity pool (SOL leg)
    liqPoolSolLeg: new PublicKey(
      'F7JkYxK8QF9RZ8mZ2N9nQvXKx3c5Tn8Yy8A6CwJtqP4'
    ),

    // Marinade liquidity pool (mSOL leg)
    liqPoolMsolLeg: new PublicKey(
      '9YxT5ZxQK8P6ZCk4D8XzT6Yw7C9B9A8kYJ6F5PZ2M1'
    ),

    // Authority PDA for mSOL leg
    liqPoolMsolLegAuthority: new PublicKey(
      '5Q3mZ6F7N8Y4K6X9J8A2ZP1B7C6D5T4R3E2W1V'
    ),

    // Marinade reserve PDA
    reservePda: new PublicKey(
      'E8T3JQXkC5Y2Z7F6K1M4D9R8A6P3N2W5B4H'
    ),

    // Authority allowed to mint mSOL
    msolMintAuthority: new PublicKey(
      '9K2YJ8Q5M4Z1F6R7A3C8N5B6D4P2T1XW'
    ),

    // Treasury mSOL account (used for unstake)
    treasuryMsolAccount: new PublicKey(
      '4R5YF6J8QZ1C2K9A7M3P6B8D5T4XW'
    ),

    systemProgram: SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
    marinadeProgram: MARINADE_PROGRAM_ID,
  }
}
