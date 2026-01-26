'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteContent } from '@/contexts/SiteContentContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const siteContent = useSiteContent();
  const { header, site } = siteContent;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={site.logo.src}
              alt={site.logo.alt}
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {header.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors text-[#1B1C1E] hover:text-[#1A2BC2]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-[#1B1C1E] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {header.cta.dashboardLabel}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-[#1B1C1E] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {header.cta.loginLabel}
              </Link>
            )}
            <Link
              href={header.cta.primary.href}
              className="px-4 py-2 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white rounded-lg transition-colors"
            >
              {header.cta.primary.label}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 pt-4">
              {header.navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[#1B1C1E] hover:text-[#1A2BC2] font-medium py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {header.cta.dashboardLabel}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {header.cta.loginLabel}
                  </Link>
                )}
                <Link
                  href={header.cta.primary.href}
                  className="px-4 py-2 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white rounded-lg text-center transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {header.cta.primary.label}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

