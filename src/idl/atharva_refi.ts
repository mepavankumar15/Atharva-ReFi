import idl from '../constants/atharva_refi.json'

/**
 * FIXED Anchor IDL
 * Strips non-standard fields that break Program()
 */
export const ATHARVA_IDL = {
  version: idl.metadata?.version ?? '0.1.0',
  name: idl.metadata?.name ?? 'atharva_refi',
  instructions: idl.instructions,
  accounts: idl.accounts,
  types: idl.types,
  events: idl.events,
  errors: idl.errors,
} as const

export type AtharvaRefiIdl = typeof ATHARVA_IDL
