import type { Metadata } from "next";
import "@/styles/globals.css";
import { COPY } from "@/lib/copy";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: COPY.landing.title,
  description: COPY.landing.description,
  openGraph: {
    title: COPY.landing.title,
    description: COPY.landing.description,
    type: "website",
    images: [{ url: "/og-image.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: COPY.landing.title,
    description: COPY.landing.description,
    images: ["/og-image.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
