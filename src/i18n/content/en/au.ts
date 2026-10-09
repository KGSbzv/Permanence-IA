// Variante australienne (en-AU) du contenu anglais : le texte anglais commun est rédigé pour le Royaume-Uni
// (£, « flat », « estate agents », MOT, Londres). Ici, seuls les exemples propres au marché sont remplacés :
// montants en A$, lieux australiens et vocabulaire immobilier et automobile local. Tout le reste vient de `en`.
// Utilisé pour la locale en-au par getI18n côté serveur (src/i18n/index.tsx) et par son pack du navigateur (src/i18n/packs/en-au.ts).
import type { fr } from '../fr';
import type { Sector } from '../fr/sectors';
import { en } from './index';

type Content = typeof fr;

/** Remplace des passages exacts dans toutes les chaînes d’un objet (les fonctions sont gardées telles quelles). */
function swap<T>(value: T, pairs: [string, string][]): T {
  if (typeof value === 'string') return pairs.reduce((s, [from, to]) => s.split(from).join(to), value as string) as T;
  if (Array.isArray(value)) return value.map((v) => swap(v, pairs)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, swap(v, pairs)])) as T;
  }
  return value;
}

// Secteurs : remplacements par fiche (slug), appliqués à tous ses textes.
const SECTOR_SWAPS: Record<string, [string, string][]> = {
  immobilier: [
    ['Estate agents', 'Real estate agents'],
    ['estate and letting agents', 'real estate agents and property managers'],
    ['Estate agent showing a bright flat', 'Real estate agent showing a bright apartment'],
    ['lettings and property management, block management', 'property management, strata management'],
    ['two-bedroom flat', 'two-bedroom apartment'],
    ['Two-bed flat', 'Two-bed apartment'],
    ['£320,000', 'A$650,000'],
  ],
  'gestion-locative': [
    ['Lettings and block management', 'Property management and strata'],
    ['Letting and managing agents, property management companies, block and estate managers, serviced and furnished lets', 'Property managers, agencies with a rent roll, strata managers, short-stay and furnished rentals'],
    ['tenants, leaseholders and applicants', 'tenants, lot owners and applicants'],
    ['communal areas', 'common property'],
    ['service charges, inventory', 'bond, condition report'],
    ['outside a block of flats', 'outside an apartment block'],
    ['Flat 12, 8 Queen’s Road', 'Unit 12, 8 Queen Street'],
    ['Flat 12, 8 Queen’s Rd', 'Unit 12, 8 Queen St'],
    ['What about block management?', 'What about strata management?'],
    ['individual flats, takes reports from leaseholders and answers practical questions about residents’ meetings', 'individual lots, takes reports from lot owners and answers practical questions about strata meetings'],
  ],
  automobile: [['Service and MOT reminders', 'Service and roadworthy reminders']],
  'services-a-domicile': [['under a sink in a flat', 'under a sink in an apartment']],
};

// Titres SEO australiens (45 caractères au plus), trouvés par le nom affiché du secteur.
const SECTOR_SEO_TITLE_AU: Record<string, string> = {
  'Real estate': 'AI receptionist for real estate agents',
  'Property management and strata': 'AI receptionist for property managers',
};

const sectors: Sector[] = en.sectors.map((s) => (SECTOR_SWAPS[s.slug] ? swap(s, SECTOR_SWAPS[s.slug]) : s));

const modules = en.modules.map((m) =>
  m.slug === 'relance-anciens-clients' ? swap(m, [['Car service or MOT', 'Car service or roadworthy check'], ['service, MOT,', 'service, roadworthy check,']]) : m,
);

// Bandeau des métiers et maquette du tableau de bord : vocabulaire australien.
const industryMarquee = swap(en.ui.components.industryMarquee, [
  ['Estate agents', 'Real estate agents'],
  ['Block management', 'Strata management'],
]);
const portalPreview = swap(en.ui.components.portalPreview, [['Two-bed flat buyer', 'Two-bed apartment buyer']]);

const mock = swap(en.ui.components.mock, [
  ['Around £300,000.', 'Around A$650,000.'],
  ['budget £300k', 'budget A$650k'],
  ['North London', 'Inner West, Sydney'],
  ['£8k – £12k', 'A$15k – A$20k'],
]);

export const enAu: Content = {
  ...en,
  sectors,
  modules,
  ui: {
    ...en.ui,
    components: {
      ...en.ui.components,
      industryMarquee,
      portalPreview,
      mock,
      // Pop-up de relance : « no lock-in contract », la formule australienne habituelle pour « sans engagement ».
      trialNudge: {
        ...en.ui.components.trialNudge,
        text: (days: number) => `Free ${days}-day trial, no lock-in contract. Card details are needed to activate, but nothing is charged during the trial. Cancel before the end at no cost.`,
      },
      // Démo en direct : les horaires de rappel sont donnés à l’heure de Sydney pour l’Australie
      liveDemo: {
        ...en.ui.components.liveDemo,
        sentText: (name: string) => en.ui.components.liveDemo.sentText(name).replace('UK time', 'Sydney time'),
      },
    },
    commerce: {
      ...en.ui.commerce,
      sectorsIndex: {
        ...en.ui.commerce.sectorsIndex,
        meta: { ...en.ui.commerce.sectorsIndex.meta, description: en.ui.commerce.sectorsIndex.meta.description.replace('estate agents', 'real estate agents') },
      },
      sector: {
        ...en.ui.commerce.sector,
        meta: {
          ...en.ui.commerce.sector.meta,
          title: (name: string, brand: string) =>
            SECTOR_SEO_TITLE_AU[name] ? `${SECTOR_SEO_TITLE_AU[name]} · ${brand}` : en.ui.commerce.sector.meta.title(name, brand),
        },
      },
    },
  },
};
