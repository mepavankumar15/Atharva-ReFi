import { useEffect, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { stakeSol } from '../lib/stake'
import { withdrawSol } from '../lib/withdraw'
import { getLpBalance } from '../lib/readLpBalance'
import { explorerTx } from '../lib/explorer'

export default function StakeWithdraw() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const [stakeAmt, setStakeAmt] = useState('')
  const [withdrawAmt, setWithdrawAmt] = useState('')
  const [lpBalance, setLpBalance] = useState<number>(0)
  const [txLink, setTxLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!wallet.publicKey) return
    getLpBalance(connection, wallet.publicKey).then(setLpBalance)
  }, [connection, wallet.publicKey, txLink])

  const handleStake = async () => {
    if (!stakeAmt) return
    setLoading(true)
    try {
      const sig = await stakeSol(connection, wallet, Number(stakeAmt))
      setTxLink(explorerTx(sig))
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmt) return
    setLoading(true)
    try {
      const sig = await withdrawSol(connection, wallet, Number(withdrawAmt))
      setTxLink(explorerTx(sig))
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
      />

      <button disabled={!wallet.publicKey || loading} onClick={handleStake}>
        {loading ? 'Processing…' : 'Stake & Protect'}
      </button>

      <div className="separator" />

      <h3>Withdraw</h3>
      <p>Your LP Balance: {lpBalance.toFixed(4)}</p>

      <input
        type="number"
        placeholder="LP amount"
        value={withdrawAmt}
        max={lpBalance}
        onChange={(e) => setWithdrawAmt(e.target.value)}
      />

      <button
        disabled={!wallet.publicKey || loading || lpBalance === 0}
        onClick={handleWithdraw}
      >
        Withdraw
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
