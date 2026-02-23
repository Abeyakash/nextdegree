'use client'

import { useState } from "react"
import Link from "next/link"
import { GraduationCap, Menu, X } from "lucide-react"

export default function Header({ authStatus }: { authStatus: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const NavLinks = (
    <>
      <Link href="/" onClick={handleLinkClick} className="block py-3 px-4 text-gray-600 font-medium hover:text-amber-700 transition-colors md:py-0 md:px-0 md:border-b-2 md:border-transparent md:hover:border-amber-700">Home</Link>
      <Link href="/colleges" onClick={handleLinkClick} className="block py-3 px-4 text-gray-600 font-medium hover:text-amber-700 transition-colors md:py-0 md:px-0 md:border-b-2 md:border-transparent md:hover:border-amber-700">Colleges</Link>
      <Link href="/compare" onClick={handleLinkClick} className="block py-3 px-4 text-gray-600 font-medium hover:text-amber-700 transition-colors md:py-0 md:px-0 md:border-b-2 md:border-transparent md:hover:border-amber-700">Compare</Link>
      <Link href="/about" onClick={handleLinkClick} className="block py-3 px-4 text-gray-600 font-medium hover:text-amber-700 transition-colors md:py-0 md:px-0 md:border-b-2 md:border-transparent md:hover:border-amber-700">About</Link>
      <Link href="/help" onClick={handleLinkClick} className="block py-3 px-4 text-gray-600 font-medium hover:text-amber-700 transition-colors md:py-0 md:px-0 md:border-b-2 md:border-transparent md:hover:border-amber-700">Help</Link>
      <Link href="/faq" onClick={handleLinkClick} className="block py-3 px-4 text-gray-600 font-medium hover:text-amber-700 transition-colors md:py-0 md:px-0 md:border-b-2 md:border-transparent md:hover:border-amber-700">FAQ</Link>
      <Link href="/contact" onClick={handleLinkClick} className="block py-3 px-4 text-gray-600 font-medium hover:text-amber-700 transition-colors md:py-0 md:px-0 md:border-b-2 md:border-transparent md:hover:border-amber-700">Contact</Link>
    </>
  )

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link href="/" className="text-3xl font-extrabold text-black tracking-tight flex items-center">
            <GraduationCap className="w-8 h-8 mr-2 text-amber-700" />
            NextDegree
          </Link>

          <nav className="hidden md:flex space-x-10 items-center">{NavLinks}</nav>

          <div className="hidden md:block">
            {authStatus}
          </div>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-xl">
          <nav className="flex flex-col p-4 border-t border-gray-100">
            {NavLinks}
            <div className="mt-4">
              {authStatus}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
