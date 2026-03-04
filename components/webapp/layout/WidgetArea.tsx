'use client';

import { Search } from 'lucide-react';

export function WidgetArea() {
  const trends = [
    { category: 'Technology · Trending', tag: '#StubgramRewards', posts: '10.5K posts' },
    { category: 'Social Media · Trending', tag: '#ContentCreators', posts: '15.2K posts' },
    { category: 'Trending', tag: '#NextGeneration', posts: '20K posts' },
    { category: 'Entertainment · Trending', tag: '#StubgramLive', posts: '8.1K posts' },
  ];

  const suggestions = [
    { name: 'Stubgram Official', handle: 'stubgram', bio: 'The next generation social platform.' },
    { name: 'Creator Hub',       handle: 'creatorhub', bio: 'Tools for modern creators.' },
    { name: 'Tech Trends',       handle: 'techtrends',  bio: 'Daily tech insights and news.' },
  ];

  return (
    <div className="flex flex-col gap-4 pb-8">

      {/* Search */}
      <div className="relative mt-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search Stubgram"
          className="w-full h-11 bg-gray-100 rounded-full pl-11 pr-4 text-[15px] placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0a7ea4] focus:bg-white transition-all duration-200"
        />
      </div>

      {/* Trending */}
      <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-[19px] font-bold text-gray-900">Trends for you</h2>
        </div>
        {trends.map(({ category, tag, posts }) => (
          <div
            key={tag}
            className="px-4 py-3 hover:bg-gray-100 transition-colors duration-150 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <p className="text-xs text-gray-500">{category}</p>
                <p className="text-[15px] font-bold text-gray-900 group-hover:text-[#0a7ea4] transition-colors">{tag}</p>
                <p className="text-xs text-gray-500">{posts}</p>
              </div>
              <button className="text-gray-400 hover:text-[#0a7ea4] transition-colors p-1">···</button>
            </div>
          </div>
        ))}
        <div className="px-4 py-3">
          <button className="text-[#0a7ea4] text-sm hover:underline transition-colors">Show more</button>
        </div>
      </div>

      {/* Who to follow */}
      <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-[19px] font-bold text-gray-900">Who to follow</h2>
        </div>
        {suggestions.map(({ name, handle, bio }) => (
          <div key={handle} className="px-4 py-3 hover:bg-gray-100 transition-colors duration-150 flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0a7ea4]/30 to-[#ec4899]/30 border border-gray-200 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-[#0a7ea4]">{name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-gray-900 truncate leading-tight">{name}</p>
              <p className="text-xs text-gray-500 truncate">@{handle}</p>
            </div>
            <button className="shrink-0 h-8 px-4 rounded-full bg-gray-900 text-white text-[13px] font-bold hover:bg-gray-700 active:scale-[0.97] transition-all duration-200">
              Follow
            </button>
          </div>
        ))}
        <div className="px-4 py-3">
          <button className="text-[#0a7ea4] text-sm hover:underline transition-colors">Show more</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 text-[12px] text-gray-400 leading-loose flex flex-wrap gap-x-3 gap-y-1">
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Cookie Policy</a>
        <a href="#" className="hover:underline">Accessibility</a>
        <a href="#" className="hover:underline">Ads info</a>
        <span className="w-full">© 2026 Stubgram Inc.</span>
      </footer>

    </div>
  );
}
