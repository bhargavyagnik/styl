import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Style Match: Get perfect clothes while buying",
  description: "Recommends you the best matching clothes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </head>
      <body className={inter.className}>
        <header className="shadow-md">
          <nav className="container mx-auto px-6 flex justify-between items-center">
            <Link href="/"> 
            <img src="/favicon.ico" alt="Logo" className="h-20 w-auto"/>
            </Link>
            <div>
              <Link href="/" className="px-4 py-2 text-800 hover:font-semibold">Home</Link>
              <Link href="/ai_stylist" className="px-4 py-2 text-800 hover:font-semibold">AI Stylist</Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-6 py-8">
          {children}
        </main>
        {/* <footer className="bg-gray-100 py-6">
          <div className="container mx-auto px-6 text-center">
            <p className="mt-4">Copyright <a href="https://www.bhargavyagnik.com" className="text-blue-600 hover:underline">Bhargav Yagnik</a></p>
          </div>
        </footer> */}
      </body>
    </html>
  );
}