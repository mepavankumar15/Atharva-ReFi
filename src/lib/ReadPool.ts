import { PublicKey } from '@solana/web3.js'
import { getProgram } from './program'
import { POOL_PDA } from '../constants/addresses'

export const fetchPoolState = async (
  connection: any,
  wallet?: any
) => {
  try {
    const program = getProgram(connection, wallet)

    const poolAccount = await program.account.speciesPool.fetch(
      POOL_PDA
    )

    return poolAccount
  } catch (err) {
    console.warn('Pool not ready yet', err)
    return null
  }
}
