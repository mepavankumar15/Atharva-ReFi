import { PublicKey } from '@solana/web3.js'

export const ORGANIZATION_PUBKEY = new PublicKey(
  'BkDW9kxJxVC2KGDs94GQRpkowbWfpG1N7sX7HqsNCSL7'
)

export const SPECIES_ID = new Uint8Array(32)
SPECIES_ID.set(Buffer.from('tiger'))