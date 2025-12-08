'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ marginBottom: '1rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontWeight: 700, letterSpacing: '0.05em' }}>MOBILE CTF</span>
            <small>10 niveles · App Router</small>
          </div>
        </Link>
        {!isHome && (
          <Link href="/" style={{ color: '#22c55e', fontWeight: 700 }}>
            Inicio
          </Link>
        )}
      </div>
    </motion.header>
  );
}
