import type { Metadata } from "next";
import { Roboto, Geist } from "next/font/google";
import Script from "next/script";
import LenisRoot from "@/components/lenis/LenisRoot";
import { AppToaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Burdaqal.az",
  description: "Burdaqal.az",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="az"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", roboto.variable, "font-sans", geist.variable)}
    >
      <body className={`${roboto.className} flex min-h-full flex-col`}>
        <LenisRoot>
          {children}
        </LenisRoot>
        <AppToaster />
        <Script
          src="https://app.inlyne.ai/scripts/preview.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
