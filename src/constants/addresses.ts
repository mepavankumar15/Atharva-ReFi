import { PublicKey } from '@solana/web3.js'

// Temporary valid placeholder (safe for dev)
const DUMMY_PUBKEY = new PublicKey(
  '11111111111111111111111111111111'
)

// Program + Accounts (replace when backend is ready)
export const PROGRAM_ID = DUMMY_PUBKEY
export const GLOBAL_STATE_PDA = DUMMY_PUBKEY
export const POOL_PDA = DUMMY_PUBKEY
export const VAULT_PDA = DUMMY_PUBKEY
export const LP_MINT = DUMMY_PUBKEY
