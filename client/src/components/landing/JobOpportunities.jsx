import React from "react";
import { Button } from "../ui/button";
import { MapPin, Briefcase, Clock, ArrowRight, Building2 } from "lucide-react";

const JobOpportunities = () => {
  const jobs = [
    {
      role: "Frontend Developer Intern",
      company: "TCS",
      location: "Bangalore",
      type: "Internship",
      duration: "3-6 months",
      tags: ["React", "JavaScript", "CSS"],
      isNew: true,
    },
    {
      role: "Backend Developer",
      company: "Infosys",
      location: "Pune",
      type: "Full-time",
      duration: "Fresher",
      tags: ["Node.js", "MongoDB", "Express"],
      isNew: false,
    },
    {
      role: "Full Stack Developer",
      company: "Wipro",
      location: "Hyderabad",
      type: "Full-time",
      duration: "Fresher",
      tags: ["MERN", "APIs", "Git"],
      isNew: true,
    },
    {
      role: "Software Engineer Trainee",
      company: "Tech Mahindra",
      location: "Chennai",
      type: "Full-time",
      duration: "Fresher",
      tags: ["Java", "Spring Boot", "SQL"],
      isNew: false,
    },
  ];

  return (
    <div id="jobs" className="relative px-6 lg:px-12 py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Opportunities Matched to Your Skills
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover tech roles and internships aligned with your profile and expertise
          </p>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 relative group"
            >
              {/* New Badge */}
              {job.isNew && (
                <div className="absolute top-4 right-4">
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                    New
                  </span>
                </div>
              )}

              {/* Company Icon */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {job.role}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">{job.company}</p>
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{job.duration}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Apply Button */}
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all inline-flex items-center justify-center gap-2 group-hover:shadow-md">
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Browse All Jobs CTA */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-900 px-8 py-6 text-base rounded-xl transition-all inline-flex items-center gap-2"
          >
            Browse All Tech Jobs
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobOpportunities;
