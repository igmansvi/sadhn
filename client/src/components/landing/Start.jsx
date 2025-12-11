import React from 'react'
import { Button } from "../ui/button";

const Start = () => {
  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full px-6 py-2 shadow-sm flex items-center gap-2">
          <div className="flex -space-x-2">
            <img 
              src="https://i.pravatar.cc/40?img=0" 
              alt="User 1" 
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <img 
              src="https://i.pravatar.cc/40?img=1" 
              alt="User 2" 
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <img 
              src="https://i.pravatar.cc/40?img=69" 
              alt="User 3" 
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <img 
              src="https://i.pravatar.cc/40?img=70" 
              alt="User 3" 
              className="w-8 h-8 rounded-full border-2 border-white"
            />
          </div>
          <span className="text-sm font-medium text-gray-700">1k+ joined</span>
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="text-7xl font-bold text-center text-gray-900 mb-4 leading-tight">
        Empowering India Through Skills
      </h1>
      <h2 className="text-4xl font-semibold text-center text-gray-900 mb-8 leading-tight">
        Learn in-demand skills, earn certifications, and connect with top employers.
      </h2>

      {/* CTA Button */}
      <div className="flex justify-center gap-33 mb-16">
        <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-8 py-6 text-base">
          Get Started
        </Button>
        <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-8 py-6 text-base">
          Browse Skills
        </Button>
      </div>
    </div>
  )
}

export default Start
