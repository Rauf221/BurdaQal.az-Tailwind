import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAcceptLanguageHeader(locale: string): string {
  const normalized = String(locale || "").trim().toLowerCase()
  if (!normalized) return "az"
  // Keep it simple: backend expects a locale-ish value; allow full tags too.
  return normalized
}
