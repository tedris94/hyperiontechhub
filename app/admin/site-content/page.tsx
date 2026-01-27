'use client';

import { useEffect, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';

export default function SiteContentAdminPage() {
  const [content, setContent] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      const response = await fetch('/api/site-content');
      const data = await response.json();
      setContent(JSON.stringify(data, null, 2));
    };

    void loadContent();
  }, []);

  const handleSave = async () => {
    setStatus('saving');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/site-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: content,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save content.');
      }

      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save.');
    }
  };

  return (
    <RequireAuth message="Please sign in to edit site content.">
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-[#1B1C1E]">Site Content Editor</h1>
            <p className="text-gray-600">
              Update shared site content and assets. Changes apply to headers, footers, and homepage sections.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Admin Token</label>
              <input
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter CMS admin token"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Content JSON</label>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                rows={22}
                className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
              />
            </div>

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <button
              type="button"
              onClick={handleSave}
              disabled={status === 'saving'}
              className="inline-flex items-center px-5 py-2 bg-[#1A2BC2] text-white rounded-md hover:bg-[#0D0D52] disabled:bg-gray-400"
            >
              {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
