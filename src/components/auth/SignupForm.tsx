'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// FIX: Use the correct helper function to create the client
import { createClient } from '@/lib/supabase/client'; 

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  // FIX: Initialize the client inside the component
  const supabase = createClient(); 

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      // This part is correct: it sends the name to be stored as user metadata
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage('Success! Check your email to verify your account.');
      // Optional: Redirect to login page after a few seconds
      setTimeout(() => router.push('/auth/login'), 3000); 
    }
  };

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl shadow-2xl space-y-6 transition-all duration-300 hover:shadow-blue-200"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        <div className="relative">
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 pt-6 text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg outline-none peer focus:border-blue-500 transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="name"
            className="absolute left-3 -translate-y-3 top-3 text-xs text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:-translate-y-0 peer-focus:top-3 peer-focus:text-xs peer-focus:-translate-y-3 peer-focus:text-blue-600"
          >
            Full Name
          </label>
        </div>

        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 pt-6 text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg outline-none peer focus:border-blue-500 transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute left-3 -translate-y-3 top-3 text-xs text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:-translate-y-0 peer-focus:top-3 peer-focus:text-xs peer-focus:-translate-y-3 peer-focus:text-blue-600"
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
            className="w-full p-3 pt-6 text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg outline-none peer focus:border-blue-500 transition-colors"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute left-3 -translate-y-3 top-3 text-xs text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:-translate-y-0 peer-focus:top-3 peer-focus:text-xs peer-focus:-translate-y-3 peer-focus:text-blue-600"
          >
            Password
          </label>
        </div>

        {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Sign Up
        </button>
      </form>
      <div className="text-sm text-center mt-6">
        <p className="text-gray-600">
          Already have an account?
          <Link href="/auth/login" className="font-medium text-blue-600 hover:underline ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}