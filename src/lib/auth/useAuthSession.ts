"use client";

import { useEffect, useState } from "react";
import { AUTH_TOKEN_CHANGED_EVENT, getAuthToken } from "@/lib/api/client";

/**
 * Cookie-də access_token varsa true.
 * SSR ilə uyğun gəlməsi üçün ilk render false; mount-dan sonra sinxronlaşır.
 */
export function useAuthSession(): boolean {
  // Heç vaxt client ilk render-də server-dən fərqli olmasın: SSR+hydration hər ikisi false.
  // Token barədə həqiqət yalnız effect-də (və event-də) yenilənir.
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const sync = () => setAuthed(Boolean(getAuthToken()));
    sync();
    window.addEventListener(AUTH_TOKEN_CHANGED_EVENT, sync);
    return () => window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT, sync);
  }, []);

  return authed;
}
