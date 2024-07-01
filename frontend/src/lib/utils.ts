import { type ClassValue, clsx } from "clsx"
import { DateTime, Settings } from "luxon";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

Settings.defaultLocale = 'ru';

export const formatDate = (date: string) => {
  return DateTime.fromISO(date).toFormat("dd MMMM yyyy г., EEEE");
}