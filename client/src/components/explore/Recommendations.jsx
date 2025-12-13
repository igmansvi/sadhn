import React from 'react';
import { TrendingUp } from 'lucide-react';

const Recommendations = ({ skillPrograms }) => {
  return (
    <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recommended Programs</h2>
          <p className="text-xs text-gray-600 mt-0.5">Based on your skill gaps</p>
        </div>
        <TrendingUp size={20} className="text-blue-600" />
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {skillPrograms.map((program) => (
          <div key={program.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{program.title}</h3>
                <p className="text-xs text-gray-600">{program.provider}</p>
              </div>
              <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium">
                {program.skillGap}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
              <span>⏱ {program.duration}</span>
              <span>•</span>
              <span className="px-1.5 py-0.5 bg-gray-100 rounded">{program.level}</span>
              <span>•</span>
              <span>⭐ {program.rating}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{program.enrolled} enrolled</span>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium">
                Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
