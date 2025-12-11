import React, { useState } from "react";
import { Card } from "../ui/card";

const NewsUpdates = () => {
  const [selectedNews, setSelectedNews] = useState(null);

  const news = [
    {
      id: 1,
      title: "Govt launches AI Upskilling 2025",
      category: "Government",
      time: "2h ago",
      trending: true,
    },
    {
      id: 2,
      title: "Meta partners with Skill India",
      category: "Partnership",
      time: "5h ago",
      trending: true,
    },
    {
      id: 3,
      title: "New Apprenticeship Program announced",
      category: "Programs",
      time: "1d ago",
      trending: false,
    },
    {
      id: 4,
      title: "Tech hiring up by 35% this quarter",
      category: "Industry",
      time: "2d ago",
      trending: false,
    },
    {
      id: 5,
      title: "Free Cloud Computing certification",
      category: "Courses",
      time: "3d ago",
      trending: false,
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-100 via-white to-indigo-100 rounded-2xl shadow-lg hover:shadow-xl transition-all h-full flex flex-col p-4 border border-blue-200/50 overflow-hidden">
      <div className="flex items-center justify-between mb-2 flex-shrink-0">
        <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          News & Updates
        </h2>
        <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
          Live
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
        {news.map((item) => (
          <div
            key={item.id}
            className={`relative bg-white/60 backdrop-blur-sm rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border hover:border-blue-300 transform hover:scale-[1.01]
              ${
                selectedNews === item.id
                  ? "border-blue-400 bg-blue-50/80"
                  : "border-blue-100"
              }`}
            onClick={() =>
              setSelectedNews(item.id === selectedNews ? null : item.id)
            }
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {item.trending && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                      TRENDING
                    </span>
                  )}
                  <span className="text-[10px] text-gray-500 font-medium flex-shrink-0">
                    {item.category}
                  </span>
                </div>
                <div className="font-medium text-sm text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
                  {item.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">{item.time}</div>
              </div>
              <div className="text-blue-500 flex-shrink-0">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105 shadow-md mt-3 flex-shrink-0">
        View All News
      </button>
    </Card>
  );
};

export default NewsUpdates;
