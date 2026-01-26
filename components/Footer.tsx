'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSiteContent } from '@/contexts/SiteContentContext';

export default function Footer() {
  const siteContent = useSiteContent();
  const { footer, site } = siteContent;
  const copyrightText = footer.copyright.replace(
    '{{year}}',
    new Date().getFullYear().toString()
  );

  return (
    <footer className="bg-[#0D0D52] text-white">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        
        {/* Main Footer Grid - 5 Columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Brand Column - Spans 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={site.logo.src}
                alt={site.logo.alt}
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            
            {/* Description */}
            <p className="text-gray-300 max-w-md leading-relaxed">
              {footer.description}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href={`mailto:${footer.contact.email}`}
                className="flex items-center text-gray-300 hover:text-[#1A2BC2] transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                {footer.contact.email}
              </a>
              <a
                href={`tel:${footer.contact.phone.replace(/\s+/g, '')}`}
                className="flex items-center text-gray-300 hover:text-[#1A2BC2] transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                {footer.contact.phone}
              </a>
              <div className="flex items-start text-gray-300">
                <svg className="w-5 h-5 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{footer.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Company Links Column */}
          <div>
            <h3 className="text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footer.columns.company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-300 hover:text-[#1A2BC2] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links Column */}
          <div>
            <h3 className="text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {footer.columns.services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-300 hover:text-[#1A2BC2] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links Column */}
          <div>
            <h3 className="text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {footer.columns.support.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-300 hover:text-[#1A2BC2] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              {copyrightText}
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {footer.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="w-10 h-10 rounded-full bg-[#1B1C1E] hover:bg-[#1A2BC2] flex items-center justify-center transition-colors"
                >
                  <span className="text-xs font-semibold">{item.label.slice(0, 2).toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
