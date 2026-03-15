import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialsPost – Content Calendar",
  description: "Schedule and manage your social media video content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
