import "./globals.css";
import { geistSans, geistMono } from "./fonts";
import { Providers } from "@/components/Providers";

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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}