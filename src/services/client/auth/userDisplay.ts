/** GET get-user cavabından göstərici mətn çıxarır (data qabığı və ya kök). */
export function pickUserDisplay(
  payload: unknown,
): { title: string; subtitle?: string } {
  if (payload == null || typeof payload !== "object") {
    return { title: "Hesab" };
  }
  let o: Record<string, unknown> = payload as Record<string, unknown>;
  if (o.data != null && typeof o.data === "object") {
    o = o.data as Record<string, unknown>;
  }
  const name = o.name ?? o.full_name ?? o.username;
  const title =
    typeof name === "string" && name.trim() ? name.trim() : "İstifadəçi";
  const em = o.email;
  const subtitle = typeof em === "string" && em.trim() ? em.trim() : undefined;
  return { title, subtitle };
}
