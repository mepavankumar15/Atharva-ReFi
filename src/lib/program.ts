import { AnchorProvider, Program, Idl } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import idl from '../constants/atharva_refi.json'

// 🔒 Program ID — must match declare_id! in lib.rs
export const PROGRAM_ID = new PublicKey(
  '5MQdy7SUtMR5qQqryuizd7WXKE18RRn7sNS4uX64ih96'
)

// 🔌 Devnet connection (stable, confirmed)
const connection = new Connection(
  'https://api.devnet.solana.com',
  'confirmed'
)

// Provider factory
export const getProvider = (wallet: any) => {
  if (!wallet) throw new Error('Wallet not connected')

  return new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed',
  })
}

// Program factory
export const getProgram = (wallet: any) => {
  const provider = getProvider(wallet)

  return new Program(
    idl as unknown as Idl,
    PROGRAM_ID,
    provider
  )
}
