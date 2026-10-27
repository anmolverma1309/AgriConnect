import Link from 'next/link';
import { ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.58 9.55c-1.84-3.53-5.02-6.11-8.8-6.53-2.2-.25-4.44.2-6.39 1.28-1.95 1.08-3.51 2.76-4.48 4.79-.31.65-.21 1.41.24 1.95.45.54 1.2.75 1.86.54.66-.21 1.11-.82.9-1.48.79-1.67 2.06-3.03 3.65-3.87 1.59-.84 3.42-1.16 5.25-.9 3.03.43 5.61 2.5 6.96 5.11.39.75 1.22 1.13 2 .85.78-.28 1.25-1.08.97-1.85zM2.42 14.45c1.84 3.53 5.02 6.11 8.8 6.53 2.2.25 4.44-.2 6.39-1.28 1.95-1.08 3.51 2.76 4.48-4.79.31-.65-.21-1.41-.24-1.95-.45-.54-1.2-.75-1.86-.54-.66-.21-1.11.82-.9 1.48-.79 1.67-2.06 3.03-3.65 3.87-1.59-.84-3.42-1.16-5.25-.9-3.03-.43-5.61-2.5-6.96-5.11-.39-.75-1.22-1.13-2-.85-.78-.28-1.25-1.08-.97 1.85z" fill="#2ECC71"/>
            </svg>
            <h1 className="text-xl font-bold text-gray-800">AgriConnect</h1>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/prices" className="text-gray-600 hover:text-green-600 font-medium transition">Marketplace</Link>
            <Link href="/farmlog" className="text-gray-600 hover:text-green-600 font-medium transition">Farm Log</Link>
            <Link href="/tools" className="text-gray-600 hover:text-green-600 font-medium transition">AI Tools</Link>
            <Link href="/knowledge-hub" className="text-gray-600 hover:text-green-600 font-medium transition">Knowledge Hub</Link>
            <Link href="/hire-labour" className="text-gray-600 hover:text-green-600 font-medium transition">Labour</Link>
            <Link href="/insurance" className="text-gray-600 hover:text-green-600 font-medium transition">Insurance</Link>
            <Link href="/digilocker" className="text-gray-600 hover:text-green-600 font-medium transition">DigiLocker</Link>
            <Link href="/profile">
              <img src="https://placehold.co/40x40/E8F5E9/2c3e50?text=U" alt="Profile" className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-green-500 transition cursor-pointer" />
            </Link>
          </nav>
          
          <button className="md:hidden p-2" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
