import React, { useState } from "react";
import { Card } from "../ui/card";

const Mentorship = () => {
  const [hoveredMentor, setHoveredMentor] = useState(null);

  const mentors = [
    { id: 1, name: "Mohan Kumar", specialty: "Frontend Specialist", experience: "8+ years", available: true },
    { id: 2, name: "Meera Sharma", specialty: "Data Analyst Coach", experience: "10+ years", available: true },
    { id: 3, name: "Rahul Verma", specialty: "Backend Expert", experience: "6+ years", available: false },
    { id: 4, name: "Mohan Kumar", specialty: "Frontend Specialist", experience: "8+ years", available: true },
    { id: 5, name: "Meera Sharma", specialty: "Data Analyst Coach", experience: "10+ years", available: true },
    { id: 6, name: "Rahul Verma", specialty: "Backend Expert", experience: "6+ years", available: false },
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-100 via-white to-pink-100 rounded-2xl shadow-lg hover:shadow-xl transition-all h-full flex flex-col p-4 border border-purple-200/50 overflow-hidden">
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Mentorship
        </h2>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">{mentors.filter(m => m.available).length} Online</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="relative bg-white/60 backdrop-blur-sm rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border border-purple-100 hover:border-purple-300 transform hover:scale-[1.02]"
            onMouseEnter={() => setHoveredMentor(mentor.id)}
            onMouseLeave={() => setHoveredMentor(null)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-800">{mentor.name}</div>
                <div className="text-xs text-gray-600">{mentor.specialty}</div>
                {hoveredMentor === mentor.id && (
                  <div className="text-xs text-purple-600 mt-1 font-medium">{mentor.experience}</div>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full ${mentor.available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105 shadow-md mt-3 flex-shrink-0">
        Find All Mentors
      </button>
    </Card>
  );
};

export default Mentorship;
