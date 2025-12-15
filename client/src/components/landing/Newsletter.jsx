import React from "react";
import { Button } from "../ui/button";
import { Rocket, CheckCircle, ArrowRight } from "lucide-react";

const Newsletter = () => {
  return (
    <div className="relative px-6 lg:px-12 py-16 lg:py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="max-w-5xl mx-auto text-center">
        {/* Icon Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Rocket className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6">
          Build Skills. Unlock Opportunities.
        </h2>
        <p className="text-lg lg:text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Join thousands of tech professionals growing their careers through continuous learning and strategic opportunities
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Button className="bg-white hover:bg-gray-100 text-blue-600 rounded-xl px-8 py-6 text-base font-semibold shadow-lg inline-flex items-center gap-2">
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" className="border-2 border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl px-8 py-6 text-base font-semibold inline-flex items-center gap-2">
            Explore Programs
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-white">
            <CheckCircle className="w-6 h-6 text-blue-200" />
            <div className="text-left">
              <div className="text-2xl font-bold">5,000+</div>
              <div className="text-sm text-blue-200">Active Professionals</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-white">
            <CheckCircle className="w-6 h-6 text-blue-200" />
            <div className="text-left">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-blue-200">Career Programs</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 text-white">
            <CheckCircle className="w-6 h-6 text-blue-200" />
            <div className="text-left">
              <div className="text-2xl font-bold">200+</div>
              <div className="text-sm text-blue-200">Hiring Partners</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
