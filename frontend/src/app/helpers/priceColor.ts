export function priceColor(price?: string) {
   if (!price) return 'text-gray-500';

  const clean = price.replace(/[¥￥€]/g, '$');
  switch (clean) {
    case '$':   return 'text-emerald-600';
    case '$$':  return 'text-amber-600';
    case '$$$': return 'text-rose-600';
    default:    return 'text-gray-500';
  }
}