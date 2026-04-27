/** Server komponentlər üçün API baza URL (justhome `getApiBaseUrl` məntiqi). */
export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  return typeof base === "string" ? base.replace(/\/$/, "") : "";
}
