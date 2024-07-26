export default function formatCount(count: number): string {
  if (count > 999999) return `${Math.floor(count / 100000) / 10}m`;

  if (count > 999) return `${Math.floor(count / 100) / 10}k`;

  return count.toString();
}
