'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Team', href: '/team' },
    { name: 'Training', href: '/training' },
    { name: 'Courses', href: '/courses' },
    { name: 'Consultancy', href: '/consultancy' },
    { name: 'Portfolio', href: '/portfolio' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/assets/img/hth-logo.svg"
              alt="Hyperion Tech Hub"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="transition-colors text-[#1B1C1E] hover:text-[#1A2BC2]"
              >
                {item.name}
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
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-[#1B1C1E] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
            )}
            <Link
              href="/get-started"
              className="px-4 py-2 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white rounded-lg transition-colors"
            >
              Get Started
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
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[#1B1C1E] hover:text-[#1A2BC2] font-medium py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
                <Link
                  href="/get-started"
                  className="px-4 py-2 bg-[#1A2BC2] hover:bg-[#0D0D52] text-white rounded-lg text-center transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

