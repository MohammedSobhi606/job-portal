import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const roboto = Roboto_Condensed({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jop Portal",
    template: "%s | Jop Portal",
  },
  description: "find your dream job",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} min-w-[350px]`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
