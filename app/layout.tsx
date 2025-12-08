import type { Metadata } from 'next';
import './globals.css';
import { Space_Mono } from 'next/font/google';
import Header from '@/components/Header';

const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'Mini CTF Mobile',
  description: 'CTF móvil de 10 niveles listo para Vercel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={spaceMono.className}>
      <body>
        <div className="container">
          <div className="card">
            <Header />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
