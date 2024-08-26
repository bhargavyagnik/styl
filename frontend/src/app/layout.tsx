import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from './Header';  // Adjust the import path as needed
import Footer from './Footer';  // Adjust the import path as needed

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
        <Header />
        <main className="container -my-20 mx-auto px-6 py-8">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}