import React from 'react'
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-12 py-6 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"></div>
        <span className="text-xl font-semibold text-gray-900">Saadhan</span>
      </div>

      <div className="flex items-center gap-8 text-sm">
        <a href="#highlights" className="text-gray-700 hover:text-gray-900 transition-colors">
          Highlights
        </a>
        <a href="#skills" className="text-gray-700 hover:text-gray-900 transition-colors">
          Skills
        </a>
        <a href="#courses" className="text-gray-700 hover:text-gray-900 transition-colors">
          Courses
        </a>
        <a href="#working" className="text-gray-700 hover:text-gray-900 transition-colors">
          Working
        </a>
        <a href="#parteners" className="text-gray-700 hover:text-gray-900 transition-colors">
          Parteners
        </a>
        <a href="#stories" className="text-gray-700 hover:text-gray-900 transition-colors">
          Stories
        </a>
        <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">
          About
        </a>
        <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors">
          Contact us
        </a>
      </div>

      <div className="flex items-center gap-4">
        <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-6">
          Profile
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
