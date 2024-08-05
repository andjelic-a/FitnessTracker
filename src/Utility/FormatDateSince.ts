export default function formatDateSince(date: Date): string {
  const span = new Date().getTime() - date.getTime();
  if (span > 31536000000) {
    const years = Math.floor(span / 31536000000);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
  if (span > 2592000000) {
    const months = Math.floor(span / 2592000000);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
  if (span > 86400000) {
    const days = Math.floor(span / 86400000);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
  if (span > 3600000) {
    const hours = Math.floor(span / 3600000);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  if (span > 60000) {
    const minutes = Math.floor(span / 60000);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }
  if (span > 15000) {
    const seconds = Math.floor(span / 1000);
    return `${seconds} seconds ago`;
  }
  return "just now";
}
