import { useEffect, useState } from 'react'
import { PublicKey } from '@solana/web3.js'
import { fetchPool } from '../lib/ReadPool'

export const usePool = (
  wallet: any,
  organizationPubkey: PublicKey,
  speciesId: Uint8Array
) => {
  const [state, setState] = useState<{
    loading: boolean
    pool: any | null
  }>({
    loading: true,
    pool: null,
  })

  useEffect(() => {
    if (!wallet?.publicKey) {
      setState({ loading: false, pool: null })
      return
    }

    let cancelled = false

    const load = async () => {
      setState({ loading: true, pool: null })

      const pool = await fetchPool(
        wallet,
        organizationPubkey,
        speciesId
      )

      if (!cancelled) {
        setState({ loading: false, pool })
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [wallet?.publicKey, organizationPubkey.toBase58()])

  return state
}
