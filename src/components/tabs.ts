// Navigation clavier commune aux listes d’onglets (motif ARIA « tabs »).
import type React from 'react';

/** Onglets : flèches gauche/droite (inversées en RTL), Début/Fin → indice de l’onglet visé, ou undefined. */
export function tabKeyTarget(e: React.KeyboardEvent, i: number, n: number) {
  const rtl = document.documentElement.dir === 'rtl';
  const fwd = (i + 1) % n, back = (i - 1 + n) % n;
  const next = ({ ArrowRight: rtl ? back : fwd, ArrowLeft: rtl ? fwd : back, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
  if (next !== undefined) e.preventDefault();
  return next;
}
