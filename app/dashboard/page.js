// FILE: app/dashboard/page.js
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, User, Mail, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Welcome to your Dashboard, {session.user.name}
        </h1>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={session.user.image}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-500"
            />
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{session.user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-2">
                <Mail className="h-4 w-4" />
                {session.user.email}
              </p>
               <p className="text-gray-500 dark:text-gray-500 text-sm flex items-center justify-center md:justify-start gap-2 mt-2">
                <User className="h-4 w-4" />
                Database ID: {session.user.id}
              </p>
            </div>
          </div>
          
          <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Your Activity
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              User activity tracking (quiz/test history) will be displayed here in a future update.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
