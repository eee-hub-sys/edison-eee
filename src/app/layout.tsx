import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "EDISON | Department of EEE",
  description: "Official portal for EDISON Club, Department of EEE. Powering innovation and engineering excellence.",
  icons: {
    icon: "/eee-logo.png",
    shortcut: "/eee-logo.png",
    apple: "/eee-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
