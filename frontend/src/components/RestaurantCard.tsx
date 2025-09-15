// src/components/RestaurantCard.tsx
'use client';
import Image from 'next/image';
import { Star, StarHalf } from 'lucide-react';
import { priceColor } from '@/app/helpers/priceColor';
import toast from 'react-hot-toast';
import { addToWishlist } from '@/lib/wishlist';
import { useUser } from './AuthProvider';
import { useState } from 'react';

interface Restaurant {
  id: string;
  name: string;
  category?: string;
  rating?: number;
  price?: string;
  photoUrl?: string;
}

type Props = Restaurant;

function SaveButton({ restaurant }: { restaurant: Restaurant }) {
  const { user, loading: authLoading } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  if (authLoading || !user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await addToWishlist(user.uid, restaurant);

      // 🍕 Image/emoji toast
      toast.custom((t) => (
        <div
          className={`card flex items-center gap-3 p-3 ${t.visible ? 'animate-in fade-in slide-in-from-top-2' : 'animate-out fade-out'}`}
        >
          <span style={{ fontSize: 22 }}>🍕</span>
          <div className="text-sm">
            <div className="font-semibold">Saved to Wishlist</div>
            <div className="text-zinc-400">You can view it anytime.</div>
          </div>
        </div>
      ));
    } catch (err) {
      toast.custom((t) => (
        <div
          className={`card flex items-center gap-3 p-3 ${t.visible ? 'animate-in fade-in slide-in-from-top-2' : 'animate-out fade-out'}`}
        >
          <span style={{ fontSize: 22 }}>😵‍💫</span>
          <div className="text-sm">
            <div className="font-semibold text-red-300">Couldn’t save</div>
            <div className="text-zinc-400">Please try again.</div>
          </div>
        </div>
      ));
      console.error('Error adding to wishlist:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={() => { void handleSave(); }}
      className="ml-2 text-sm text-carrot hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isSaving}
    >
      {isSaving ? 'Saving…' : 'Save'}
    </button>
  );
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - filled - half;
  return (
    <span className="inline-flex">
      {Array.from({ length: filled }).map((_, i) => <Star key={`f${i}`} size={16} />)}
      {half === 1 && <StarHalf size={16} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`o${i}`} size={16} className="opacity-40" />
      ))}
    </span>
  );
}

export default function RestaurantCard({
  id, name, rating = 0, price, category, photoUrl,
}: Props) {
  return (
    <article className="card overflow-hidden transition-transform duration-200 ease-tasty hover:-translate-y-0.5 hover:shadow-soft" data-testid="restaurant-card">
      <div className="relative h-32 sm:h-40 w-full">
        <Image
          src={photoUrl ?? '/placeholder.png'}
          alt={name}
          fill
          className="rounded-t-xl object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="flex-1 p-3 flex flex-col justify-between">
        <div className="flex items-start">
          <h3 className="font-semibold flex-1">{name}</h3>
          <SaveButton restaurant={{ id, name, rating, price, category, photoUrl }} />
        </div>

        <p className="text-sm text-zinc-300 mt-1">
          <Stars rating={rating} /> {rating.toFixed(1)} •{' '}
          <span className={priceColor(price) + ' dark:opacity-90'}>
            {price ?? '$$'}
          </span>
          {category ? <> • {category}</> : null}
        </p>
      </div>
    </article>
  );
}
