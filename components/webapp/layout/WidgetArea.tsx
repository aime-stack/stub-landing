'use client';

export function WidgetArea() {
  return (
    <div className="flex flex-col space-y-6 pt-6 px-2">
      <div className="bg-[#09090b] rounded-3xl p-6 border border-[#1F1F22] shadow-xl relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6] opacity-10 blur-[50px] rounded-full pointer-events-none group-hover:opacity-20 transition-opacity" />
        
        <h2 className="text-xl font-extrabold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
          Trends for you
        </h2>
        <div className="space-y-1">
          {['#StubgramRewards', '#ContentCreators', '#NextGeneration'].map((tag, idx) => (
            <div key={idx} className="hover:bg-white/[0.04] p-3 -mx-3 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/[0.05]">
              <p className="font-bold text-[15px] text-gray-100">{tag}</p>
              <p className="text-xs text-gray-500 mt-1">{10 + idx * 5}k posts</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#09090b] rounded-3xl p-6 border border-[#1F1F22] shadow-xl relative overflow-hidden group">
         {/* Glow effect */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#ec4899] opacity-10 blur-[50px] rounded-full pointer-events-none group-hover:opacity-20 transition-opacity" />

        <h2 className="text-xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
          Who to follow
        </h2>
        <p className="text-[13px] text-gray-400 mb-5 leading-relaxed">
          Connect with celebrities and top earners.
        </p>
        <button className="w-full bg-gradient-to-r from-[#0a7ea4] via-[#8b5cf6] to-[#ec4899] text-white font-bold py-3.5 rounded-full hover:opacity-90 transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transform hover:-translate-y-0.5">
          Explore Directory
        </button>
      </div>

      <footer className="text-[13px] text-gray-500 px-4 leading-loose">
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          <a href="#" className="hover:text-white transition-colors">Ads info</a>
        </p>
        <p className="mt-2">© 2026 Stubgram Inc.</p>
      </footer>
    </div>
  );
}
