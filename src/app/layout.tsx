import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buja Project",
  description: "Survey and Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

