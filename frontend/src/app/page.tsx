import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6">Loading…</p>}>
      <SearchPageClient />
    </Suspense>
  );
}