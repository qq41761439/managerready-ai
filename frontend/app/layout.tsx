import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "../lib/marketing";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ManagerReady AI",
    template: "%s",
  },
  description: "Turn rough multilingual work notes into manager-ready English updates.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "ManagerReady AI",
    description: "Turn rough multilingual work notes into manager-ready English updates.",
    url: SITE_URL,
    siteName: "ManagerReady AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ManagerReady AI",
    description: "Turn rough multilingual work notes into manager-ready English updates.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
