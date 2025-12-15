import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Briefcase, ArrowRight, Search } from "lucide-react";

const Start = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 lg:px-12">
      <div className="flex justify-center mb-8">
        <div className="bg-blue-50 rounded-full px-5 py-2 flex items-center gap-2 border border-blue-100">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-blue-900">Build Skills. Get Hired.</span>
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-center text-gray-900 mb-6 leading-tight max-w-5xl mx-auto">
        Grow Your Career with
        <span className="block mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Skills That Get You Hired
        </span>
      </h1>
      <p className="text-xl lg:text-2xl text-center text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
        Build industry-relevant skills, create a verified tech profile, and get matched with opportunities that advance your career.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
        <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
          <Search className="w-5 h-5" />
          Explore Opportunities
        </Button>
        <Button onClick={() => navigate('/signup')} variant="outline" className="border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-900 rounded-xl px-8 py-6 text-base font-semibold inline-flex items-center gap-2">
          Build Your Profile
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Start;
