import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { geistSans, geistMono } from "./fonts";

export const metadata = {
  title: "Pesabu.io",
  description: "Pesabu.io",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}