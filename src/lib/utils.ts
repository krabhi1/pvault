import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyTextToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
export const isDev = process.env.NODE_ENV;
