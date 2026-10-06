// Personnages des agents IA : une voix réelle par marché (même prénom que l’assistante Autocalls de ce pays).
// Les visages sont des illustrations générées (public/agents/), pas des personnes réelles ;
// l’accent affiché est traduit dans le contenu (c.ui.components.liveDemo.accents).
import type { Locale } from '@/i18n/locales';

export interface Persona {
  /** Prénom de l’agent (identique dans toutes les langues). */
  name: string;
  /** Portrait carré 200×200. */
  photo: string;
  /** Marché dont l’agent porte la voix (clé de l’accent dans le contenu). */
  voice: Locale;
}

export const PERSONAS: Record<Locale, Persona> = {
  fr: { name: 'Jade', photo: '/agents/jade.jpg', voice: 'fr' },
  'en-gb': { name: 'Katie', photo: '/agents/katie.jpg', voice: 'en-gb' },
  'en-au': { name: 'Charlotte', photo: '/agents/charlotte.jpg', voice: 'en-au' },
  it: { name: 'Manuela', photo: '/agents/manuela.jpg', voice: 'it' },
  pl: { name: 'Lena', photo: '/agents/lena.jpg', voice: 'pl' },
  nl: { name: 'Emma', photo: '/agents/emma.jpg', voice: 'nl' },
};

/**
 * Un personnage par rôle de l’équipe d’agents (même ordre que c.ui.components.agentTeam.agents),
 * identique dans toutes les langues : réceptionniste, rendez-vous, qualification, support, relance, messages.
 */
export const TEAM_PERSONAS: Persona[] = [
  PERSONAS.fr, PERSONAS.nl, PERSONAS['en-gb'], PERSONAS['en-au'], PERSONAS.it, PERSONAS.pl,
];
