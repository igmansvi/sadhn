import React from 'react';

const NewsUpdates = ({ newsItems }) => {
  return (
    <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Industry News</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {newsItems.map((news) => (
          <div key={news.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex gap-3">
              <img src={news.image} alt={news.title} className="w-24 h-20 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {news.category}
                  </span>
                  <span className="text-xs text-gray-500">{news.time}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{news.title}</h3>
                <p className="text-xs text-gray-600">{news.source}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsUpdates;
