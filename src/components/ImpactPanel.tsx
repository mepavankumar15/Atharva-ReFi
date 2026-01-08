import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'

import { getSolBalance } from '../lib/ReadBalances'
import { getLpBalance } from '../lib/readLpBalance'

type Props = {
  poolMint: PublicKey | null
  poolReady: boolean
}

export default function ImpactPanel({
  poolMint,
  poolReady,
}: Props) {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [sol, setSol] = useState(0)
  const [lp, setLp] = useState(0)

  useEffect(() => {
    if (!wallet.publicKey) return

    getSolBalance(connection, wallet.publicKey)
      .then(setSol)

    if (poolReady && poolMint) {
      getLpBalance(connection, wallet.publicKey, poolMint)
        .then(setLp)
    }
  }, [connection, wallet.publicKey, poolReady, poolMint])

  return (
    <div className="card">
      <h3>My Impact</h3>

      {!wallet.publicKey && (
        <p>Connect wallet to view impact</p>
      )}

      {wallet.publicKey && (
        <>
          <p>SOL Balance: {sol.toFixed(4)}</p>
          <p>LP Tokens: {poolReady ? lp.toFixed(4) : '0.0000'}</p>
          <p>Sent to Conservation: {poolReady ? 'Live' : 'Preview'}</p>
        </>
      )}
    </div>
  )
}
