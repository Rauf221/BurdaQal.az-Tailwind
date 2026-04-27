import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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
      className={`${roboto.variable} h-full antialiased`}
    >
      <body className={`${roboto.className} flex min-h-full flex-col`}>
        {children}
        <Script
          src="https://app.inlyne.ai/scripts/preview.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
