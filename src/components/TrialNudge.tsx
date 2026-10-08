// Relance douce : un visiteur qui n’a rien fait (intention de sortie, ou 45 s sans action)
// se voit proposer l’essai gratuit, une seule fois par semaine.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Check, X } from 'lucide-react';
import { useCallbackModal } from '@/context/CallbackContext';
import { SIGNUP_URL } from '@/data/site';
import { useI18n } from '@/i18n';

const KEY = 'pia-trial-nudge';
const WEEK = 7 * 86_400_000;
const IDLE_MS = 45_000;
// Pages où le visiteur est déjà en train d’agir, ou où une interruption serait déplacée.
const SKIP = ['/essai-gratuit', '/contact', '/demo', '/aide', '/cgu', '/confidentialite', '/mentions-legales', '/cookies'];

function seenRecently() {
  try { return Date.now() - Number(localStorage.getItem(KEY) || 0) < WEEK; } catch { return false; }
}
/** Le visiteur est occupé ailleurs : autre fenêtre modale ouverte (rappel, démo dans le navigateur) ou focus dans
 *  une iframe (conversation avec l’agent, démo ou bulle du widget). Ses clics et touches n’arrivent alors pas à la page. */
function busyElsewhere() {
  return !!document.querySelector('[role="dialog"][aria-modal="true"]') || document.activeElement?.tagName === 'IFRAME';
}
function markSeen() {
  try { localStorage.setItem(KEY, String(Date.now())); } catch { /* stockage indisponible : on n’affichera qu’une fois par visite */ }
}

export default function TrialNudge() {
  const { pathname } = useRouter();
  const { isOpen: callbackOpen, openCallbackModal } = useCallbackModal();
  const [open, setOpen] = useState(false);
  const done = useRef(false); // déjà affiché, ou le visiteur a agi pendant cette visite
  const dialog = useRef<HTMLDivElement>(null);
  const { c, market, num, path } = useI18n();
  const t = c.ui.components.trialNudge;
  const signupHref = path(SIGNUP_URL);

  const show = useCallback(() => {
    if (done.current || callbackOpen || seenRecently() || busyElsewhere()) return;
    done.current = true;
    markSeen();
    setOpen(true);
  }, [callbackOpen]);

  useEffect(() => {
    if (SKIP.includes(pathname)) return;
    // Inactivité apparente pendant une conversation avec l’agent : on attend simplement un nouveau délai.
    const tick = () => { if (busyElsewhere()) idle = window.setTimeout(tick, IDLE_MS); else show(); };
    let idle = window.setTimeout(tick, IDLE_MS);
    const reset = () => { window.clearTimeout(idle); idle = window.setTimeout(tick, IDLE_MS); };
    // Toute action réelle (lien vers l’essai, saisie d’un formulaire) annule la relance pour cette visite ;
    // les autres clics relancent simplement le délai d’inactivité.
    const acted = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest(`a[href^="${signupHref}"], form, input, textarea, select`)) { done.current = true; window.clearTimeout(idle); } else reset();
    };
    const exit = (e: MouseEvent) => { if (e.clientY <= 0 && !e.relatedTarget) show(); };
    // Le focus passe dans une iframe (démarrage d’une conversation avec l’agent) : c’est une action réelle,
    // la relance est annulée pour cette visite.
    const blur = () => window.setTimeout(() => {
      if (document.activeElement?.tagName === 'IFRAME') { done.current = true; window.clearTimeout(idle); }
    }, 0);
    document.addEventListener('click', acted, true);
    document.addEventListener('focusin', acted, true);
    document.documentElement.addEventListener('mouseout', exit);
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('blur', blur);
    return () => {
      window.clearTimeout(idle);
      document.removeEventListener('click', acted, true);
      document.removeEventListener('focusin', acted, true);
      document.documentElement.removeEventListener('mouseout', exit);
      window.removeEventListener('scroll', reset);
      window.removeEventListener('blur', blur);
    };
  }, [pathname, show, signupHref]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLElement>('a,button')?.focus();
    // Pas de défilement de la page derrière la fenêtre.
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab' || !dialog.current) return;
      // Piège de focus : Tab et Maj+Tab restent dans la fenêtre.
      const items = Array.from(dialog.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'));
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialog.current.contains(active))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !dialog.current.contains(active))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; prev?.focus(); };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-night/50 sm:items-center sm:p-4" onClick={() => setOpen(false)}>
      <div
        ref={dialog} role="dialog" aria-modal="true" aria-labelledby="nudge-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-float sm:rounded-3xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="nudge-title" className="font-display text-2xl font-bold">{t.title(num(market.trial.minutes))}</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="rounded-md p-1.5 text-slate hover:bg-paper"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-2 text-[15px]">{t.text(market.trial.days)}</p>
        <ul className="mt-5 space-y-2 text-ink">
          {t.points.map((t) => (
            <li key={t} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden />{t}</li>
          ))}
        </ul>
        <Link href={SIGNUP_URL} onClick={() => setOpen(false)} className="btn-primary mt-6 w-full">{t.claim(num(market.trial.minutes))}</Link>
        <button type="button" onClick={() => { setOpen(false); openCallbackModal({ type: 'commercial' }); }} className="btn-ghost mt-3 w-full">{t.callMeBack}</button>
      </div>
    </div>
  );
}
