import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import './globals.css';
import { Providers } from './providers'; // Next-themes provider wrapper

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
});

export const metadata: Metadata = {
  title: 'CoreSight · Connected Academic Management',
  description: 'Unified Academic & Student Information System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}