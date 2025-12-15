import React from "react";
import { UserPlus, FileText, Target, Send, ListChecks, Trophy } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      Icon: UserPlus,
      title: "Build Your Profile",
      description: "Create a verified professional profile with your skills, projects, and experience.",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      number: "02",
      Icon: FileText,
      title: "Identify Skill Gaps",
      description: "Discover which skills can strengthen your profile and improve job matching.",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      number: "03",
      Icon: Target,
      title: "Upskill Strategically",
      description: "Learn through industry-aligned programs that enhance your career readiness.",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      number: "04",
      Icon: Send,
      title: "Get Matched & Apply",
      description: "Receive opportunities aligned with your updated skills and apply with confidence.",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      number: "05",
      Icon: ListChecks,
      title: "Track Progress",
      description: "Monitor applications, interviews, and continue learning to stay competitive.",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      number: "06",
      Icon: Trophy,
      title: "Advance Your Career",
      description: "Land roles that match your expertise and keep growing with ongoing skill development.",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div id="how-it-works" className="relative px-6 lg:px-12 py-16 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A continuous growth cycle that connects skill development with career opportunities
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
            >
              <div className="flex flex-col">
                {/* Number and Icon */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    {item.number}
                  </div>
                  <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center`}>
                    <item.Icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-50 border border-blue-100 rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Accelerate Your Tech Career?
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Join thousands of tech professionals advancing their careers through skill-powered opportunities
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-base font-semibold rounded-xl shadow-md transition-all inline-flex items-center gap-2">
            Start Building Your Profile
            <svg
              className="w-5 h-5"
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
  );
};

export default HowItWorks;
