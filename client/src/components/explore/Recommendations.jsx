import React from "react";
import { Card } from "../ui/card";

const Recommendations = () => {
  const recommendations = [
    { 
      id: 1, 
      type: "Skill", 
      title: "UI/UX Wireframing", 
      icon: "🎨", 
      color: "from-pink-500 to-rose-500",
      description: "Master design fundamentals"
    },
    { 
      id: 2, 
      type: "Course", 
      title: "Intro to Data Analysis", 
      icon: "📊", 
      color: "from-blue-500 to-indigo-500",
      description: "Learn data-driven insights"
    },
    { 
      id: 3, 
      type: "Job", 
      title: "Junior QA Tester", 
      icon: "🧪", 
      color: "from-green-500 to-teal-500",
      description: "Perfect match for your skills"
    },
    { 
      id: 4, 
      type: "Mentor", 
      title: "Connect with AI Expert", 
      icon: "🤝", 
      color: "from-purple-500 to-violet-500",
      description: "Get guidance from experts"
    },
    // { 
    //   id: 5, 
    //   type: "Skill", 
    //   title: "UI/UX Wireframing", 
    //   icon: "🎨", 
    //   color: "from-pink-500 to-rose-500",
    //   description: "Master design fundamentals"
    // }
  ];

  return (
    <Card className="bg-gradient-to-br from-amber-100 via-white to-yellow-100 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-amber-200/50 p-3">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          Recommendations
        </h2>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {recommendations.map((item) => (
          <div 
            key={item.id}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-2.5 border border-amber-200 hover:border-amber-300 transition-all cursor-pointer group hover:shadow-md"
          >
            <div className="flex flex-col items-center text-center gap-1.5 p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-semibold text-amber-600 mb-0.5">{item.type}</div>
                <div className="font-bold text-xs text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-1">{item.title}</div>
                <div className="text-[10px] text-gray-600 mt-0.5 line-clamp-1">{item.description}</div>
              </div>
              <button className={`bg-gradient-to-r ${item.color} text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg hover:shadow-lg transition-all group-hover:scale-105 w-full mt-1`}>
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Recommendations;
