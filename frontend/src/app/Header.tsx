'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="shadow-md">
      <nav className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/"> 
          <Image src="/favicon.ico" alt="Logo" width={80} height={80} />
        </Link>
        <div>
          <Link 
            href="/" 
            className={`px-4 py-2 text-800 headertxt ${
              pathname === '/' ? 'px-4 py-2 font-semibold border-b-2 border-current' : ''
            }`}
          >
            Home
          </Link>
          <Link 
            href="/ai_stylist" 
            className={`px-4 py-2 text-800 headertxt ${
              pathname === '/ai_stylist' ? 'px-4 py-2 font-semibold border-b-2 border-current' : ''
            }`}
          >
            AI Stylist
          </Link>
        </div>
      </nav>
    </header>
  );
}