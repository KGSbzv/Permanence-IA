// Montants indicatifs en devise locale à côté des prix en USD (taux BCE du jour, chargés une fois par visite).
import { useEffect, useState } from 'react';

export interface Fx { date: string; rates: Record<string, number> }
let pending: Promise<Fx | null> | null = null;

export function useFx(): Fx | null {
  const [fx, setFx] = useState<Fx | null>(null);
  useEffect(() => {
    pending ??= fetch('/api/fx').then((r) => (r.ok ? r.json() : null)).catch(() => null);
    let alive = true;
    pending.then((v) => { if (alive) setFx(v); });
    return () => { alive = false; };
  }, []);
  return fx;
}

/** « ≈ 88 € » : montant arrondi à l’unité (ou au centime sous 10), au format du pays. */
export function approx(usd: number, cur: string, rate: number, locale: string) {
  const v = usd * rate;
  return `≈ ${new Intl.NumberFormat(locale, { style: 'currency', currency: cur, maximumFractionDigits: v < 10 ? 2 : 0, minimumFractionDigits: v < 10 ? 2 : 0, useGrouping: 'always' as unknown as boolean }).format(v)}`;
}
