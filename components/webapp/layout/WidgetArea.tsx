'use client';

export function WidgetArea() {
  return (
    <div className="flex flex-col space-y-4 pt-6">

      {/* Trends */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h2 className="text-[15px] font-semibold text-gray-900">Trends for you</h2>
        <div className="space-y-4">
          {[
            { tag: '#StubgramRewards', posts: '10k posts' },
            { tag: '#ContentCreators', posts: '15k posts' },
            { tag: '#NextGeneration', posts: '20k posts' },
          ].map(({ tag, posts }) => (
            <div
              key={tag}
              className="group cursor-pointer hover:bg-gray-50 rounded-xl p-2 -mx-2 transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-[#0a7ea4] transition-colors">{tag}</p>
                <p className="text-xs text-gray-500">{posts}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Who to follow */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold text-gray-900">Who to follow</h2>
          <p className="text-xs text-gray-500 mt-1">Connect with celebrities and top earners.</p>
        </div>
        <button className="w-full h-10 rounded-full bg-gradient-to-r from-[#0a7ea4] to-[#8b5cf6] text-white text-sm font-medium hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#0a7ea4]/40 transition-all duration-200">
          Explore Directory
        </button>
      </div>

      {/* Footer */}
      <footer className="text-[12px] text-gray-400 px-1 leading-loose">
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:text-gray-600 hover:underline transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-600 hover:underline transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-600 hover:underline transition-colors">Cookies</a>
          <a href="#" className="hover:text-gray-600 hover:underline transition-colors">Accessibility</a>
          <a href="#" className="hover:text-gray-600 hover:underline transition-colors">Ads</a>
        </p>
        <p className="mt-2 text-gray-400">© 2026 Stubgram Inc.</p>
      </footer>

    </div>
  );
}
