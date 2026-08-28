import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OutcomeLock",
  description: "Check if a public-service complaint was really fixed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
