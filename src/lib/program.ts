import * as anchor from '@project-serum/anchor'
import { Program } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { WalletContextState } from '@solana/wallet-adapter-react'

import { getAnchorProvider } from './anchorClient'
import { IDL } from '../constants/idl'
import { PROGRAM_ID } from '../constants/addresses'

export const getProgram = (
  connection: Connection,
  wallet?: WalletContextState
): Program => {
  const provider = wallet && wallet.publicKey
    ? getAnchorProvider(connection, wallet)
    : new anchor.AnchorProvider(
        connection,
        {} as any,
        { preflightCommitment: 'processed' }
      )

  return new Program(IDL, PROGRAM_ID, provider)
}
