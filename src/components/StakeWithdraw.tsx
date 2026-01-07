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
}

export default function StakeWithdraw({
  organizationPubkey,
  speciesId,
  marinade,
  poolMint,
}: Props) {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [stakeAmt, setStakeAmt] = useState('')
  const [withdrawAmt, setWithdrawAmt] = useState('')
  const [lpBalance, setLpBalance] = useState<number>(0)
  const [txLink, setTxLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const poolReady =
    !!wallet.publicKey && !!marinade && !!organizationPubkey

  // Fetch LP balance only if pool exists
  useEffect(() => {
  if (
    !wallet.publicKey ||
    !poolMint ||
    !marinade
  ) {
    setLpBalance(0)
    return
  }

  getLpBalance(
    connection,
    wallet.publicKey,
    poolMint
  ).then(setLpBalance)
}, [connection, wallet.publicKey, poolMint, marinade, txLink])

  const handleStake = async () => {
    if (!stakeAmt || !wallet.publicKey || !marinade) return

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
    if (!withdrawAmt || !wallet.publicKey || !marinade) return

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
      <h3>Stake & Withdraw</h3>

      {!poolReady && (
        <p style={{ opacity: 0.6 }}>
          Pool not initialized yet
        </p>
      )}

      <input
        type="number"
        placeholder="Amount in SOL"
        value={stakeAmt}
        onChange={(e) => setStakeAmt(e.target.value)}
        disabled={!poolReady || loading}
      />

      <button
        disabled={!poolReady || loading}
        onClick={handleStake}
      >
        {loading ? 'Processing…' : 'Stake SOL'}
      </button>

      <div className="separator" />

      <p>
        Your LP Balance:{' '}
        <strong>
          {poolReady ? lpBalance.toFixed(4) : '0.0000'}
        </strong>
      </p>

      <input
        type="number"
        placeholder="LP amount"
        value={withdrawAmt}
        onChange={(e) => setWithdrawAmt(e.target.value)}
        disabled={!poolReady || loading}
      />

      <button
        disabled={!poolReady || loading || lpBalance === 0}
        onClick={handleWithdraw}
      >
        Withdraw
      </button>

      {txLink && (
        <p style={{ marginTop: '10px' }}>
          <a
            href={txLink}
            target="_blank"
            rel="noreferrer"
          >
            View transaction on Explorer
          </a>
        </p>
      )}
    </div>
  )
}
