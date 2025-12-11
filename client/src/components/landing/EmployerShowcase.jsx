import React from 'react'
import { Button } from '../ui/button'

const EmployerShowcase = () => {
  const stats = [
    {
      icon: '🏢',
      heading: 'Trusted by Leading Organizations',
      subtext: 'Companies hiring through our platform include top IT, manufacturing, and service brands.'
    },
    {
      icon: '✅',
      heading: 'Verified Employer Network',
      subtext: 'Only approved and vetted employers can post opportunities.'
    }
  ]

  // Mock company logos
  const companies = [
    { name: 'TCS', initial: 'TCS' },
    { name: 'Infosys', initial: 'I' },
    { name: 'Wipro', initial: 'W' },
    { name: 'Tech Mahindra', initial: 'TM' },
    { name: 'HCL', initial: 'HCL' },
    { name: 'L&T', initial: 'L&T' },
    { name: 'Reliance', initial: 'R' },
    { name: 'Mahindra', initial: 'M' },
  ]

  return (
    <div className="relative px-12 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🏢</span>
            <h2 className="text-4xl font-bold text-gray-900">
              Employer & Partner Showcase
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with India's leading employers actively seeking skilled professionals
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-cyan-100 rounded-xl shadow-md flex items-center justify-center text-4xl">
                    {item.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.heading}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.subtext}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Company Logos Showcase */}
        <div className="bg-white rounded-3xl p-12 shadow-xl mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Our Hiring Partners
          </h3>
          
          {/* Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {companies.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-2">
                    {company.initial}
                  </div>
                  <p className="text-xs font-semibold text-gray-600">{company.name}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500">
            And 500+ more verified companies across India
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button 
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View All Partners
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
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EmployerShowcase
