import { getAssociatedTokenAddress } from '@solana/spl-token'
import { LP_MINT } from '../constants/addresses'

export const getLpBalance = async (
  connection: any,
  userPubkey: any
) => {
  try {
    const ata = await getAssociatedTokenAddress(
      LP_MINT,
      userPubkey
    )

    const account = await connection.getTokenAccountBalance(ata)
    return Number(account.value.amount) / 1e9
  } catch {
    return 0
  }
}
