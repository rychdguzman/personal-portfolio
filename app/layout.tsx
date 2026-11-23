import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Portfolio",
  description: "Built with React Bits Pro.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
