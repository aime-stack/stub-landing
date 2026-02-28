import { LoginForm } from '@/components/marketing/LoginForm';

export const metadata = {
  title: 'Login - Stubgram',
  description: 'Log in to your Stubgram account',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your feed and earnings.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
