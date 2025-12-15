import React from "react";
import { Button } from "../ui/button";
import { Code2, Database, Server, Globe, Cloud, Cpu, ArrowRight } from "lucide-react";

const PopularCategories = () => {
  const categories = [
    {
      Icon: Code2,
      category: "Full Stack Development",
      description: "MERN/MEAN stack, APIs, and modern web development for versatile tech roles.",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      Icon: Database,
      category: "Data Structures & Algorithms",
      description: "Core problem-solving skills that strengthen technical interview performance.",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      Icon: Server,
      category: "Backend Development",
      description: "Server-side technologies and system design for scalable application development.",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      Icon: Globe,
      category: "Frontend Development",
      description: "Modern UI frameworks and responsive design for user-facing engineering roles.",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      Icon: Cloud,
      category: "Cloud & DevOps",
      description: "Infrastructure automation and cloud platforms for deployment engineering roles.",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      Icon: Cpu,
      category: "Machine Learning & AI",
      description: "Data science and AI technologies for emerging tech and research positions.",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div id="skills" className="relative px-6 lg:px-12 py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            In-Demand Tech Skills
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master industry-relevant technologies that strengthen your profile and unlock better career opportunities
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {categories.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300 cursor-pointer group"
            >
              <div className="text-center">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`w-14 h-14 ${item.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.Icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
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
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-900 px-8 py-6 text-base rounded-xl transition-all inline-flex items-center gap-2"
          >
            Explore Skill Resources
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;
