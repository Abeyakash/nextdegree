import type { Metadata } from 'next';
import SignupForm from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Create Account - NextDegree',
  description: 'Sign up for a new NextDegree account.',
};

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-amber-100 flex items-center justify-center p-4">
      <SignupForm />
    </main>
  );
}
