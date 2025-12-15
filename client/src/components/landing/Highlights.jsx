import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Briefcase, Users, Target, Shield, ArrowRight } from "lucide-react";

const Highlights = () => {
  const highlights = [
    {
      Icon: Briefcase,
      heading: "Skill-Powered Job Matching",
      subtext:
        "Get matched with opportunities based on your verified skills, projects, and experience level.",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      Icon: Users,
      heading: "Career Growth Programs",
      subtext:
        "Access industry-aligned courses that strengthen your profile and increase hiring potential.",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      Icon: Target,
      heading: "Continuous Skill Development",
      subtext: "Stay relevant with programs designed around current tech stacks and employer demand.",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      Icon: Shield,
      heading: "Verified Professional Profiles",
      subtext: "Showcase validated skills and projects that build employer trust and unlock better roles.",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
  ];

  return (
    <div id="features" className="relative px-6 lg:px-12 py-16 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Saadhan?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A platform where skills and opportunities work together to accelerate your tech career
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
            >
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="shrink-0">
                  <div className={`w-14 h-14 ${item.iconBg} rounded-xl flex items-center justify-center`}>
                    <item.Icon className={`w-7 h-7 ${item.iconColor}`} />
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

        {/* Learn More Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-900 px-8 py-6 text-base rounded-xl transition-all inline-flex items-center gap-2"
          >
            Learn More About the Platform
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Highlights;
