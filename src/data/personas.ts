// Personnages des agents IA : deux voix réelles par marché (une féminine, une masculine), chacune reliée
// à son assistante / assistant Autocalls du widget. Les visages sont des illustrations générées (public/agents/),
// pas des personnes réelles ; l’accent affiché est traduit dans le contenu (c.ui.components.liveDemo.accents).
import type { Locale } from '@/i18n/locales';
import { MARKETS } from '@/i18n/markets';

export type Gender = 'female' | 'male';

export interface Persona {
  /** Prénom de l’agent (identique dans toutes les langues). */
  name: string;
  /** Portrait carré 200×200. */
  photo: string;
  /** Marché dont l’agent porte l’accent (clé de l’accent traduit dans le contenu). */
  accent: Locale;
  gender: Gender;
  /** Assistant Autocalls ouvert par le widget (« Dans ce navigateur ») pour cette voix. */
  widgetAssistantId: string;
}

const female = (l: Locale, name: string, photo: string): Persona =>
  ({ name, photo, accent: l, gender: 'female', widgetAssistantId: MARKETS[l].widgetAssistantId });
const male = (l: Locale, name: string, photo: string, widgetAssistantId: string): Persona =>
  ({ name, photo, accent: l, gender: 'male', widgetAssistantId });

/** Les deux voix de chaque marché. */
export const VOICES: Record<Locale, Record<Gender, Persona>> = {
  fr: { female: female('fr', 'Jade', '/agents/jade.jpg'), male: male('fr', 'Hugo', '/agents/hugo.jpg', 'b73b6d6a-da0e-46ee-951d-0e070f252280') },
  'en-gb': { female: female('en-gb', 'Katie', '/agents/katie.jpg'), male: male('en-gb', 'James', '/agents/james.jpg', '488b70e7-6d6f-456e-b1fe-bf6bdfcebbb0') },
  'en-au': { female: female('en-au', 'Charlotte', '/agents/charlotte.jpg'), male: male('en-au', 'Jack', '/agents/jack.jpg', 'd8cfdb1b-a4e5-4769-94b5-cf61c34d74f6') },
  it: { female: female('it', 'Manuela', '/agents/manuela.jpg'), male: male('it', 'Marco', '/agents/marco.jpg', 'd96c1ace-1564-4fdf-9360-c8753103d774') },
  pl: { female: female('pl', 'Lena', '/agents/lena.jpg'), male: male('pl', 'Tomasz', '/agents/tomasz.jpg', '9dd87407-08f2-4669-ad32-bdf358543b8c') },
  nl: { female: female('nl', 'Emma', '/agents/emma.jpg'), male: male('nl', 'Daan', '/agents/daan.jpg', 'edbb8a6e-1fe0-4083-ad5f-5790eead8eef') },
  he: { female: female('he', 'נועה', '/agents/noa.jpg'), male: male('he', 'דניאל', '/agents/daniel.jpg', '16cef988-872b-4b6b-820a-9ba7647930f6') },
};

/** Ordre d’affichage des voix dans le sélecteur de la démo. */
export const GENDERS: Gender[] = ['female', 'male'];

/** Personnage par défaut de chaque marché (voix féminine) : avatar du site, maquettes, explorateur de scénarios. */
export const PERSONAS: Record<Locale, Persona> = {
  fr: VOICES.fr.female,
  'en-gb': VOICES['en-gb'].female,
  'en-au': VOICES['en-au'].female,
  it: VOICES.it.female,
  pl: VOICES.pl.female,
  nl: VOICES.nl.female,
  he: VOICES.he.female,
};

/**
 * Un personnage par rôle de l’équipe d’agents (même ordre que c.ui.components.agentTeam.agents),
 * identique dans toutes les langues, en alternant voix féminines et masculines :
 * réceptionniste, rendez-vous, qualification, support, relance, messages.
 */
export const TEAM_PERSONAS: Persona[] = [
  VOICES.fr.female, VOICES.nl.male, VOICES['en-gb'].female, VOICES['en-au'].male, VOICES.it.female, VOICES.pl.male,
];
