import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yunia AI - Personal Assistant",
  description: "Your intelligent personal assistant for productivity and organization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
