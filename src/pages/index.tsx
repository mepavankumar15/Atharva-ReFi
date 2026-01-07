import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

import Navbar from '../components/Navbar'
import PoolOverview from '../components/PoolOverview'
import StakeWithdraw from '../components/StakeWithdraw'
import ImpactPanel from '../components/ImpactPanel'
import Footer from '../components/Footer'

import { ORGANIZATION_PUBKEY, SPECIES_ID } from '../constants/pool'
import { fetchPoolState } from '../lib/ReadPool'
import { loadMarinadeAccounts } from '../lib/loadMarinadeAccounts'
import { PoolAccount } from '../types/pool'
import { MarinadeAccounts } from '../lib/loadMarinadeAccounts'

export default function Home() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [pool, setPool] = useState<PoolAccount | null>(null)
  const [marinade, setMarinade] = useState<MarinadeAccounts | null>(null)
  const [loadingPool, setLoadingPool] = useState(true)

  // -----------------------------
  // Load Pool (SAFE + TYPED)
  // -----------------------------
  useEffect(() => {
    let cancelled = false

    const loadPool = async () => {
      try {
        const result = await fetchPoolState(
          connection,
          wallet,
          ORGANIZATION_PUBKEY,
          SPECIES_ID
        )

        if (!cancelled) {
          setPool((result as PoolAccount) ?? null)
        }
      } catch {
        if (!cancelled) setPool(null)
      } finally {
        if (!cancelled) setLoadingPool(false)
      }
    }

    loadPool()

    return () => {
      cancelled = true
    }
  }, [connection, wallet.publicKey])

  // -----------------------------
  // Load Marinade (ONCE)
  // -----------------------------
  useEffect(() => {
    loadMarinadeAccounts(connection).then(setMarinade)
  }, [connection])

  return (
    <>
      <Navbar />

      <main>
        {/* Pool Overview always visible */}
        <PoolOverview
          organizationPubkey={ORGANIZATION_PUBKEY}
          speciesId={SPECIES_ID}
        />

        {/* Loading state */}
        {loadingPool && (
          <div className="card">
            <p>Loading pool…</p>
          </div>
        )}

        {/* Pool NOT initialized */}
        {!loadingPool && !pool && (
          <div className="card">
            <h3>Pool not initialized</h3>
            <p>
              This conservation pool has not been created on devnet yet.
            </p>
          </div>
        )}

        {/* Pool initialized */}
        {pool && marinade && (
          <>
            <StakeWithdraw
              poolMint={pool.poolMint}
              organizationPubkey={ORGANIZATION_PUBKEY}
              speciesId={SPECIES_ID}
              marinade={marinade}
            />

            <ImpactPanel poolMint={pool.poolMint} />
          </>
        )}

        {/* Debug (optional, safe to remove later) */}
        <div style={{ marginTop: 20, opacity: 0.7 }}>
          <p>Pool loaded: {pool ? 'YES' : 'NO'}</p>
          <p>Marinade loaded: {marinade ? 'YES' : 'NO'}</p>
        </div>

        <Footer />
      </main>
    </>
  )
}
