export function addDays(date: Date, days: number) {
  const newDate = new Date(date.valueOf());
  newDate.setDate(date.getDate() + days);
  return newDate;
}

export function addMonths(date: Date, months: number) {
  const newDate = new Date(date.valueOf());
  newDate.setMonth(date.getMonth() + months);
  return newDate;
}

export function getStartOfWeek(date: Date): Date {
  const diff = (7 + date.getDay()) % 7;
  return new Date(date.getTime() - diff * 86400000); // 24 * 60 * 60 * 1000
}
