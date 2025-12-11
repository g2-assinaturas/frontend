import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'SaaS Control',
  description: 'Gestão de assinaturas, faturação e empresas num só painel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className={`${spaceGrotesk.variable} min-h-screen bg-ink-50 text-ink-900 font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
