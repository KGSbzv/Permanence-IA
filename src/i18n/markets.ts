// Un « marché » par locale : marque, slogan, prix et réglages commerciaux propres à chaque pays.
// Les prix sont identiques partout pour l’instant, mais chaque pays a sa propre fiche :
// pour changer l’Italie ou l’Australie, il suffit de modifier sa fiche, sans toucher aux autres.
//
// Important : le site affiche ces prix, mais le prélèvement réel se fait sur les forfaits de l’espace
// client (admin Autocalls). Un prix différent par pays exige des forfaits dédiés dans l’admin :
// renseignez alors leurs identifiants dans `autocallsPlanIds` pour garder la correspondance.

import type { Locale } from './locales';

export type PlanSlug = 'decouverte' | 'receptionniste' | 'assistant' | 'centre-appels' | 'sur-mesure';

export interface PlanPricing {
  /** Prix mensuel HT en devise du marché ; 0 = essai gratuit, null = sur devis. */
  price: number | null;
  /** Minutes incluses par mois (essai : minutes sur 14 jours ; sur mesure : seuil d’entrée). */
  minutes: number;
  /** Prix HT d’une minute au-delà du forfait (payée par le crédit). */
  extraMinute?: number;
}

/**
 * Cadre juridique du pays, rédigé dans la langue du marché. Utilisé par les CGU, la politique de
 * confidentialité et les mentions légales. À faire valider par un juriste du pays avant tout lancement.
 */
export interface MarketLegal {
  /** Droit applicable aux CGU (complément d’objet : « soumises à … »). */
  governingLaw: string;
  /** Juridiction compétente pour les litiges. */
  court: string;
  /** Autorité de protection des données à saisir en cas de réclamation. */
  dataAuthority: string;
  /** Texte de référence sur la protection des données. */
  privacyLaw: string;
  /** Texte de référence sur le droit d’auteur. */
  copyrightLaw: string;
  /** Mention impérative propre au pays (ex. Australian Consumer Law), sinon chaîne vide. */
  mandatoryNote: string;
}

export interface Market {
  locale: Locale;
  /** Valeur hreflang (balises de langue pour Google). */
  hreflang: string;
  /** Locale Open Graph (partage sur les réseaux). */
  ogLocale: string;
  /** Pays visé, en clair (pour la documentation interne). */
  country: string;
  /** Nom de marque affiché dans ce pays. */
  brand: string;
  /** Slogan court affiché sous le logo et dans les titres. */
  tagline: string;
  /** Formats nombres et prix (Intl). */
  numberLocale: string;
  currency: 'USD';
  plans: Record<PlanSlug, PlanPricing>;
  /** Montants des recharges de crédit proposées. */
  recharges: number[];
  /** Prix d’appel indicatif d’un numéro dédié (par mois), affiché comme « à partir de ». */
  phoneNumberFrom: number;
  trial: { days: number; minutes: number };
  legal: MarketLegal;
  /** Assistant Autocalls du widget de vente pour ce pays (uuid). */
  widgetAssistantId: string;
  /** Forfaits de l’admin Autocalls facturés dans ce pays (à renseigner si les prix divergent). */
  autocallsPlanIds?: Partial<Record<PlanSlug, number>>;
}

// Grille commune actuelle, recopiée dans chaque marché pour pouvoir diverger plus tard.
const basePlans = (): Record<PlanSlug, PlanPricing> => ({
  decouverte: { price: 0, minutes: 30 },
  receptionniste: { price: 99, minutes: 350, extraMinute: 0.39 },
  assistant: { price: 249, minutes: 1000, extraMinute: 0.36 },
  'centre-appels': { price: 499, minutes: 2200, extraMinute: 0.32 },
  'sur-mesure': { price: null, minutes: 2500 },
});
const baseRecharges = () => [39, 89, 159, 299, 725];
// Assistantes commerciales du widget, une par marché (Autocalls : 21203 FR, 21206 UK, 21207 AU, 21208 IT, 21209 PL, 21210 NL).
const SALES_WIDGET = '2841fa2d-1fed-4fbc-b832-28b954d049a6';
const SHARED = { currency: 'USD' as const, phoneNumberFrom: 3.99, trial: { days: 14, minutes: 30 }, autocallsPlanIds: { receptionniste: 1646, assistant: 1647, 'centre-appels': 1648 } };

