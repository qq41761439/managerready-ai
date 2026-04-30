import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ManagerReady AI",
  description: "Turn rough multilingual work notes into manager-ready English updates.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
