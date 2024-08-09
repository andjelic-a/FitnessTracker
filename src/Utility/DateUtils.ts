export function addDays(date: Date, days: number) {
  const newDate = new Date(date.valueOf());
  newDate.setDate(date.getDate() + days);
  return newDate;
}

export function getStartOfWeek(date: Date): Date {
  const diff = (7 + (date.getDay() - 1)) % 7;
  return new Date(date.getTime() - diff * 24 * 60 * 60 * 1000);
}
