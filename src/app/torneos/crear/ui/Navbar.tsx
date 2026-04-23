import Link from "next/link"
import React from "react"

const links = [
  { href: "/", label: "Inicio" },
  { href: "/torneos", label: "Torneos" },
  { href: "/torneos/crear", label: "Crear Torneo" },
]

const Navbar = () => {
  return (
    <nav className="flex justify-around p-4 w-xl mx-auto">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="hover:bg-slate-100 px-4 py-1 rounded-full">
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export default Navbar