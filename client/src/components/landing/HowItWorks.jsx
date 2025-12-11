import React from 'react'

const HowItWorks = () => {
  const steps = [
    {
      step: '1️⃣',
      title: 'Sign Up',
      description: 'Create your free Skill India account.',
      gradient: 'from-orange-100 to-orange-50'
    },
    {
      step: '2️⃣',
      title: 'Choose a Skill Path',
      description: 'Explore programs and select your training track.',
      gradient: 'from-cyan-100 to-cyan-50'
    },
    {
      step: '3️⃣',
      title: 'Get Certified',
      description: 'Complete modules and earn recognized certificates.',
      gradient: 'from-purple-100 to-purple-50'
    },
    {
      step: '4️⃣',
      title: 'Apply for Jobs',
      description: 'Connect with partnered employers and get placed.',
      gradient: 'from-green-100 to-green-50'
    }
  ]

  return (
    <div className="relative px-12 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">⚙️</span>
            <h2 className="text-4xl font-bold text-gray-900">
              How It Works
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your journey to success in 4 simple steps
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-orange-200 via-cyan-200 via-purple-200 to-green-200 transform -translate-y-1/2 z-0"></div>
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Step Circle */}
                <div className={`w-24 h-24 bg-gradient-to-br ${item.gradient} rounded-full shadow-lg flex items-center justify-center text-4xl mb-6 hover:scale-110 transition-transform duration-300 border-4 border-white`}>
                  {item.step}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Arrow Connector (Hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 transform translate-x-32">
                    <svg 
                      className="w-8 h-8 text-gray-300" 
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
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-br from-orange-100/60 via-white to-cyan-100/60 rounded-3xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join millions of learners who have transformed their careers with Skill India
          </p>
          <button className="bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center">
            Get Started Now
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
          </button>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
