import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useTheme } from '../lib/useTheme'

export default function Header() {
  const { toggleTheme } = useTheme()

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}
    >
      <h2>Atharva ReFi</h2>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={toggleTheme}>Theme</button>
        <WalletMultiButton />
      </div>
    </header>
  )
}
