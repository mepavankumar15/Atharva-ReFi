import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'

import { stake } from '../lib/stake'
import { unstake } from '../lib/unstake'
import { getLpBalance } from '../lib/readLpBalance'
import { MarinadeAccounts } from '../lib/loadMarinadeAccounts'
import { explorerTx } from '../lib/explorer'

type Props = {
  organizationPubkey: PublicKey
  speciesId: Uint8Array
  marinade: MarinadeAccounts | null
  poolMint: PublicKey | null
  poolReady: boolean
}

export default function StakeWithdraw({
  organizationPubkey,
  speciesId,
  marinade,
  poolMint,
  poolReady,
}: Props) {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [stakeAmt, setStakeAmt] = useState('')
  const [withdrawAmt, setWithdrawAmt] = useState('')
  const [lpBalance, setLpBalance] = useState(0)
  const [txLink, setTxLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!poolReady || !wallet.publicKey || !poolMint) {
      setLpBalance(0)
      return
    }

    getLpBalance(connection, wallet.publicKey, poolMint)
      .then(setLpBalance)
  }, [connection, wallet.publicKey, poolMint, poolReady, txLink])

  const handleStake = async () => {
    if (!poolReady || !wallet.publicKey || !marinade) return
    setLoading(true)
    try {
      const sig = await stake(
        connection,
        wallet,
        Number(stakeAmt),
        organizationPubkey,
        speciesId,
        marinade
      )
      setTxLink(explorerTx(sig))
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!poolReady || !wallet.publicKey || !marinade) return
    setLoading(true)
    try {
      const sig = await unstake(
        connection,
        wallet,
        Number(withdrawAmt),
        organizationPubkey,
        speciesId,
        marinade
      )
      setTxLink(explorerTx(sig))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3>Stake SOL</h3>

      {!poolReady && (
        <p style={{ opacity: 0.6 }}>
          Pool not live yet — preview mode
        </p>
      )}

      <input
        type="number"
        placeholder="Amount in SOL"
        value={stakeAmt}
        onChange={(e) => setStakeAmt(e.target.value)}
        disabled={loading}
      />

      <button disabled={!poolReady || loading} onClick={handleStake}>
        Stake & Protect
      </button>

      <div className="separator" />

      <h3>Withdraw</h3>
      <p>Your LP Balance: {poolReady ? lpBalance.toFixed(4) : '0.0000'}</p>

      <input
        type="number"
        placeholder="LP amount"
        value={withdrawAmt}
        onChange={(e) => setWithdrawAmt(e.target.value)}
        disabled={loading}
      />

      <button
        disabled={!poolReady || loading || lpBalance === 0}
        onClick={handleWithdraw}
      >
        Withdraw
      </button>

      {txLink && (
        <p>
          <a href={txLink} target="_blank" rel="noreferrer">
            View Transaction
          </a>
        </p>
      )}
    </div>
  )
}
