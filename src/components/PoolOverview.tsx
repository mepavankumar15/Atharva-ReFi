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

      setPool(result ?? null)
    } finally {
      setLoading(false)
    }
  }

  useAutoRefresh(refresh)

  // -------------------------
  // POOL NOT INITIALIZED
  // -------------------------
  const poolInitialized =
    pool &&
    typeof pool === 'object' &&
    'totalDeposits' in pool &&
    'organizationYieldBps' in pool

  // -------------------------
  // DUMMY VALUES
  // -------------------------
  const totalStakedSol = poolInitialized
    ? Number(pool.totalDeposits) / 1e9
    : 0

  const yieldBps = poolInitialized
    ? pool.organizationYieldBps
    : 20 // default dummy %

  const vault = poolInitialized && pool.vault
    ? pool.vault.toBase58()
    : null

  const speciesName = poolInitialized && pool.speciesName
    ? pool.speciesName
    : 'Conservation Pool (Not Live Yet)'

  // -------------------------
  // ANIMATIONS
  // -------------------------
  const animatedStaked = useAnimatedNumber(totalStakedSol)

  const userPct = 100 - yieldBps
  const conservationPct = yieldBps

  const animatedUserPct = useAnimatedNumber(userPct)
  const animatedConservationPct = useAnimatedNumber(conservationPct)

  return (
    <div className="card">
      <h3>{speciesName}</h3>

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
              {!poolInitialized && ' (preview)'}
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

          {!poolInitialized && (
            <p style={{ color: '#9290C3' }}>
              Pool not initialized on-chain yet
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
