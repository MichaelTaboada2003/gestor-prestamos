import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parsea una fecha en formato YYYY-MM-DD o ISO garantizando hora local a mediodía,
 * evitando desfases de día causados por conversiones UTC de zona horaria.
 */
export function parseLocalDate(dateString: string | Date | undefined | null): Date {
  if (!dateString) return new Date();
  if (dateString instanceof Date) return dateString;
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
  }
  return new Date(dateString);
}
