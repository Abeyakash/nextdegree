'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button'; // Assuming you have a Button component
import type { User } from '@supabase/supabase-js';

export default function AuthButtons() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="w-24 h-10 bg-gray-200 animate-pulse rounded-lg" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-700 hidden sm:block text-sm">{user.email?.split('@')[0]}</span>
        <Button onClick={handleLogout} variant="secondary" size="default">
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="secondary" size="default" className="transition-all duration-300 transform hover:scale-105">
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild variant="primary" size="default" className="transition-all duration-300 transform hover:scale-105">
        <Link href="/auth/signup">Sign Up</Link>
      </Button>
    </div>
  );
}