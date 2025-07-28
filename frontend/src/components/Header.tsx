'use client';
import Link from 'next/link';
import SignInButton from '@/components/SignInButton';
import { useUser } from '@/components/AuthProvider';
import MobileNav from '@/components/MobileNav';

export default function Header() {
  const user = useUser();

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="font-bold text-lg">
        Forkly
      </Link>

      <nav className="hidden sm:flex items-center gap-4">
        {user && (
          <Link href="/wishlist" className="text-sm hover:underline">
            Wishlist
          </Link>
        )}
        <SignInButton />
      </nav>
      <div className="sm:hidden">
        <MobileNav />
      </div>
    </header>
  );
}
