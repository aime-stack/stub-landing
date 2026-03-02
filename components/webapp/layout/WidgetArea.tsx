'use client';

export function WidgetArea() {
  return (
    <div className="flex flex-col space-y-6 pt-6 px-2">
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6] opacity-10 blur-[50px] rounded-full pointer-events-none transition-opacity" />
        
        <h2 className="text-xl font-extrabold mb-5 text-gray-900">
          Trends for you
        </h2>
        <div className="space-y-1">
          {['#StubgramRewards', '#ContentCreators', '#NextGeneration'].map((tag, idx) => (
            <div key={idx} className="hover:bg-gray-50 p-3 -mx-3 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-gray-100">
              <p className="font-bold text-[15px] text-gray-900">{tag}</p>
              <p className="text-xs text-gray-500 mt-1">{10 + idx * 5}k posts</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group">
         {/* Glow effect */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#ec4899] opacity-10 blur-[50px] rounded-full pointer-events-none transition-opacity" />

        <h2 className="text-xl font-extrabold mb-2 text-gray-900">
          Who to follow
        </h2>
        <p className="text-[13px] text-gray-500 mb-5 leading-relaxed">
          Connect with celebrities and top earners.
        </p>
        <button className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-full hover:bg-blue-700 transition-all shadow-sm transform hover:-translate-y-0.5">
          Explore Directory
        </button>
      </div>

      <footer className="text-[13px] text-gray-500 px-4 leading-loose">
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:text-gray-900 hover:underline transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-900 hover:underline transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 hover:underline transition-colors">Cookie Policy</a>
          <a href="#" className="hover:text-gray-900 hover:underline transition-colors">Accessibility</a>
          <a href="#" className="hover:text-gray-900 hover:underline transition-colors">Ads info</a>
        </p>
        <p className="mt-2 text-gray-400">© 2026 Stubgram Inc.</p>
      </footer>
    </div>
  );
}
