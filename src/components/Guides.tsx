// Guides pratiques de l’espace client : liste par catégorie (page d’aide) et rendu d’une fiche.
import React from 'react';
import Link from 'next/link';
import type { Guide } from '@/i18n/content/fr/guides';
// Catégories seules (module léger) : les guides français n’entrent pas dans les pages des autres langues.
import { GUIDE_CATEGORIES } from '@/i18n/content/guideCategories';
import { useI18n } from '@/i18n';

/** Remplace les variables du contenu : {brand} (marque du marché), {numberFrom} (prix d’entrée d’un numéro). */
export function useGuideText() {
  const { market, money } = useI18n();
  const numberFrom = money(market.phoneNumberFrom, 2);
  return (s: string) => s.replace(/\{brand\}/g, market.brand).replace(/\{numberFrom\}/g, numberFrom);
}

export const guideHref = (slug: string) => `/aide/guides/${slug}`;

/** Index des guides, groupés par catégorie. */
export function GuideIndex() {
  const { c } = useI18n();
  const { ui, list } = c.guides;
  const fill = useGuideText();
  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-2">
      {GUIDE_CATEGORIES.map((cat) => {
        const items = list.filter((g) => g.category === cat);
        if (!items.length) return null;
        return (
          <div key={cat}>
            <h3 className="font-display text-lg font-bold">{ui.categories[cat]}</h3>
            <ul className="mt-4 space-y-3">
              {items.map((g) => (
                <li key={g.slug}>
                  <Link href={guideHref(g.slug)} className="group block rounded-2xl border border-line bg-white px-5 py-4 transition hover:border-signal">
                    <span className="font-semibold text-ink group-hover:text-signal-deep">{fill(g.title)}</span>
                    <span className="mt-1 block text-[15px]">{fill(g.summary)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// Codes de renvoi (**61*…#), numéros (+972…), adresses web, emails et balises (</body>) gardent leur sens
// (et identifiants techniques comme cal_live_) de lecture de gauche à droite, même dans un texte hébreu : sinon « ##61# » s'affiche « #61## ».
const LTR = /(https?:\/\/[^\s،]+|[\w.+-]+@[\w-]+\.[\w.]+|<\/?[A-Za-z][^<>]*>|[#*][#*\d][#*\d]*|\+\d[\d\s-]{6,}\d|\b[a-z]+_[a-z_]*_\B|\b[a-z]+_[a-z_]+\b)/g;
export function isolateLtr(text: string): React.ReactNode {
  const parts = text.split(LTR);
  if (parts.length === 1) return text;
  return parts.map((p, i) => (i % 2 ? <bdi key={i} dir="ltr">{p}</bdi> : p));
}

/** Corps d’une fiche : sections avec texte, étapes, listes et conseil. */
export function GuideBody({ guide }: { guide: Guide }) {
  const { c } = useI18n();
  const t = c.guides.ui;
  const fillText = useGuideText();
  const fill = (x: string) => isolateLtr(fillText(x));
  return (
    <div className="max-w-prose space-y-12">
      {guide.sections.map((s) => (
        <section key={s.title}>
          <h2 className="font-display text-2xl font-bold">{fill(s.title)}</h2>
          {s.text && <p className="mt-4 text-lg">{fill(s.text)}</p>}
          {s.steps && (
            <ol className="mt-5 space-y-3">
              {s.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-signal-soft font-display text-sm font-bold text-signal-deep" aria-hidden>{i + 1}</span>
                  <span className="pt-0.5 text-ink">{fill(step)}</span>
                </li>
              ))}
            </ol>
          )}
          {s.list && (
            <ul className="mt-5 list-disc space-y-2 ps-5 marker:text-signal">
              {s.list.map((item, i) => <li key={i}>{fill(item)}</li>)}
            </ul>
          )}
          {s.tip && (
            <div className="mt-6 rounded-2xl border border-line bg-paper px-5 py-4 text-[15px]">
              <p className="font-display text-sm font-semibold text-signal-deep">{t.tipLabel}</p>
              <p className="mt-1">{fill(s.tip)}</p>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
