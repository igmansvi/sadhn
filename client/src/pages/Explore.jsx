import React, { useState } from "react";
import { User } from "lucide-react";
import ExploreNavigation from "../components/explore/ExploreNavigation";
import NewsUpdates from "../components/explore/NewsUpdates";
import Recommendations from "../components/explore/Recommendations";
import JobOpportunities from "../components/explore/JobOpportunities";

const Explore = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const userSkills = ['React', 'JavaScript', 'Node.js'];
  const skillGaps = ['TypeScript', 'Docker', 'AWS'];

  const newsItems = [
    {
      id: 1,
      title: "Tech Industry Trends 2025: AI and Machine Learning",
      source: "Tech Insights",
      time: "2 hours ago",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Remote Work Policies: What Companies Are Doing",
      source: "Career Weekly",
      time: "5 hours ago",
      category: "Career",
      image: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Top Programming Languages to Learn in 2025",
      source: "Dev Community",
      time: "1 day ago",
      category: "Learning",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Startup Funding Reaches Record High",
      source: "Business Today",
      time: "1 day ago",
      category: "Business",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop"
    }
  ];

  const skillPrograms = [
    {
      id: 1,
      title: "TypeScript Fundamentals",
      provider: "Udemy",
      duration: "12 hours",
      level: "Intermediate",
      enrolled: "15.2K",
      rating: 4.8,
      skillGap: "TypeScript"
    },
    {
      id: 2,
      title: "Docker & Kubernetes Mastery",
      provider: "Coursera",
      duration: "20 hours",
      level: "Advanced",
      enrolled: "8.7K",
      rating: 4.9,
      skillGap: "Docker"
    },
    {
      id: 3,
      title: "AWS Cloud Practitioner",
      provider: "AWS Training",
      duration: "15 hours",
      level: "Beginner",
      enrolled: "22.5K",
      rating: 4.7,
      skillGap: "AWS"
    }
  ];

  const jobPostings = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Corp",
      location: "Remote",
      type: "Full-time",
      salary: "₹8-12 LPA",
      posted: "2 days ago",
      matchScore: 85
    },
    {
      id: 2,
      title: "React Developer",
      company: "Startup Hub",
      location: "Bangalore",
      type: "Full-time",
      salary: "₹10-15 LPA",
      posted: "3 days ago",
      matchScore: 92
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "Digital Solutions",
      location: "Hybrid",
      type: "Full-time",
      salary: "₹12-18 LPA",
      posted: "5 days ago",
      matchScore: 78
    },
    {
      id: 4,
      title: "JavaScript Developer",
      company: "Code Labs",
      location: "Pune",
      type: "Contract",
      salary: "₹6-10 LPA",
      posted: "1 week ago",
      matchScore: 88
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Explore</h1>
                <p className="text-sm text-gray-600 mt-0.5">Discover opportunities and grow your skills</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium">
              <User size={18} />
              View Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-[280px_1fr_340px] gap-5">
          <div className="space-y-5">
            <ExploreNavigation
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              userSkills={userSkills}
              skillGaps={skillGaps}
            />
          </div>

          <div className="space-y-5 min-w-0">
            <NewsUpdates newsItems={newsItems} />
            <Recommendations skillPrograms={skillPrograms} />
          </div>

          <div className="space-y-5">
            <JobOpportunities jobPostings={jobPostings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
