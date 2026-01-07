import { useState } from 'react'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'

import { fetchPool } from '../lib/ReadPool'
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

  const [totalStakedSol, setTotalStakedSol] = useState(0)
  const [yieldBps, setYieldBps] = useState<number | null>(null)
  const [vault, setVault] = useState<string | null>(null)
  const [speciesName, setSpeciesName] = useState<string>('Conservation Pool')
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const pool = await fetchPool(
        { connection },
        organizationPubkey,
        speciesId
      )

      if (!pool) {
        setLoading(false)
        return
      }

      setTotalStakedSol(Number(pool.totalDeposits) / 1e9)
      setYieldBps(pool.organizationYieldBps)
      setVault(pool.vault.toBase58())
      setSpeciesName(pool.speciesName)
    } finally {
      setLoading(false)
    }
  }

  useAutoRefresh(refresh)

  // Animated values
  const animatedStaked = useAnimatedNumber(totalStakedSol)

  const userPct =
    yieldBps !== null ? 100 - yieldBps : 0
  const conservationPct =
    yieldBps !== null ? yieldBps : 0

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
