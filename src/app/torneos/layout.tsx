import React from 'react'
import TorneoNavbar from './crear/ui/TorneoNavbar'

const TorneosLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <TorneoNavbar />
      {children}
    </section>
  )
}

export default TorneosLayout