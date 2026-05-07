const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const pad = (value: number) => value.toString().padStart(2, '0');

export function formatLocalDateForStorage(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseAppDate(value: string): Date {
  if (DATE_ONLY_REGEX.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }

  return new Date(value);
}

export function getTransactionDateKey(value: string): string {
  return DATE_ONLY_REGEX.test(value) ? value : formatLocalDateForStorage(parseAppDate(value));
}

export function toDateInputValue(value: string): string {
  return getTransactionDateKey(value);
}

export function formatDateLabel(value: string, locale = 'es-ES'): string {
  return parseAppDate(value).toLocaleDateString(locale, { day: '2-digit', month: 'short' });
}

export function formatLongDateLabel(value: string, locale = 'es-ES'): string {
  return parseAppDate(value).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}
