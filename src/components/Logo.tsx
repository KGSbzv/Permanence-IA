import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';

export default function Logo({ height = 40, dark = false, href = '/' }: { height?: number; dark?: boolean; href?: string | null }) {
  const { market } = useI18n();
  // Toutes les langues : pictogramme + marque et slogan du marché en texte (net à toute taille ;
  // le slogan du logo image français devenait illisible à 40 px de haut).
  const content = (
    <span className="inline-flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dark ? '/logo/mark-dark.png' : '/logo/mark-light.png'} alt={market.brand} style={{ height, width: 'auto' }} />
      <span className="flex flex-col leading-none">
        <span aria-hidden className={`font-display font-bold tracking-tight ${dark ? 'text-white' : 'text-ink'}`} style={{ fontSize: Math.round(height * 0.5) }}>{market.brand}</span>
        <span className={`mt-1 text-[11px] font-medium ${dark ? 'text-white/60' : 'text-slate'}`}>{market.tagline}</span>
      </span>
    </span>
  );
  return href ? <Link href={href} className="inline-flex shrink-0 items-center rounded-md">{content}</Link> : content;
}
