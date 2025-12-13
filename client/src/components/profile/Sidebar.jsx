import React from 'react';
import { User, Award, GraduationCap, Briefcase, Activity, Settings } from 'lucide-react';

const Sidebar = ({ activeSection, scrollToSection, profile }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'jobPreferences', label: 'Job Preferences', icon: Briefcase },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="sticky top-6 self-start">
      <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Profile Completion</h2>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${profile.profileCompletion}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-700">{profile.profileCompletion}%</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all text-left ${
                  activeSection === item.id
                    ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-600 pl-2.5'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
