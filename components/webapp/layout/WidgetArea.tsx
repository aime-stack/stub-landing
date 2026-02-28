'use client';

export function WidgetArea() {
  return (
    <div className="flex flex-col space-y-6 pt-6 px-2">
      <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Trends for you</h2>
        <div className="space-y-4">
          {['#StubgramRewards', '#ContentCreators', '#NextGeneration'].map((tag, idx) => (
            <div key={idx} className="hover:bg-gray-800 p-2 -mx-2 rounded-xl transition-colors cursor-pointer">
              <p className="font-semibold text-[15px]">{tag}</p>
              <p className="text-sm text-gray-500">{10 + idx * 5}k posts</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
        <h2 className="text-xl font-bold mb-4">Who to follow</h2>
        <p className="text-sm text-gray-500 mb-2">Connect with celebrities and top earners.</p>
        <button className="w-full mt-2 bg-white text-black font-bold py-2 rounded-full hover:bg-gray-200 transition-colors">
          Explore Directory
        </button>
      </div>

      <footer className="text-xs text-gray-500 px-2 leading-relaxed">
        <p>© 2026 Stubgram Inc. Terms • Privacy • Ads info</p>
      </footer>
    </div>
  );
}
