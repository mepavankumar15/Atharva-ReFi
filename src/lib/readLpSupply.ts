import { getMint } from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'

export const getTotalLpSupply = async (
  connection: Connection,
  poolMint: PublicKey
): Promise<number | null> => {
  try {
    const mint = await getMint(connection, poolMint)
    return Number(mint.supply) / 1e9
  } catch {
    return null
  }
}
