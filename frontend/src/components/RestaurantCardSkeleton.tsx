// src/components/RestaurantCardSkeleton.tsx
export default function RestaurantCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-44 bg-surface-50" />
      <div className="p-4">
        <div className="h-4 w-1/2 bg-surface-50 rounded mb-2" />
        <div className="h-3 w-3/4 bg-surface-50 rounded mb-1" />
        <div className="h-3 w-1/3 bg-surface-50 rounded" />
      </div>
    </div>
  );
}
