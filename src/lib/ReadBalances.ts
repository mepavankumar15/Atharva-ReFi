import { LAMPORTS_PER_SOL } from '@solana/web3.js'

export const getSolBalance = async (
  connection: any,
  publicKey: any
) => {
  if (!publicKey) return 0

  const lamports = await connection.getBalance(publicKey)
  return lamports / LAMPORTS_PER_SOL
}
