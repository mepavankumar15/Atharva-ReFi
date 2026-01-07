import { getAssociatedTokenAddress } from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'

export const getLpBalance = async (
  connection: Connection,
  userPubkey: PublicKey,
  poolMint: PublicKey
): Promise<number> => {
  try {
    const ata = await getAssociatedTokenAddress(
      poolMint,
      userPubkey
    )

    const account =
      await connection.getTokenAccountBalance(ata)

    return Number(account.value.amount) / 1e9
  } catch {
    return 0
  }
}