export const MARKETS: Record<Locale, Market> = {
  fr: {
    ...SHARED, locale: 'fr', hreflang: 'fr', ogLocale: 'fr_FR', country: 'France et francophonie',
    brand: 'Permanence IA', tagline: 'Agents vocaux intelligents', numberLocale: 'fr-FR',
    legal: { governingLaw: 'droit français', court: 'Tribunal de commerce de Paris', dataAuthority: 'la Commission nationale de l’informatique et des libertés (CNIL)', privacyLaw: 'Règlement (UE) 2016/679 (RGPD) et loi Informatique et Libertés', copyrightLaw: 'Code de la propriété intellectuelle', mandatoryNote: '' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: SALES_WIDGET,
  },
  'en-gb': {
    ...SHARED, locale: 'en-gb', hreflang: 'en-GB', ogLocale: 'en_GB', country: 'United Kingdom',
    brand: 'PermanenceAI', tagline: 'AI Receptionist', numberLocale: 'en-GB',
    legal: { governingLaw: 'the laws of England and Wales', court: 'the courts of England and Wales', dataAuthority: 'the Information Commissioner’s Office (ICO)', privacyLaw: 'the UK GDPR and the Data Protection Act 2018', copyrightLaw: 'the Copyright, Designs and Patents Act 1988', mandatoryNote: '' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: '57ba145e-b9d7-47cb-8bd3-6053a861951b',
  },
  'en-au': {
    ...SHARED, locale: 'en-au', hreflang: 'en-AU', ogLocale: 'en_AU', country: 'Australia',
    brand: 'PermanenceAI', tagline: '24/7 AI Phone Receptionist', numberLocale: 'en-AU',
    legal: { governingLaw: 'the laws of New South Wales, Australia', court: 'the courts of New South Wales', dataAuthority: 'the Office of the Australian Information Commissioner (OAIC)', privacyLaw: 'the Privacy Act 1988 (Cth) and the Australian Privacy Principles', copyrightLaw: 'the Copyright Act 1968 (Cth)', mandatoryNote: 'Nothing in these terms excludes, restricts or modifies any right or remedy, or any guarantee, warranty or other term or condition, implied or imposed by the Australian Consumer Law that cannot lawfully be excluded or limited.' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: '59664acf-7aa5-4e6d-a2c8-d7f8fb558637',
  },
  it: {
    ...SHARED, locale: 'it', hreflang: 'it', ogLocale: 'it_IT', country: 'Italia',
    brand: 'PermanenceIA', tagline: 'Assistente telefonico AI', numberLocale: 'it-IT',
    legal: { governingLaw: 'legge italiana', court: 'Tribunale di Milano', dataAuthority: 'il Garante per la protezione dei dati personali', privacyLaw: 'Regolamento (UE) 2016/679 (GDPR) e D.Lgs. 196/2003 (Codice privacy)', copyrightLaw: 'Legge 22 aprile 1941, n. 633 sul diritto d’autore', mandatoryNote: '' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: 'eb44bd48-491c-47c1-9c21-016f45678728',
  },
  pl: {
    ...SHARED, locale: 'pl', hreflang: 'pl', ogLocale: 'pl_PL', country: 'Polska',
    brand: 'PermanenceAI', tagline: 'Inteligentny asystent telefoniczny', numberLocale: 'pl-PL',
    legal: { governingLaw: 'prawu polskiemu', court: 'sąd powszechny właściwy miejscowo dla Warszawy', dataAuthority: 'Prezes Urzędu Ochrony Danych Osobowych (UODO)', privacyLaw: 'Rozporządzenie (UE) 2016/679 (RODO) oraz ustawa o ochronie danych osobowych', copyrightLaw: 'ustawa z dnia 4 lutego 1994 r. o prawie autorskim i prawach pokrewnych', mandatoryNote: '' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: '83d46ff1-caac-4132-afa3-e03e3f1d4b0b',
  },
  nl: {
    ...SHARED, locale: 'nl', hreflang: 'nl', ogLocale: 'nl_NL', country: 'Nederland',
    brand: 'PermanenceAI', tagline: 'AI-telefonieassistent', numberLocale: 'nl-NL',
    legal: { governingLaw: 'Nederlands recht', court: 'de bevoegde rechter in Amsterdam', dataAuthority: 'de Autoriteit Persoonsgegevens', privacyLaw: 'de Algemene verordening gegevensbescherming (AVG)', copyrightLaw: 'de Auteurswet', mandatoryNote: '' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: '8fec85f2-1c9e-4af7-b48e-1925a1f34764',
  },
};

/** Formule internationale (versions anglaises, partages et titres par défaut). */
export const INTERNATIONAL_CLAIM = 'PermanenceAI — AI Receptionists that answer every call.';
