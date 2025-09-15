'use client';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { fetchUserWishlistDetails, removeFromWishlist, Restaurant } from '@/lib/wishlist';
import RestaurantCard from '@/components/RestaurantCard';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [user, authLoading, authError] = useAuthState(auth);
  const [wishlist, setWishlist] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || authLoading) return;

    setLoading(true);
    fetchUserWishlistDetails(user.uid)
      .then((data) => {
        console.log('Fetched wishlist data:', data);
        setWishlist(data);
      })
      .catch((err) => {
        console.error('Error fetching wishlist:', err);
        toast.error('Failed to load wishlist.');
      })
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const handleRemove = async (id: string) => {
    if (!user) return;
    try {
      await removeFromWishlist(user.uid, id);
      setWishlist((prev) => prev.filter((item) => item.id !== id));
      toast.success('Removed from wishlist!');
    } catch (err) {
      console.error('Error removing wishlist item:', err);
      toast.error('Failed to remove item.');
    }
  };

  if (authLoading) return <div className="p-6 text-center">Checking authentication...</div>;
  if (authError) return <div className="p-6 text-center text-red-500">Auth error: {authError.message}</div>;
  if (!user) return <div className="p-6 text-center">Please sign in to view your wishlist.</div>;
  if (loading) return <div className="p-6 text-center">Loading your wishlist...</div>;
  if (wishlist.length === 0) return <div className="p-6 text-center">Your wishlist is empty.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((restaurant) => (
          <div key={restaurant.id} className="relative group">
            <RestaurantCard
              id={restaurant.id}
              name={restaurant.name}
              rating={restaurant.rating ?? 0}
              price={restaurant.price ?? '?'}
              category={restaurant.category ?? 'N/A'}
              photoUrl={restaurant.photoUrl}
            />
            <button
              onClick={() => void handleRemove(restaurant.id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
