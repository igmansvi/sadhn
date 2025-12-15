import React from 'react';
import { Briefcase, Bookmark, Eye, Trophy } from 'lucide-react';

const ActivitySection = ({ profile }) => {
  const activityCards = [
    {
      title: 'Applied Jobs',
      icon: Briefcase,
      message: 'No job applications yet',
      buttonText: 'Browse Jobs'
    },
    {
      title: 'Saved Jobs',
      icon: Bookmark,
      message: 'No saved jobs',
      buttonText: 'Explore Opportunities'
    },
    {
      title: 'Recently Viewed',
      icon: Eye,
      message: 'No recently viewed items',
      buttonText: null
    },
    {
      title: 'Enrolled Programs',
      icon: Trophy,
      message: 'No enrolled programs',
      buttonText: 'Browse Programs'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Activity</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activityCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={18} className="text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900">{card.title}</h3>
              </div>
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-3">{card.message}</p>
                {card.buttonText && (
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium">
                    {card.buttonText}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitySection;
