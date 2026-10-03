import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Performance Marketing Intelligence | AI Funnel & Creative Diagnostic Agent',
  description: 'AI-powered intelligence platform for performance marketers combining performance data, creative vision analysis, landing page message match, and historical learning memory.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#fbfcfb] text-[#121316] antialiased selection:bg-[#e2f976] selection:text-[#121316]">
        {children}
      </body>
    </html>
  );
}
