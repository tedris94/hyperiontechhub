import Link from 'next/link';

export default function DashboardNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-[#1B1C1E] mb-2">Page not found</h1>
        <p className="text-gray-600 mb-6">This dashboard page does not exist yet.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#1A2BC2] text-white hover:bg-[#0D0D52]"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
