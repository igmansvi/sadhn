import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const Highlights = () => {
  const highlights = [
    {
      icon: "📈",
      heading: "10+ Million Learners Trained",
      subtext:
        "Empowering individuals across India with industry-ready skills.",
      gradient: "from-orange-100 to-orange-50",
    },
    {
      icon: "🏢",
      heading: "500+ Hiring Partners",
      subtext:
        "Connect with verified companies actively seeking skilled talent.",
      gradient: "from-cyan-100 to-cyan-50",
    },
    {
      icon: "🎓",
      heading: "1000+ Certified Programs",
      subtext: "Government-recognized and industry-aligned training options.",
      gradient: "from-blue-100 to-blue-50",
    },
    {
      icon: "⚙️",
      heading: "Skill Development Across 20+ Domains",
      subtext: "IT, Manufacturing, Healthcare, Retail, Design, and more.",
      gradient: "from-purple-100 to-purple-50",
    },
  ];

  return (
    <div className="relative px-12 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Skill India?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join millions of learners transforming their careers with
            industry-recognized skills and certifications
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {highlights.map((item, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${item.gradient} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-4xl">
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

        {/* Read More Button */}
        <div className="flex justify-center">
          <Button
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Read More About Our Impact
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
  );
};

export default Highlights;
