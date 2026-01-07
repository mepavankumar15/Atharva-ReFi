import { PublicKey } from '@solana/web3.js'

export type PoolAccount = {
  organizationPubkey: PublicKey
  organizationName: string
  organizationYieldBps: number

  speciesName: string
  speciesId: string
  newSpeciesId: Uint8Array

  vault: PublicKey
  poolMint: PublicKey

  lastStreamedVaultSol: bigint | number
  lastStreamTs: bigint | number

  totalDeposits: bigint | number
  totalShares: bigint | number

  isActive: boolean
  isCrankScheduled: boolean

  poolBump: number
  orgVaultBump: number
  poolVaultBump: number
  poolMintBump: number
}
