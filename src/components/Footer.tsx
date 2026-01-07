import { explorerAddress } from '../lib/explorer'
import { PROGRAM_ID } from '../lib/program'

export default function Footer() {
  return (
    <footer style={{ marginTop: '40px', opacity: 0.7 }}>
      <p>Built on Solana Devnet</p>
      <a
        href={explorerAddress(PROGRAM_ID.toBase58())}
        target="_blank"
        rel="noreferrer"
      >
        @Atharva ReFi Program avyu.rs and devwraithe
      </a>
    </footer>
  )
}
