import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'

import Navbar from '../components/Navbar'
import PoolOverview from '../components/PoolOverview'
import StakeWithdraw from '../components/StakeWithdraw'
import ImpactPanel from '../components/ImpactPanel'
import Footer from '../components/Footer'

import { ORGANIZATION_PUBKEY, SPECIES_ID } from '../constants/pool'
import { fetchPool } from '../lib/ReadPool'
import { loadMarinadeAccounts } from '../lib/loadMarinadeAccounts'
import { PoolAccount } from '../types/pool'

export default function Home() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [pool, setPool] = useState<PoolAccount | null>(null)
  const [marinade, setMarinade] = useState<any | null>(null)

  // Load pool
  useEffect(() => {
    fetchPool(
      { connection, wallet },
      ORGANIZATION_PUBKEY,
      SPECIES_ID
    ).then(setPool)
  }, [connection, wallet.publicKey])

  // Load marinade (once)
  useEffect(() => {
    loadMarinadeAccounts(connection).then(setMarinade)
  }, [connection])

  return (
    <>
      <Navbar />

      <main>
        <PoolOverview
          organizationPubkey={ORGANIZATION_PUBKEY}
          speciesId={SPECIES_ID}
        />

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

        <Footer />
      </main>
    </>
  )
}
