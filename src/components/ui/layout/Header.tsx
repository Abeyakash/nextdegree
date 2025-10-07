'use client'

import { useState } from "react"
import Link from "next/link"
import { GraduationCap, Menu, X } from "lucide-react"
import AuthButtons from "./AuthButton" // Import the new component

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const NavLinks = (
    <>
      <Link href="/" onClick={handleLinkClick} className="block py-3 px-4 text-gray-600 font-medium hover:text-blue-600 transition-colors md:py-0 md:px-0 md:border-b-2 md:border-transparent md:hover:border-blue-600">Home</Link>
      <Link href="/colleges" onClick={handleLinkClick} className="block py-3 px-4 text-gray-600 font-medium hover:text-blue-600 transition-colors md:py-0 md:px-0 md:border-b-2 md:border-transparent md:hover:border-blue-600">Colleges</Link>
      <Link href="/compare" onClick={handleLinkClick} className="block py-3 px-4 text-gray-600 font-medium hover:text-blue-600 transition-colors md:py-0 md:px-0 md:border-b-2 md:border-transparent md:hover:border-blue-600">Compare</Link>
    </>
  )

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="text-3xl font-extrabold text-blue-600 tracking-tight flex items-center">
            <GraduationCap className="w-8 h-8 mr-2" />
            NextDegree
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10 items-center">{NavLinks}</nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            <AuthButtons />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-xl">
          <nav className="flex flex-col p-4 border-t border-gray-100">
            {NavLinks}
            <div className="mt-4">
              <AuthButtons />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}