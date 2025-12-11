import React from 'react'
import { Button } from '../ui/button'

const PopularCategories = () => {
  const categories = [
    {
      icon: '💻',
      category: 'IT & Software',
      description: 'Web development, AI, cloud, data skills.',
      gradient: 'from-blue-100 to-blue-50'
    },
    {
      icon: '🎨',
      category: 'Design & Creative',
      description: 'UI/UX, graphic design, animation tools.',
      gradient: 'from-pink-100 to-pink-50'
    },
    {
      icon: '🏭',
      category: 'Manufacturing & Engineering',
      description: 'CNC, electrical, welding, mechanical basics.',
      gradient: 'from-gray-100 to-gray-50'
    },
    {
      icon: '🏥',
      category: 'Healthcare & Wellness',
      description: 'Medical assistant, lab skills, first-aid training.',
      gradient: 'from-green-100 to-green-50'
    },
    {
      icon: '📊',
      category: 'Business & Marketing',
      description: 'Digital marketing, sales, accounting fundamentals.',
      gradient: 'from-orange-100 to-orange-50'
    },
    {
      icon: '🛠️',
      category: 'Skilled Trades',
      description: 'Carpentry, plumbing, automotive repair programs.',
      gradient: 'from-yellow-100 to-yellow-50'
    }
  ]

  return (
    <div className="relative px-12 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🔥</span>
            <h2 className="text-4xl font-bold text-gray-900">
              Popular Skill Categories
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore diverse training programs across multiple industries and domains
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((item, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
            >
              <div className="text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-4xl">
                    {item.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.category}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Button */}
        <div className="flex justify-center">
          <Button 
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore All Categories
            <svg 
              className="w-5 h-5 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PopularCategories
