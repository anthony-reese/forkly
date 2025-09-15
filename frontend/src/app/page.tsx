// src/app/page.tsx
import { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export default function Page() {
  return (
    <>
      <section
        className="mb-6 rounded-2xl p-6 md:p-8 text-white"
        style={{
          background: "linear-gradient(to right, #002D72, #68ACE5)",
          border: "1px solid rgba(255,255,255,0.10)"
        }}
      >
        <h1 className="text-2xl md:text-3xl font-semibold">
          Find your next favorite bite 🍔
        </h1>
        <p className="mt-2 opacity-90">
          Search by craving and neighborhood—Forkly brings tasty spots to you.
        </p>
        <div className="mt-4">
          {/* <SearchBar ... /> */}
        </div>
      </section>

      <Suspense fallback={<p className="p-6">Loading…</p>}>
        <SearchPageClient />
      </Suspense>
    </>
  );
}
