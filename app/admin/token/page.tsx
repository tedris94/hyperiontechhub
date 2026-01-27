'use client';

import { useState } from 'react';
import RequireRole from '@/components/RequireRole';

function generateToken(byteLength: number = 32): string {
  const bytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export default function TokenGeneratorPage() {
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setToken(generateToken());
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <RequireRole
      allowedRoles={['admin', 'super_admin']}
      message="Access denied. Admin roles only."
    >
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-[#1B1C1E]">CMS Token Generator</h1>
            <p className="text-gray-600">
              Generate a secure token and set it as <code>CMS_ADMIN_TOKEN</code> in your
              environment variables.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center px-5 py-2 bg-[#1A2BC2] text-white rounded-md hover:bg-[#0D0D52]"
            >
              Generate Token
            </button>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Generated Token</label>
              <textarea
                value={token}
                readOnly
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
                placeholder="Click Generate Token"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!token}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {copied ? 'Copied!' : 'Copy Token'}
              </button>
              <span className="text-sm text-gray-500">
                Add to <code>.env.local</code> and Vercel.
              </span>
            </div>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
