// src/components/MobileNav.tsx
'use client';
import { Disclosure } from '@headlessui/react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import SignInButton from './SignInButton';
import { useUser } from './AuthProvider';

export default function MobileNav() {
  const user = useUser();

  return (
    <Disclosure as="nav" className="sm:hidden border-b">
      {({ open }) => (
        <>
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="font-bold text-lg">
              Forkly
            </Link>
            <Disclosure.Button className="p-2 rounded">
              {open ? <X size={24} /> : <Menu size={24} />}
            </Disclosure.Button>
          </div>

          <Disclosure.Panel className="space-y-2 px-4 pb-4">
            {user && <Link href="/wishlist">Wishlist</Link>}
            <SignInButton />
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
