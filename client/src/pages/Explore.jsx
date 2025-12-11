import React from "react";
import JobOpportinities from "../components/explore/JobOpportinities.jsx";
import Mentorship from "../components/explore/Mentorship.jsx";
import Community from "../components/explore/Community.jsx";
import NewsUpdates from "../components/explore/NewsUpdates.jsx";
import Recommendations from "../components/explore/Recommendations.jsx";

const Explore = () => {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"></div>
          <span className="text-xl font-semibold text-gray-900">Saadhan</span>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Explore Dashboard
        </h1>
        <button className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-6 py-2 text-sm font-medium transition-all">
          Profile
        </button>
      </nav>

      {/* Main Content - Grid Layout */}
      <div className="flex-1 px-6 py-3 grid grid-cols-3 gap-3 overflow-hidden min-h-0">
        {/* Left Column */}
        <div className="grid gap-3 h-full min-h-0" style={{ gridTemplateRows: '1fr 2fr' }}>
          <Community />
          <Mentorship />
        </div>

        {/* Right Column */}
        <div className="col-span-2 grid gap-3 h-full min-h-0" style={{ gridTemplateRows: '3fr 2fr' }}>
          <div className="grid grid-cols-2 gap-3 min-h-0">
            <NewsUpdates />
            <JobOpportinities />
          </div>
          <Recommendations />
        </div>
      </div>
    </div>
  );
};

export default Explore;
