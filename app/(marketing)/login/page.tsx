import { LoginForm } from '@/components/marketing/LoginForm';

export const metadata = {
  title: 'Login - Stubgram',
  description: 'Log in to your Stubgram account',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-[#151718] rounded-3xl shadow-2xl border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your feed and earnings.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
