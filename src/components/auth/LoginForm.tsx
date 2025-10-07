// File: src/components/auth/LoginForm.tsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// FIX: Supabase client ko naye tareeke se import karein
import { createClient } from '@/lib/supabase/client'; 

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // FIX: Client ko component ke andar initialize karein
  const supabase = createClient(); 

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/');
      router.refresh(); // Page refresh karein taaki header update ho
    }
  };

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl space-y-6 transition-all duration-300 hover:shadow-indigo-200"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Welcome Back
        </h2>

        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 pt-6 text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg outline-none peer focus:border-indigo-500 transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute left-3 -translate-y-3 top-3 text-xs text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:-translate-y-0 peer-focus:top-3 peer-focus:text-xs peer-focus:-translate-y-3 peer-focus:text-indigo-600"
          >
            Email Address
          </label>
        </div>

        <div className="relative">
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pt-6 text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg outline-none peer focus:border-indigo-500 transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute left-3 -translate-y-3 top-3 text-xs text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:-translate-y-0 peer-focus:top-3 peer-focus:text-xs peer-focus:-translate-y-3 peer-focus:text-indigo-600"
          >
            Password
          </label>
        </div>

        {/* --- YEH LINK ADD KIYA GAYA HAI --- */}
        <div className="text-right text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-indigo-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        {/* --- YAHAN TAK --- */}

        {error && <p className="text-red-600 text-center text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Sign In
        </button>
      </form>
      <div className="text-sm text-center mt-6">
        <p className="text-gray-600">
          Don&apos;t have an account?
          <Link
            href="/auth/signup"
            className="font-medium text-indigo-600 hover:underline ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}