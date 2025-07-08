// src/components/RestaurantCard.tsx
import Image from 'next/image';
import { Star, StarHalf, Star as StarOutline } from 'lucide-react';
import { priceColor } from '../app/helpers/priceColor';
import { toast } from 'react-hot-toast';
import { addToWishlist } from '@/lib/wishlist';
import { useUser } from './AuthProvider';

type Props = {
  id: string;
  name: string;
  rating: number;
  price?: string;
  category: string;
  photoUrl?: string;
};

function SaveButton({ bizId }: { bizId: string }) {
  const user = useUser();
  if (!user) return null;

  const handleSave = async () => {
    try {
      await addToWishlist(user.uid, bizId);   // ← arguments here
      toast.success('Added to wishlist!');     // ← toast here
    } catch (err) {
      toast.error('Could not save, try again.');
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleSave}
      className="ml-2 text-xs text-indigo-600 hover:underline"
    >
      Save
    </button>
  );
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.floor(rating);
  const half   = rating % 1 >= 0.5 ? 1 : 0;
  const empty  = 5 - filled - half;

  return (
    <span className="inline-flex">
      {Array.from({ length: filled }).map((_, i) => <Star key={`f${i}`} size={16} />)}
      {half === 1 && <StarHalf size={16} />}
      {Array.from({ length: empty }).map((_, i) => (
        <StarOutline key={`o${i}`} size={16} className="opacity-40" />
      ))}
    </span>
  );
}

export default function RestaurantCard({
  id,
  name,
  rating,
  price,
  category,
  photoUrl,
}: Props) {
  return (
    <article className="flex flex-col h-full rounded-xl border shadow transition">
      {/* thumbnail */}
      <div className="relative h-32 sm:h-40 w-full">
        <Image
          src={photoUrl ?? '/placeholder.png'}
          alt={name}
          fill
          className="rounded-t-xl object-cover"
        />
      </div>

      {/* text */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div className="flex items-start">
          <h3 className="font-semibold flex-1 text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          <SaveButton bizId={id} />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          <Stars rating={rating} /> {rating.toFixed(1)} •
          <span className={priceColor(price) + ' dark:opacity-90'}>
            {price ?? '?'}
          </span>
          &nbsp;• {category}
        </p>
      </div>
    </article>
  );
}
