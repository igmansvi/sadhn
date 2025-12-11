import React from 'react'
import Start from './Start.jsx'
import Highlights from './Highlights.jsx'
import PopularCategories from './PopularCategories.jsx'
import FeaturedPrograms from './FeaturedPrograms.jsx'
import HowItWorks from './HowItWorks.jsx'
import EmployerShowcase from './EmployerShowcase.jsx'
import Testimonials from './Testimonials.jsx'
import Newsletter from './Newsletter.jsx'

const HeroSection = () => {
  return (
    <div className="relative px-12 pt-20">
      <Start />
      <Highlights />
      <PopularCategories />
      <FeaturedPrograms />
      <HowItWorks />
      <EmployerShowcase />
      <Testimonials />
      <Newsletter />
    </div>
  )
}

export default HeroSection
