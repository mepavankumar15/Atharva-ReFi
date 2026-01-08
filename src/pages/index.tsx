import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'

import Navbar from '../components/Navbar'
import PoolOverview from '../components/PoolOverview'
import StakeWithdraw from '../components/StakeWithdraw'
import ImpactPanel from '../components/ImpactPanel'
import Footer from '../components/Footer'

import { ORGANIZATION_PUBKEY, SPECIES_ID } from '../constants/pool'
import { fetchPoolState } from '../lib/ReadPool'
import { loadMarinadeAccounts } from '../lib/loadMarinadeAccounts'
import { PoolAccount } from '../types/pool'

export default function Home() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [pool, setPool] = useState<PoolAccount | null>(null)
  const [marinade, setMarinade] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPoolState(
      connection,
      wallet,
      ORGANIZATION_PUBKEY,
      SPECIES_ID
    ).then((p) => {
      setPool(p)
      setLoading(false)
    })
  }, [connection, wallet.publicKey])

  useEffect(() => {
    loadMarinadeAccounts(connection).then(setMarinade)
  }, [connection])

  const poolReady = !!pool && !!marinade

  return (
    <>
      <Navbar />

      <main style={{ maxWidth: 900, margin: '0 auto' }}>
        <PoolOverview
          organizationPubkey={ORGANIZATION_PUBKEY}
          speciesId={SPECIES_ID}
        />

        <StakeWithdraw
          poolReady={poolReady}
          poolMint={pool?.poolMint ?? null}
          organizationPubkey={ORGANIZATION_PUBKEY}
          speciesId={SPECIES_ID}
          marinade={marinade}
        />

        <ImpactPanel
          poolReady={poolReady}
          poolMint={pool?.poolMint ?? null}
        />

        {!poolReady && !loading && (
          <div className="card">
            <h3>Pool not initialized</h3>
            <p>
              This conservation pool is not yet active on devnet.
              You are viewing a preview.
            </p>
          </div>
        )}

        <Footer />
      </main>
    </>
  )
}
