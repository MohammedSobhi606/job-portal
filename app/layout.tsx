import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";

const roboto = Roboto_Condensed({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Portal",
  description: "Generated by Job board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} min-w-[350px]`}>{children}</body>
    </html>
  );
}
