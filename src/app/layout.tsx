import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import { Toaster } from 'sonner';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'WhaleMovies Pro — Your Personal Movie Discovery Platform',
  description:
    'Discover, collect, and get AI-powered movie recommendations tailored to your taste. Daily picks, mood-based suggestions, and a smart watchlist — all in one place.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Grammarly ve benzeri eklentilerin Hydration hatası vermesini engellemek için suppressHydrationWarning eklendi
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#0d1117] text-[#e6edf3] font-sans antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#161b22',
              border: '1px solid #30363d',
              color: '#e6edf3',
              fontFamily: 'DM Sans, sans-serif',
            },
          }}
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fwhalemovie2082back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.18" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
      </body>
    </html>
  );
}