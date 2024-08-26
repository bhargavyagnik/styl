'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();

  return (
    <footer className="shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/favicon.ico" alt="Logo" width={40} height={40} className="invert" />
              <span className="text-xl font-bold">StyleMe</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link href="/ai_stylist" className="hover:text-gray-300 transition-colors">AI Stylist</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} StyleMe. All rights reserved.</p>
          <p className="mt-2">Site developed by <a href="https://bhargavyagnik.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-black transition-colors">Bhargav,Yash,& Tanmay</a></p>
        </div>
      </div>
    </footer>
  );
}