export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getRelativeDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayString();
}

export function isTomorrow(dateStr: string): boolean {
  return dateStr === getRelativeDateString(1);
}

export function isWithinWeek(dateStr: string): boolean {
  const target = new Date(dateStr + 'T00:00:00');
  const today = new Date(getTodayString() + 'T00:00:00');
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  return target >= today && target <= nextWeek;
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return 'Unscheduled';

  if (isToday(dateStr)) {
    return 'Today';
  }
  if (isTomorrow(dateStr)) {
    return 'Tomorrow';
  }

  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  return dateStr;
}

export function formatFullDate(dateStr: string): string {
  if (!dateStr) return 'No Date';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return dateStr;
}
