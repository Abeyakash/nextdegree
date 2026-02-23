import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - NextDegree',
  description: 'Sign in to your NextDegree account.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-amber-100 flex items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}
