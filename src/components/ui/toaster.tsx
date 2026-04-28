"use client";

import { Toaster as SonnerToaster } from "sonner";

export function AppToaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "bg-white text-[var(--color-foreground)] border border-[var(--color-jh-border)] shadow-lg",
          title: "font-semibold",
          description: "text-[color:var(--color-jh-text)]",
          actionButton: "bg-[var(--color-jh-primary)] text-white",
          cancelButton: "bg-[var(--color-jh-border)] text-[var(--color-foreground)]",
        },
      }}
    />
  );
}

