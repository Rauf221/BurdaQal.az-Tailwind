"use client";

import { useEffect, useState } from "react";

const LOADING_LOGO_SRC = "/images/logo/icon%20logo%20dark.svg";

export type PreloaderProps = {
  variant?: "default" | "transparent" | "white" | "gate";
  gatePhase?: "loading" | "fading";
};

/**
 * - `default` — ağ fon, loqo nəbzi
 * - `gate` — AppLoadingGate: DOM hazırlanana qədər ağ + pulse; `fading`-də fon/loqo tədricən şəffaf
 */
export default function Preloader({
  variant = "default",
  gatePhase = "loading",
}: PreloaderProps) {
  const [whiteToClear, setWhiteToClear] = useState(false);

  useEffect(() => {
    if (variant !== "white") return undefined;
    const id = requestAnimationFrame(() => {
      setWhiteToClear(true);
    });
    return () => cancelAnimationFrame(id);
  }, [variant]);

  if (variant === "gate") {
    const rootClass = [
      "jh-preload",
      "jh-preload-container",
      "jh-preload-container--gate",
      gatePhase === "loading" && "jh-preload-container--gate-loading",
      gatePhase === "fading" && "jh-preload-container--gate-fading",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={rootClass}
        aria-busy={gatePhase === "loading"}
        aria-live="polite"
      >
        <div className="middle">
          <img
            key={gatePhase}
            className="jh-preload-container__logo"
            src={LOADING_LOGO_SRC}
            alt=""
            width={96}
            height={96}
            decoding="async"
          />
        </div>
      </div>
    );
  }

  const rootClass = [
    "jh-preload",
    "jh-preload-container",
    variant === "transparent" && "jh-preload-container--transparent",
    variant === "white" && "jh-preload-container--white",
    variant === "white" && whiteToClear && "jh-preload-container--white-to-clear",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} aria-busy="true" aria-live="polite">
      <div className="middle">
        <img
          className="jh-preload-container__logo"
          src={LOADING_LOGO_SRC}
          alt=""
          width={96}
          height={96}
          decoding="async"
        />
      </div>
    </div>
  );
}
