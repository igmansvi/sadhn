import React from 'react';
import { Bell } from 'lucide-react';

const JobOpportunities = ({ jobPostings }) => {
    return (
        <div className="sticky top-6 self-start space-y-4">
            {/* Quick Stats */}
            <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Profile Views</span>
                        <span className="text-sm font-semibold text-gray-900">124</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Applications</span>
                        <span className="text-sm font-semibold text-gray-900">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Saved Jobs</span>
                        <span className="text-sm font-semibold text-gray-900">15</span>
                    </div>
                </div>
            </div>

            {/* Recent Job Postings */}
            <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Recent Jobs</h3>
                    <Bell size={16} className="text-gray-600" />
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {jobPostings.map((job) => (
                        <div key={job.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{job.title}</h4>
                                    <p className="text-xs text-gray-600 mb-2">{job.company}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${job.matchScore >= 90 ? 'bg-green-50 text-green-700' :
                                        job.matchScore >= 80 ? 'bg-blue-50 text-blue-700' :
                                            'bg-yellow-50 text-yellow-700'
                                    }`}>
                                    {job.matchScore}% Match
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                <span className="px-1.5 py-0.5 bg-gray-100 rounded">{job.type}</span>
                                <span>•</span>
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-900">{job.salary}</span>
                                <span className="text-xs text-gray-500">{job.posted}</span>
                            </div>
                            <button className="w-full mt-3 px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-xs font-medium">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobOpportunities;
