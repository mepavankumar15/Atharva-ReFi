import { getMint } from '@solana/spl-token'
import { LP_MINT } from '../constants/addresses'

export const getTotalLpSupply = async (
  connection: any
): Promise<number | null> => {
  try {
    const mint = await getMint(connection, LP_MINT)
    return Number(mint.supply) / 1e9
  } catch {
    // LP mint not deployed yet
    return null
  }
}
