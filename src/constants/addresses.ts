import { PublicKey } from '@solana/web3.js'
import { PROGRAM_ID } from '../lib/program'

// ===== Seeds (MUST MATCH BACKEND EXACTLY) =====
export const POOL_SEED = 'pool'
export const POOL_VAULT_SEED = 'pool_vault'
export const POOL_MINT_SEED = 'pool_mint'
export const ORG_VAULT_SEED = 'organization_vault'

// ===== PDA DERIVATIONS =====

// Pool PDA
export const getPoolPda = (
  organizationPubkey: PublicKey,
  speciesId: Uint8Array // MUST be 32 bytes
) =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from(POOL_SEED),
      organizationPubkey.toBuffer(),
      Buffer.from(speciesId),
    ],
    PROGRAM_ID
  )

// Pool SOL Vault PDA
export const getPoolVaultPda = (
  organizationPubkey: PublicKey,
  speciesId: Uint8Array
) =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from(POOL_VAULT_SEED),
      organizationPubkey.toBuffer(),
      Buffer.from(speciesId),
    ],
    PROGRAM_ID
  )
