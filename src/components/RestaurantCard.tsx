// src/components/RestaurantCard.tsx
import Image from 'next/image';

type Props = {
  name: string;
  rating: number;
  price?: string;
  category: string;
  photoUrl?: string;
};

export default function RestaurantCard({
  name,
  rating,
  price,
  category,
  photoUrl,
}: Props) {
  return (
    <article className="flex gap-4 rounded-xl border p-3 shadow hover:shadow-md transition">
      {/* thumbnail */}
      <div className="relative h-24 w-24 flex-shrink-0">
        <Image
          src={photoUrl ?? '/placeholder.png'}
          alt={name}
          fill
          className="rounded-lg object-cover"
        />
      </div>

      {/* text */}
      <div className="flex flex-col justify-center">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">
          ⭐ {rating} • {price ?? '?'} • {category}
        </p>
      </div>
    </article>
  );
}
