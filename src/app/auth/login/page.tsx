import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - NextDegree',
  description: 'Sign in to your NextDegree account.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}