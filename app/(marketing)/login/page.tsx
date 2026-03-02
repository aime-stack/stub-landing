import { LoginForm } from '@/components/marketing/LoginForm';
import Image from 'next/image';

export const metadata = {
  title: 'Log in to Stubgram',
  description: 'Log in to your account',
};

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full bg-black text-white px-0 m-0">
      {/* Left side: Form */}
      <section className="flex flex-1 justify-center items-center flex-col py-10 px-5 relative h-full bg-gradient-to-br from-cyan-400 via-purple-500 to-fuchsia-500 overflow-hidden">
        {/* Decorative background vectors from image */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rotate-45 transform origin-center" />
          <div className="absolute top-[40%] text-transparent -right-40 w-[600px] h-[600px] bg-white/10 rotate-45 transform origin-center" />
        </div>

        <div className="relative z-10 flex w-full flex-col justify-center items-center max-w-[440px] bg-white rounded-3xl p-10 shadow-2xl">
          <h2 className="text-[32px] font-bold tracking-tight text-gray-900 mb-10 mt-2">
            Login
          </h2>

          <LoginForm />
        </div>
      </section>

      {/* Right side: Social Brand Aesthetic */}
      <div className="hidden xl:flex w-1/2 h-full relative bg-[#09090b] border-l border-[#1F1F22] overflow-hidden flex-col justify-center items-center">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#877EFF] opacity-20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#ec4899] opacity-10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-[#0a7ea4] opacity-15 blur-[90px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-lg px-8 flex flex-col items-start w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-[#877EFF] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-[#EFEFEF]">SOCIAL MEDIA THAT PAYS</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Connect, create, and <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#877EFF] to-[#ec4899]">
              earn rewards.
            </span>
          </h1>
          
          <p className="text-lg text-[#B5B5BE] max-w-md mb-12">
            Join the new era of social networking. Stubgram pays you for every interaction, turning your social reach into actual earnings.
          </p>

          {/* Decorative Floating UI Mockup */}
          <div className="relative w-full aspect-[16/9] rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.05] backdrop-blur-xl shadow-2xl overflow-hidden p-6 flex flex-col gap-4">
             {/* Mock Header */}
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#877EFF] to-[#ec4899] p-[2px]">
                   <div className="w-full h-full rounded-full bg-[#151718] border-2 border-[#151718]" />
                </div>
                <div className="space-y-1.5 flex-1">
                   <div className="h-3.5 w-24 bg-white/10 rounded-md" />
                   <div className="h-2 w-16 bg-white/5 rounded-md" />
                </div>
                <div className="px-3 py-1 rounded-full bg-[#877EFF]/20 text-[#877EFF] text-xs font-bold border border-[#877EFF]/30">
                   +420 Coins
                </div>
             </div>
             {/* Mock Content */}
             <div className="h-20 w-full bg-white/[0.02] rounded-xl border border-white/[0.02] mt-2" />
             {/* Mock Footer Actions */}
             <div className="flex gap-4 mt-auto">
                <div className="w-8 h-8 rounded-full bg-white/5" />
                <div className="w-8 h-8 rounded-full bg-white/5" />
                <div className="w-8 h-8 rounded-full bg-white/5" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
