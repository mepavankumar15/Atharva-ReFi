import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

import { fetchPoolState } from '../lib/ReadPool'
import { fetchGlobalState } from '../lib/ReadGlobal'
import { useAutoRefresh } from '../lib/useAutoRefresh'
import { useAnimatedNumber } from '../lib/useAnimatedNumbers'
import { explorerAddress } from '../lib/explorer'

export default function PoolOverview() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [totalStakedSol, setTotalStakedSol] = useState(0)
  const [yieldBps, setYieldBps] = useState<number | null>(null)
  const [treasury, setTreasury] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const [pool, global] = await Promise.all([
        fetchPoolState(connection, wallet),
        fetchGlobalState(connection, wallet),
      ])

      if (pool?.totalStaked) {
        setTotalStakedSol(Number(pool.totalStaked) / 1e9)
      }

      if (global?.yieldBps !== undefined) {
        setYieldBps(global.yieldBps)
      }

      if (global?.treasury) {
        setTreasury(global.treasury.toBase58())
      }

      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useAutoRefresh(refresh)

  // 🔹 Animated values
  const animatedStaked = useAnimatedNumber(totalStakedSol)
  const animatedUserPct = useAnimatedNumber(
    yieldBps !== null ? 100 - yieldBps / 100 : 0
  )
  const animatedConservationPct = useAnimatedNumber(
    yieldBps !== null ? yieldBps / 100 : 0
  )

  return (
    <div className="card">
      <h3>🐯 Tiger Conservation Pool</h3>

      {loading && (
        <>
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
        </>
      )}

      {!loading && (
        <>
          <p>
            Total Staked:{' '}
            <strong>{animatedStaked.toFixed(2)} SOL</strong>
          </p>

          <p>Yield Source: Marinade (mSOL)</p>

          {yieldBps !== null && (
            <p>
              Yield Split:{' '}
              <strong>
                {animatedUserPct.toFixed(0)}% Users /{' '}
                {animatedConservationPct.toFixed(0)}% Conservation
              </strong>
            </p>
          )}

          {treasury && (
            <p>
              Treasury:{' '}
              <a
                href={explorerAddress(treasury)}
                target="_blank"
                rel="noreferrer"
              >
                View on Explorer
              </a>
            </p>
          )}
        </>
      )}
    </div>
  )
}
