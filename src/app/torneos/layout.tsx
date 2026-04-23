import React from 'react'
import TorneoNavbar from './crear/ui/TorneoNavbar'

const TorneosLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="torneos-layout">
      <TorneoNavbar />
      {children}
    </section>
  )
}

export default TorneosLayout