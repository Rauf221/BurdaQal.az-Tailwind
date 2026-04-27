"use client";

import Preloader from "@/components/elements/Preloader";
import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * İlk client yüklənməsində tam ağ örtük.
 * - `useIsFetching` valideyndə uşaq `useQuery` qeydindən əvvəl 0 ola bilər; `paintReady` ilə
 *   ilk layout + rAF-dan sonra ölçürük (emptyPage/idle taimerləri ondan sonra).
 * DOM hazırdan sonra aktiv fetch bitənə + debounce qədər gözləyir.
 * Bir dəfə bağlandıqdan sonra naviqasiya/refetch örtüyü yenidən göstərmir.
 */
const FADE_OUT_MS = 1250;
const IDLE_DEBOUNCE_MS = 120;
const NO_QUERY_GRACE_MS = 1200;

type Gate = "loading" | "fading" | "hidden";

export function AppLoadingGate({ children }: { children: ReactNode }) {
  const [gate, setGate] = useState<Gate>("loading");
  const isFetching = useIsFetching();
  const [domReady, setDomReady] = useState(false);
  const [paintReady, setPaintReady] = useState(false);
  const [idleStable, setIdleStable] = useState(false);
  const [emptyPageOk, setEmptyPageOk] = useState(false);

  const dismissed = useRef(false);
  const hadActiveFetch = useRef(false);

  useEffect(() => {
    if (document.readyState === "loading") {
      const onReady = () => setDomReady(true);
      document.addEventListener("DOMContentLoaded", onReady, { once: true });
      return () => document.removeEventListener("DOMContentLoaded", onReady);
    }
    const id = requestAnimationFrame(() => setDomReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      setPaintReady(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (dismissed.current) return;
    if (isFetching > 0) hadActiveFetch.current = true;
  }, [isFetching]);

  useEffect(() => {
    if (!domReady || !paintReady) return;
    const id = window.setTimeout(() => setEmptyPageOk(true), NO_QUERY_GRACE_MS);
    return () => clearTimeout(id);
  }, [domReady, paintReady]);

  useEffect(() => {
    if (dismissed.current) return;
    if (!domReady || !paintReady) return;
    if (isFetching > 0) {
      setIdleStable(false);
      return;
    }
    const id = window.setTimeout(() => setIdleStable(true), IDLE_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [domReady, paintReady, isFetching]);

  useEffect(() => {
    if (dismissed.current) return;
    if (gate !== "loading") return;
    if (!domReady || !paintReady || !idleStable) return;
    if (!hadActiveFetch.current && !emptyPageOk) return;
    dismissed.current = true;
    setGate("fading");
  }, [gate, domReady, paintReady, idleStable, emptyPageOk, isFetching]);

  useEffect(() => {
    if (gate !== "fading") return undefined;
    const id = setTimeout(() => setGate("hidden"), FADE_OUT_MS);
    return () => clearTimeout(id);
  }, [gate]);

  const showOverlay = gate === "loading" || gate === "fading";
  const gatePhase = gate === "fading" ? "fading" : "loading";

  return (
    <>
      {showOverlay ? <Preloader variant="gate" gatePhase={gatePhase} /> : null}
      {children}
    </>
  );
}
