import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

import { getSolBalance } from '../lib/ReadBalances'
import { getLpBalance } from '../lib/readLpBalance'
import { getTotalLpSupply } from '../lib/readLpSupply'
import { useAutoRefresh } from '../lib/useAutoRefresh'
import { useAnimatedNumber } from '../lib/useAnimatedNumbers'

export default function ImpactPanel() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [sol, setSol] = useState(0)
  const [lp, setLp] = useState(0)
  const [totalLp, setTotalLp] = useState<number | null>(null)
  const [ownership, setOwnership] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    if (!wallet.publicKey) {
      setLoading(false)
      return
    }

    const [solBal, lpBal, total] = await Promise.all([
      getSolBalance(connection, wallet.publicKey),
      getLpBalance(connection, wallet.publicKey),
      getTotalLpSupply(connection),
    ])

    setSol(solBal)
    setLp(lpBal)
    setTotalLp(total)

    if (total && total > 0) {
      setOwnership((lpBal / total) * 100)
    } else {
      setOwnership(null)
    }

    setLoading(false)
  }

  useAutoRefresh(refresh)

  // 🔹 Animated values
  const animatedSol = useAnimatedNumber(sol)
  const animatedLp = useAnimatedNumber(lp)
  const animatedOwnership = useAnimatedNumber(ownership ?? 0)

  return (
    <div className="card">
      <h3>My Impact</h3>

      {!wallet.publicKey && (
        <p>Connect your wallet to view your impact</p>
      )}

      {wallet.publicKey && loading && (
        <>
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
        </>
      )}

      {wallet.publicKey && !loading && (
        <>
          <p>
            SOL Balance:{' '}
            <strong>{animatedSol.toFixed(4)}</strong>
          </p>
              <div className="separator" />
          <p>
            LP Tokens:{' '}
            <strong>{animatedLp.toFixed(4)}</strong>
          </p>

          {ownership !== null && (
            <p>
              Pool Ownership:{' '}
              <strong>{animatedOwnership.toFixed(2)}%</strong>
            </p>
          )}

          {ownership === null && (
            <p style={{ color: '#9290C3' }}>
              Pool not initialized yet
            </p>
          )}
        </>
      )}
    </div>
  )
}
