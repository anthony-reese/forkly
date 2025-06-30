export function priceColor(price?: string) {
  switch (price) {
    case '$':   return 'text-emerald-600';
    case '$$':  return 'text-amber-600';
    case '$$$': return 'text-rose-600';
    default:    return 'text-gray-500';
  }
}