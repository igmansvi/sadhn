import React from "react";
import { Button } from "../ui/button";
import { Code2, Binary, Server, Palette, BadgeCheck, ArrowRight } from "lucide-react";

const FeaturedPrograms = () => {
  const programs = [
    {
      Icon: Code2,
      title: "Full Stack Web Development",
      highlights: "Build end-to-end web applications with MERN stack and qualify for versatile developer roles.",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      badge: "Most Popular",
      badgeBg: "bg-blue-600",
    },
    {
      Icon: Binary,
      title: "Data Structures & Algorithms",
      highlights: "Strengthen problem-solving abilities essential for technical assessments and engineering roles.",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      badge: "Core Skill",
      badgeBg: "bg-green-600",
    },
    {
      Icon: Server,
      title: "Backend Development",
      highlights: "Develop scalable server systems and APIs required for backend and full stack positions.",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      badge: "High Demand",
      badgeBg: "bg-purple-600",
    },
    {
      Icon: Palette,
      title: "Frontend Development",
      highlights: "Master modern UI frameworks and responsive design for frontend engineering opportunities.",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      badge: "In Demand",
      badgeBg: "bg-orange-600",
    },
  ];

  return (
    <div id="programs" className="relative px-6 lg:px-12 py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Career-Focused Programs
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Structured learning paths that strengthen your profile and expand career opportunities
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:border-gray-300 relative"
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className={`${program.badgeBg} text-white text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5`}>
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {program.badge}
                </span>
              </div>

              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-14 h-14 ${program.iconBg} rounded-xl flex items-center justify-center`}>
                    <program.Icon className={`w-7 h-7 ${program.iconColor}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 mt-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {program.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {program.highlights}
                  </p>

                  {/* Learn More Link */}
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center group">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            View All Programs
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPrograms;
