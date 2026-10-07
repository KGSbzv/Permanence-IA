// Bandeau de consentement aux cookies de mesure et de publicité (RGPD, UK GDPR, loi israélienne).
// Accepter et refuser ont le même poids ; le choix est mémorisé 6 mois et modifiable depuis le pied de page.
// z-[75] : au-dessus de la bulle fermée du widget (z-index 70), pour que les boutons restent accessibles sur mobile.
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { readConsent, saveConsent } from '@/lib/analytics';

export const OPEN_CONSENT_EVENT = 'pia-open-consent';

export default function ConsentBanner() {
  const { c } = useI18n();
  const t = c.site.consent;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readConsent()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!open) return null;
  const choose = (v: 'granted' | 'denied') => { saveConsent(v); setOpen(false); };

  return (
    <div role="dialog" aria-live="polite" aria-label={t.title} className="fixed inset-x-3 bottom-[5.5rem] z-[75] mx-auto max-w-xl rounded-2xl border border-line bg-white p-5 shadow-float lg:bottom-6 lg:start-6 lg:end-auto lg:mx-0">
      <p className="font-display font-semibold text-ink">{t.title}</p>
      <p className="mt-1.5 text-[14px] leading-relaxed">
        {t.text} <Link href="/cookies" className="font-semibold text-signal-deep hover:underline">{t.policy}</Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => choose('denied')} className="btn-ghost justify-center py-2.5 text-sm">{t.reject}</button>
        <button type="button" onClick={() => choose('granted')} className="btn-primary justify-center py-2.5 text-sm">{t.accept}</button>
      </div>
    </div>
  );
}
