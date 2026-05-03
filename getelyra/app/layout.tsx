import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elyra — Multi-Agentic Hedge Fund",
  description: "Elyra is a multi-agentic hedge fund powered by AI. Precision intelligence. Cinematic returns.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
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
