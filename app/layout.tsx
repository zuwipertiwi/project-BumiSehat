import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BumiSehat - Platform Aktivitas Ramah Lingkungan",
  description: "Catat dan pantau aktivitas ramah lingkunganmu untuk masa depan yang lebih hijau",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
