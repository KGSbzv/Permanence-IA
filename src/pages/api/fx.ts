// Taux de change indicatifs USD → devises locales (taux de référence de la BCE, via frankfurter.dev, sans clé).
// Mis en cache 12 h : les prix restent facturés en dollars, ces montants servent seulement de repère.
import type { NextApiRequest, NextApiResponse } from 'next';

const SYMBOLS = 'EUR,CHF,GBP,AUD,PLN,ILS';
let cache: { at: number; body: { date: string; rates: Record<string, number> } } | null = null;

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!cache || Date.now() - cache.at > 12 * 3600_000) {
      const r = await fetch(`https://api.frankfurter.dev/v1/latest?base=USD&symbols=${SYMBOLS}`, { signal: AbortSignal.timeout(5000) });
      if (!r.ok) throw new Error(`fx ${r.status}`);
      const d = await r.json();
      cache = { at: Date.now(), body: { date: d.date, rates: d.rates } };
    }
    res.setHeader('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=86400');
    return res.status(200).json(cache.body);
  } catch {
    // Source indisponible : derniers taux connus (périmés), mis en cache peu de temps pour réessayer bientôt.
    if (cache) {
      res.setHeader('Cache-Control', 'public, s-maxage=600');
      return res.status(200).json(cache.body);
    }
    // Sans taux, la page affiche seulement les prix en dollars.
    return res.status(503).json({ error: 'fx_unavailable' });
  }
}
