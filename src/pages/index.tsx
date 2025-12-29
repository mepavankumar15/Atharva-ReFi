import Navbar from '../components/Navbar'
import PoolOverview from '../components/PoolOverview'
import StakeWithdraw from '../components/StakeWithdraw'
import ImpactPanel from '../components/ImpactPanel'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <PoolOverview />
        <StakeWithdraw />
        <ImpactPanel />
        <Footer />
      </main>
    </>
  )
}
