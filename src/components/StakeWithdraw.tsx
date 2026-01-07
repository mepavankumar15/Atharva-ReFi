import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'

import { stake } from '../lib/stake'
import { unstake } from '../lib/unstake'
import { getLpBalance } from '../lib/readLpBalance'
import { explorerTx } from '../lib/explorer'
import { MarinadeAccounts } from '../lib/loadMarinadeAccounts'

type Props = {
  poolMint: PublicKey
  organizationPubkey: PublicKey
  speciesId: Uint8Array
  marinade: MarinadeAccounts | null
}

export default function StakeWithdraw({
  poolMint,
  organizationPubkey,
  speciesId,
  marinade,
}: Props) {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [stakeAmt, setStakeAmt] = useState('')
  const [unstakeAmt, setUnstakeAmt] = useState('')
  const [lpBalance, setLpBalance] = useState(0)
  const [txLink, setTxLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!wallet.publicKey || !poolMint) return

    getLpBalance(connection, wallet.publicKey, poolMint)
      .then(setLpBalance)
      .catch(() => setLpBalance(0))
  }, [connection, wallet.publicKey, poolMint, txLink])

  const handleStake = async () => {
    if (!stakeAmt || !marinade || !wallet.publicKey) return

    setLoading(true)
    try {
      const sig = await stake(
        wallet,
        Number(stakeAmt),
        organizationPubkey,
        speciesId,
        marinade
      )
      setTxLink(explorerTx(sig))
      setStakeAmt('')
    } finally {
      setLoading(false)
    }
  }

  const handleUnstake = async () => {
    if (!unstakeAmt || !marinade || !wallet.publicKey) return

    setLoading(true)
    try {
      const sig = await unstake(
        wallet,
        Number(unstakeAmt),
        organizationPubkey,
        speciesId,
        marinade
      )
      setTxLink(explorerTx(sig))
      setUnstakeAmt('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3>Stake SOL</h3>

      <input
        type="number"
        placeholder="Amount in SOL"
        value={stakeAmt}
        onChange={(e) => setStakeAmt(e.target.value)}
        min="0"
      />

      <button
        disabled={!wallet.publicKey || !marinade || loading}
        onClick={handleStake}
      >
        {loading ? 'Processing…' : 'Stake & Protect'}
      </button>

      <div className="separator" />

      <h3>Unstake mSOL</h3>
      <p>Your Pool LP Balance: {lpBalance.toFixed(4)}</p>

      <input
        type="number"
        placeholder="mSOL amount"
        value={unstakeAmt}
        max={lpBalance}
        onChange={(e) => setUnstakeAmt(e.target.value)}
        min="0"
      />

      <button
        disabled={
          !wallet.publicKey ||
          !marinade ||
          loading ||
          lpBalance === 0
        }
        onClick={handleUnstake}
      >
        Unstake
      </button>

      {txLink && (
        <p style={{ marginTop: '10px' }}>
          <a href={txLink} target="_blank" rel="noreferrer">
            View transaction on Explorer
          </a>
        </p>
      )}
    </div>
  )
}
