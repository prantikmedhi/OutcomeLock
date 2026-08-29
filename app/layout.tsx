import type { Metadata, Viewport } from "next";
import "@/frontend/styles/globals.css";

export const metadata: Metadata = {
  title: "OutcomeLock | Verify the outcome",
  description: "A citizen-side tool for checking whether a complaint was actually resolved.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2f1ec",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
