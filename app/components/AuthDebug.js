// app/components/AuthDebug.js - Temporary debug component
'use client';
import { useSession } from 'next-auth/react';

export function AuthDebug() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="p-4 bg-yellow-100 rounded-lg">Loading session...</div>;
  }

  if (!session) {
    return <div className="p-4 bg-red-100 rounded-lg">No session found</div>;
  }

  return (
    <div className="p-4 bg-green-100 rounded-lg">
      <h3 className="font-bold mb-2">Session Debug Info:</h3>
      <pre className="text-sm overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
