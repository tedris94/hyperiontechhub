'use client';

import { useState } from 'react';
import { DEMO_USERS } from '@/lib/demoUsers';
import RequireRole from '@/components/RequireRole';

export default function UserMigrationPage() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const migrateUsers = async (users: typeof DEMO_USERS) => {
    setStatus('saving');
    setMessage('');
    try {
      const response = await fetch('/api/admin/users/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ users }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Migration failed');
      }

      setStatus('done');
      setMessage(`Inserted ${data.inserted || 0} users.`);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Migration failed');
    }
  };

  const migrateLocalUsers = async () => {
    const stored = localStorage.getItem('hyperion_users');
    const users = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(users) || users.length === 0) {
      setStatus('error');
      setMessage('No local users found.');
      return;
    }
    await migrateUsers(users);
  };

  return (
    <RequireRole allowedRoles={['admin', 'super_admin']} message="Access denied. Admin roles only.">
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-[#1B1C1E]">User Migration</h1>
            <p className="text-gray-600">
              Migrate demo or local users to Supabase. You must provide the CMS admin token.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">CMS Admin Token</label>
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter CMS admin token"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => migrateUsers(DEMO_USERS)}
                disabled={!token || status === 'saving'}
                className="inline-flex items-center px-4 py-2 rounded-md bg-[#1A2BC2] text-white hover:bg-[#0D0D52] disabled:bg-gray-400"
              >
                Migrate Demo Users
              </button>
              <button
                type="button"
                onClick={migrateLocalUsers}
                disabled={!token || status === 'saving'}
                className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Migrate Local Users
              </button>
            </div>

            {message && (
              <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
