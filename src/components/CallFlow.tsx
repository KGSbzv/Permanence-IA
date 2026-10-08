// Parcours d’un appel en 4 étapes : appel entrant → conversation avec l’agent → rendez-vous dans l’agenda
// → résumé WhatsApp au responsable. Les flèches de liaison s’inversent en RTL (globals.css, lucide-arrow-right).
import React from 'react';
import { ArrowRight, CalendarCheck, MessageCircle, MessagesSquare, PhoneIncoming } from 'lucide-react';
import { Heading, Section } from './ui';
import { useI18n } from '@/i18n';

/** Textes attendus dans c.ui.components.callFlow (même ordre que les icônes). */
export type CallFlowText = { title: string; intro?: string; steps: { title: string; text: string }[] };

const ICONS = [PhoneIncoming, MessagesSquare, CalendarCheck, MessageCircle];

export default function CallFlow({ tone }: { tone?: 'paper' }) {
  const { c } = useI18n();
  // Section affichée dès que les fichiers de contenu définissent callFlow (rien sinon).
  const t = (c.ui.components as { callFlow?: CallFlowText }).callFlow;
  if (!t?.steps?.length) return null;
  return (
    <Section tone={tone}>
      <Heading center title={t.title} intro={t.intro} />
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {t.steps.slice(0, ICONS.length).map((s, i) => {
          const Icon = ICONS[i];
          return (
            <li key={s.title} className="relative rounded-2xl border border-line bg-white p-5 shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-soft text-signal-deep"><Icon className="h-5 w-5" aria-hidden /></span>
              <p className="mt-4 font-display font-semibold text-ink">{s.title}</p>
              <p className="mt-1.5 text-[15px]">{s.text}</p>
              {i < ICONS.length - 1 && (
                <ArrowRight className="absolute -end-6 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-signal lg:block" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
