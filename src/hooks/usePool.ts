import { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { fetchPoolState } from '../lib/ReadPool'
import { connect } from 'http2'


export const usePool = (
  connection: Connection,
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

      const pool = await fetchPoolState(
        connection,
        wallet,
        organizationPubkey,
        speciesId,
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
