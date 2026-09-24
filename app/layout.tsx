import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font',
  weight: ['400', '500', '700']
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--serif',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic']
});

export const metadata: Metadata = {
  title: 'MishGa | Digital Experiences That Drive Growth',
  description: 'MishGa designs and builds high-performing websites and digital products that turn ambitious visions into unforgettable brands.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/assets/mishga-logo.png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
