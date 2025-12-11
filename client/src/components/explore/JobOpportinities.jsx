import React, { useState } from "react";
import { Card } from "../ui/card";

const JobOpportinities = () => {
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = [
    { 
      id: 1, 
      title: "Junior Web Developer", 
      company: "TechCorp India",
      location: "Bengaluru", 
      salary: "₹4-6 LPA", 
      type: "Full-time",
      skills: ["React", "Node.js"],
      posted: "2d ago"
    },
    { 
      id: 2, 
      title: "UI/UX Designer", 
      company: "DesignHub",
      location: "Mumbai", 
      salary: "₹5-8 LPA", 
      type: "Full-time",
      skills: ["Figma", "Adobe XD"],
      posted: "3d ago"
    },
    { 
      id: 3, 
      title: "Data Analyst", 
      company: "DataCo",
      location: "Pune", 
      salary: "₹6-9 LPA", 
      type: "Remote",
      skills: ["Python", "SQL"],
      posted: "5d ago"
    },
    { 
      id: 4, 
      title: "QA Engineer", 
      company: "TestLabs",
      location: "Hyderabad", 
      salary: "₹4-7 LPA", 
      type: "Hybrid",
      skills: ["Selenium", "Jest"],
      posted: "1w ago"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-green-100 via-white to-teal-100 rounded-2xl shadow-lg hover:shadow-xl transition-all h-full flex flex-col p-4 border border-green-200/50 overflow-hidden">
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Job Opportunities
        </h2>
        <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {jobs.length} New
        </span>
      </div>
      
      <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`relative bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border transform hover:scale-[1.01]
              ${selectedJob === job.id ? 'border-green-400 bg-green-50/80' : 'border-green-100 hover:border-green-300'}`}
            onClick={() => setSelectedJob(job.id === selectedJob ? null : job.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-gray-800 mb-1 line-clamp-1">{job.title}</h3>
                <p className="text-xs text-gray-600 font-medium">{job.company}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0 ml-2
                ${job.type === 'Remote' ? 'bg-purple-100 text-purple-700' : 
                  job.type === 'Hybrid' ? 'bg-blue-100 text-blue-700' : 
                  'bg-gray-100 text-gray-700'}`}>
                {job.type}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{job.location}</span>
              </div>
              <span>•</span>
              <span>{job.posted}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-green-600">{job.salary}</span>
              <div className="flex gap-1">
                {job.skills.slice(0, 2).map((skill, idx) => (
                  <span key={idx} className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {selectedJob === job.id && (
              <button className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-all">
                Apply Now
              </button>
            )}
          </div>
        ))}
      </div>

      <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105 shadow-md mt-3 flex-shrink-0">
        Browse All Jobs
      </button>
    </Card>
  );
};

export default JobOpportinities;
