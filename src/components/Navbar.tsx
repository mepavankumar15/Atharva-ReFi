import { useEffect, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { useTheme } from '../lib/useTheme'

export default function Navbar() {
  const { toggleTheme } = useTheme()
  const { publicKey } = useWallet()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}…${publicKey
        .toBase58()
        .slice(-4)}`
    : null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Left: Ath logo + brand */}
        <div className="navbar-left">
          <div
            className="navbar-logo-text"
            title="Atharva ReFi"
            onClick={scrollToTop}
          >
            Ath
          </div>

          <div className="navbar-brand">Atharva ReFi</div>
          <span className="network-badge">Devnet</span>
        </div>

        {/* Right: Actions */}
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
