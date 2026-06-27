import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ClinicApp — Book Doctors Online",
  description:
    "Book appointments with top doctors in minutes. Trusted by 50,000+ patients. No sign-up hassle, no long waits — just seamless healthcare.",
  keywords: "clinic, doctor appointment, book doctor, healthcare, online consultation",
  openGraph: {
    title: "ClinicApp — Your Health, Our Priority",
    description: "Find & book top doctors instantly. Verified specialists across all fields.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0a0a0f" }}>
        <Providers>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
