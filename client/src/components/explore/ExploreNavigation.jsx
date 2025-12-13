import React from 'react';
import { Home, Briefcase, BookOpen, Newspaper, Bookmark } from 'lucide-react';

const ExploreNavigation = ({ activeSection, setActiveSection, userSkills, skillGaps }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'jobs', label: 'Jobs', icon: Briefcase },
        { id: 'learning', label: 'Learning', icon: BookOpen },
        { id: 'news', label: 'News', icon: Newspaper },
        { id: 'saved', label: 'Saved', icon: Bookmark },
    ];

    return (
        <aside className="sticky top-6 self-start">
            <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Navigation</h2>
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${activeSection === item.id
                                        ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-600 pl-2.5'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon size={16} className="shrink-0" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Skills Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-900 mb-3">Your Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {userSkills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                {skill}
                            </span>
                        ))}
                    </div>
                    <h3 className="text-xs font-semibold text-gray-900 mb-3 mt-4">Skill Gaps</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {skillGaps.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ExploreNavigation;
