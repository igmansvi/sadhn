import React from "react";
import { Button } from "../ui/button";

const FeaturedPrograms = () => {
  const programs = [
    {
      icon: "💻",
      title: "Full Stack Web Development (Govt Certified)",
      highlights: "Build projects, learn MERN stack, get placement support.",
      gradient: "from-cyan-100 to-blue-100",
      badge: "Government Certified",
    },
    {
      icon: "🤖",
      title: "AI & Data Analytics Bootcamp",
      highlights: "Hands-on ML, dashboards, analytics toolkit.",
      gradient: "from-purple-100 to-pink-100",
      badge: "Most Popular",
    },
    {
      icon: "⚡",
      title: "Electrician Training – PMKVY",
      highlights: "Practical training with sector-certified assessments.",
      gradient: "from-yellow-100 to-orange-100",
      badge: "PMKVY Certified",
    },
    {
      icon: "🛒",
      title: "Retail & Customer Service Essentials",
      highlights: "Job-ready communication & sales training.",
      gradient: "from-green-100 to-teal-100",
      badge: "Quick Start",
    },
  ];

  return (
    <div className="relative px-12 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-3xl">🎯</span>
            <h2 className="text-4xl font-bold text-gray-900">
              Featured Programs & Courses
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Industry-aligned training programs designed to make you job-ready
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {programs.map((program, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${program.gradient} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden`}
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {program.badge}
                </span>
              </div>

              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-4xl">
                    {program.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 mt-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {program.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {program.highlights}
                  </p>

                  {/* Learn More Link */}
                  <button className="text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors inline-flex items-center group">
                    Learn More
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Programs Button */}
        <div className="flex justify-center">
          <Button
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            View All Programs
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

export default FeaturedPrograms;
