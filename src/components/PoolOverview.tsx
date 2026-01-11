import { useState } from 'react'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'

import { fetchPoolState } from '../lib/ReadPool'
import { useAutoRefresh } from '../lib/useAutoRefresh'
import { useAnimatedNumber } from '../lib/useAnimatedNumbers'
import { explorerAddress } from '../lib/explorer'

type Props = {
  organizationPubkey: PublicKey
  speciesId: Uint8Array
}

export default function PoolOverview({
  organizationPubkey,
  speciesId,
}: Props) {
  const { connection } = useConnection()

  const [pool, setPool] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const result = await fetchPoolState(
        { connection },
        null,
        organizationPubkey,
        speciesId
      )
      setPool(result)
    } finally {
      setLoading(false)
    }
  }

  useAutoRefresh(refresh)

  // -------------------------
  // AUTHORITATIVE FLAGS
  // -------------------------
  const poolExists = !!pool
  const poolLive = poolExists && pool.is_active === true

  // -------------------------
  // VALUES (REAL OR FALLBACK)
  // -------------------------
  const totalStakedSol = poolExists
    ? Number(pool.totalDeposits) / 1e9
    : 0

  const yieldBps = poolExists
    ? pool.organizationYieldBps
    : 20

  const vault = poolExists
    ? pool.vault.toBase58()
    : null

  const speciesName = poolExists
    ? pool.speciesName
    : 'Conservation Pool'

  // -------------------------
  // ANIMATIONS
  // -------------------------
  const animatedStaked = useAnimatedNumber(totalStakedSol)
  const animatedUserPct = useAnimatedNumber(100 - yieldBps)
  const animatedConservationPct = useAnimatedNumber(yieldBps)

  return (
    <div className="card">
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
            <strong>
              {animatedStaked.toFixed(2)} SOL
              {!poolExists && ' (preview)'}
            </strong>
          </p>

          <p>Yield Source: Marinade (mSOL)</p>

          <p>
            Yield Split:{' '}
            <strong>
              {animatedUserPct.toFixed(0)}% Users /{' '}
              {animatedConservationPct.toFixed(0)}% Conservation
            </strong>
          </p>

          {!poolExists && (
            <p style={{ color: '#9290C3' }}>
              Pool account not found on-chain yet
            </p>
          )}

          {poolExists && !poolLive && (
            <p style={{ color: '#FFA726' }}>
              Pool exists but is currently inactive
            </p>
          )}

          {vault && (
            <p>
              Pool Vault:{' '}
              <a
                href={explorerAddress(vault)}
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
