// Rendu des textes enrichis du contenu (gras, liens) sans HTML brut dans les fichiers de langue.
import React from 'react';
import Link from 'next/link';
import type { Block, Rich } from './content/fr/ui/pages';

export function RichText({ value, linkClassName }: { value: Rich; linkClassName?: string }) {
  if (typeof value === 'string') return <>{value}</>;
  return (
    <>
      {value.map((s, i) => {
        if (typeof s === 'string') return <React.Fragment key={i}>{s}</React.Fragment>;
        if ('b' in s) return <b key={i}>{s.b}</b>;
        if ('strong' in s) return <strong key={i}>{s.strong}</strong>;
        // Lien interne : next/link garde la langue courante.
        if (s.href.startsWith('/')) return <Link key={i} href={s.href} className={linkClassName}>{s.a}</Link>;
        return <a key={i} href={s.href} className={linkClassName}>{s.a}</a>;
      })}
    </>
  );
}

export function RichBlocks({ blocks, ulClassName, linkClassName }: { blocks: Block[]; ulClassName?: string; linkClassName?: string }) {
  return (
    <>
      {blocks.map((b, i) => {
        if ('ul' in b) return <ul key={i} className={ulClassName}>{b.ul.map((li, j) => <li key={j}><RichText value={li} linkClassName={linkClassName} /></li>)}</ul>;
        if ('note' in b) return <p key={i} className="text-sm text-slate-light"><RichText value={b.note} linkClassName={linkClassName} /></p>;
        return <p key={i}><RichText value={b.p} linkClassName={linkClassName} /></p>;
      })}
    </>
  );
}
