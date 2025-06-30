// src/components/RestaurantCardSkeleton.tsx
export default function RestaurantCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border p-3 animate-pulse">
      <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-gray-300" />
      <div className="flex flex-col justify-center space-y-2 flex-1">
        <div className="h-4 w-2/3 bg-gray-300 rounded" />
        <div className="h-3 w-1/3 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
