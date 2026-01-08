import { PublicKey } from '@solana/web3.js'

export const ORGANIZATION_PUBKEY = new PublicKey(
  'B3LqyyH4gUcQmaAecDR25MVooCKNtQExtcn45rRNbW6m'
)
export const SPECIES_ID_STRING = 'panthera_leo'

export const SPECIES_ID = new Uint8Array(32)
SPECIES_ID.set(Buffer.from(SPECIES_ID_STRING)) 