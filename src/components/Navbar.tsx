import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTheme } from '../lib/useTheme'
import { useMounted } from '../lib/useMounted'

// Disable SSR for wallet button
const WalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      m => m.WalletMultiButton
    ),
  { ssr: false }
)

export default function Navbar() {
  const mounted = useMounted()
  const { toggleTheme } = useTheme()
  const { publicKey } = useWallet()

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!mounted) return

    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [mounted])

  if (!mounted) {
    // 🔒 Prevent hydration mismatch
    return null
  }

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}…${publicKey
        .toBase58()
        .slice(-4)}`
    : null

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <div className="navbar-left">
          <div
            className="navbar-logo-text"
            title="Atharva ReFi"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          >
            Ath
          </div>

          <div className="navbar-brand">Atharva ReFi</div>
          <span className="network-badge">Devnet</span>
        </div>

        <div className="navbar-right">
          {shortAddress && (
            <button title={publicKey?.toBase58()}>
              {shortAddress}
            </button>
          )}

          <button onClick={toggleTheme}>Theme</button>

          <WalletMultiButton />
        </div>
      </div>
    </nav>
  )
}
