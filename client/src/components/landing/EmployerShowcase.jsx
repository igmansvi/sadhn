import React from "react";
import { Button } from "../ui/button";
import { Building2, CheckCircle2, ArrowRight } from "lucide-react";

const EmployerShowcase = () => {
  const stats = [
    {
      Icon: Building2,
      heading: "Skill-Based Hiring",
      subtext:
        "Employers value verified skills and structured profiles that demonstrate real capabilities.",
    },
    {
      Icon: CheckCircle2,
      heading: "Quality Over Volume",
      subtext: "We connect companies with candidates who invest in continuous learning and professional growth.",
    },
  ];

  // Tech company logos
  const companies = [
    { name: "TCS", initial: "TCS" },
    { name: "Infosys", initial: "I" },
    { name: "Wipro", initial: "W" },
    { name: "Tech Mahindra", initial: "TM" },
    { name: "HCL Tech", initial: "HCL" },
    { name: "Accenture", initial: "A" },
    { name: "Cognizant", initial: "C" },
    { name: "Amazon", initial: "AMZ" },
  ];

  return (
    <div id="employers" className="relative px-6 lg:px-12 py-16 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Leading Employers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Companies that value verified skills and hire through our platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
            >
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <item.Icon className="w-7 h-7 text-blue-600" />
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
        <div className="bg-white border border-gray-200 rounded-2xl p-8 lg:p-12 mb-8">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Our Tech Hiring Partners
          </h3>

          {/* Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mb-8">
            {companies.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 bg-gray-50 rounded-xl hover:shadow-md hover:bg-gray-100 transition-all duration-300 border border-gray-200"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2">
                    {company.initial}
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    {company.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500">
            And 200+ more verified tech companies across India
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            variant="default"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            View All Tech Partners
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployerShowcase;
