import React from "react";
import { Button } from "../ui/button";
import { Quote, Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Frontend Developer Intern",
      feedback:
        "The React program helped me build strong projects. My profile matched with multiple opportunities, and I landed an internship at TCS within weeks.",
      company: "TCS",
    },
    {
      name: "Rahul Kumar",
      role: "Backend Developer",
      feedback:
        "Upskilling in Node.js and system design directly improved my job matches. I transitioned into a backend role that aligned with my updated expertise.",
      company: "Tech Startup",
    },
    {
      name: "Anjali Patel",
      role: "Full Stack Developer",
      feedback:
        "Completed the Full Stack program while applying to roles. The verified skills on my profile gave employers confidence, leading to my offer at Infosys.",
      company: "Infosys",
    },
  ];

  return (
    <div id="success-stories" className="relative px-6 lg:px-12 py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tech professionals who advanced their careers by combining skill development with strategic opportunities
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:border-gray-300 relative"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-blue-600" />
              </div>

              {/* Feedback */}
              <p className="text-gray-700 mb-6 leading-relaxed text-sm">
                {item.feedback}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-600">{item.role}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
