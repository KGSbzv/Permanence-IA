// Sélecteur de langue : mémorise le choix (cookie lu par src/middleware.ts) puis recharge la page dans la langue choisie.
import React from 'react';
import { useRouter } from 'next/router';
import { useI18n } from '@/i18n';
import { LOCALES, type Locale } from '@/i18n/locales';

// Chaque langue est présentée dans sa propre langue : ces noms ne se traduisent pas.
const NAMES: Record<Locale, string> = {
  fr: 'Français',
  'en-gb': 'English (UK)',
  'en-au': 'English (Australia)',
  it: 'Italiano',
  pl: 'Polski',
  nl: 'Nederlands',
  he: 'עברית',
};

export default function LanguageSwitcher({ dark = false, className = '', id = 'lang-switcher' }: { dark?: boolean; className?: string; id?: string }) {
  const router = useRouter();
  const { locale, c } = useI18n();

  function change(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Locale;
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
    // Rechargement complet (pas de navigation client) : le widget de l’assistante doit changer avec la langue.
    const path = router.asPath === '/' ? '' : router.asPath;
    window.location.assign(next === 'fr' ? path || '/' : `/${next}${path}`);
  }

  return (
    <span className={className}>
      <label htmlFor={id} className="sr-only">{c.site.languageLabel}</label>
      <select
        id={id} value={locale} onChange={change}
        className={`cursor-pointer rounded-md border px-2 py-1.5 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-signal ${dark ? 'border-white/15 bg-transparent text-white' : 'border-line bg-white text-ink'}`}
      >
        {LOCALES.map((l) => <option key={l} value={l} lang={l} className="text-ink">{NAMES[l]}</option>)}
      </select>
    </span>
  );
}
