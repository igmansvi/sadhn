import React from 'react'
import { Button } from '../ui/button'

const Testimonials = () => {
  const testimonials = [
    {
      icon: '👩‍🎓',
      name: 'Riya',
      role: 'Web Developer',
      feedback: '"The Full Stack program helped me switch careers and land my first tech job."',
      gradient: 'from-cyan-100 to-blue-100'
    },
    {
      icon: '👨‍🔧',
      name: 'Aman',
      role: 'Electrician Trainee',
      feedback: '"Hands-on PMKVY training prepared me for real-world work instantly."',
      gradient: 'from-yellow-100 to-orange-100'
    },
    {
      icon: '👩‍⚕️',
      name: 'Sana',
      role: 'Healthcare Assistant',
      feedback: '"The certification and placement support changed my confidence completely."',
      gradient: 'from-green-100 to-teal-100'
    }
  ]

  return (
    <div className="relative px-12 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🌟</span>
            <h2 className="text-4xl font-bold text-gray-900">
              Success Stories
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from learners who transformed their careers with Skill India
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 relative`}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-6xl text-white/30 font-serif">
                "
              </div>

              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-5xl">
                  {item.icon}
                </div>
              </div>

              {/* Feedback */}
              <p className="text-gray-700 text-center mb-6 leading-relaxed italic text-lg relative z-10">
                {item.feedback}
              </p>

              {/* Author Info */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 text-lg">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {item.role}
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonials Section */}
        <div className="bg-gradient-to-br from-orange-100/60 via-white to-cyan-100/60 rounded-3xl p-12 shadow-xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Watch More Success Stories
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Hear directly from our learners about their journey to success
          </p>
          
          {/* Video Placeholder */}
          <div className="max-w-3xl mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl aspect-video flex items-center justify-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-cyan-500/20"></div>
            <button className="relative z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
              <svg 
                className="w-10 h-10 text-gray-900 ml-1" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>

          <Button 
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Read More Success Stories
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

export default Testimonials
