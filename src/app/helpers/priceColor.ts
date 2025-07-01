export function priceColor(price?: string) {
   if (!price) return 'text-gray-500';

  // Treat ¥¥ the same way as $$
  const clean = price.replace(/¥|￥/g, '$');
  switch (clean) {
    case '$':   return 'text-emerald-600';  // inexpensive
    case '$$':  return 'text-amber-600';    // moderate
    case '$$$': return 'text-rose-600';     // pricey
    default:    return 'text-gray-500';
  }
}