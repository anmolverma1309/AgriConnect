import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#2c3e50] text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-3">AgriConnect</h3>
            <p className="text-gray-300 text-sm">Your complete farming partner for modern agriculture.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/prices" className="hover:text-green-400 transition">Marketplace</Link></li>
              <li><Link href="/farmlog" className="hover:text-green-400 transition">Farm Log</Link></li>
              <li><Link href="/tools" className="hover:text-green-400 transition">AI Tools</Link></li>
              <li><Link href="/knowledge-hub" className="hover:text-green-400 transition">Knowledge Hub</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/hire-labour" className="hover:text-green-400 transition">Hire Labour</Link></li>
              <li><Link href="/insurance" className="hover:text-green-400 transition">Insurance</Link></li>
              <li><Link href="/loan" className="hover:text-green-400 transition">Loans</Link></li>
              <li><Link href="/digilocker" className="hover:text-green-400 transition">DigiLocker</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/support" className="hover:text-green-400 transition">Help Center</Link></li>
              <li><Link href="/login" className="hover:text-green-400 transition">Login</Link></li>
              <li><Link href="/profile" className="hover:text-green-400 transition">Profile</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-6 pt-6 text-center text-gray-400 text-sm">
          © 2024 AgriConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
