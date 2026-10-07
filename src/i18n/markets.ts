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
  /**
   * Prix annuel HT (payé d’avance, « 2 mois offerts ») ; absent = pas de facturation annuelle.
   * Les minutes restent attribuées chaque mois (`minutes`), le prix de la minute supplémentaire ne change pas.
   */
  annualPrice?: number;
}

/**
 * Cadre juridique du pays, rédigé dans la langue du marché. Utilisé par les CGU, la politique de
 * confidentialité et les mentions légales. Droit applicable et tribunal : ceux du siège de la société
 * (Wyoming, États-Unis) pour tous les pays ; autorité de protection des données et mentions impératives : locales.
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
  /** Prix de vente minimum d’un numéro dédié (par mois), affiché « à partir de » : coût Autocalls + 2 $. */
  phoneNumberFrom: number;
  /** Prix de la minute sans forfait (paiement à la consommation, compte sans abonnement dans l’espace client). */
  paygMinute: number;
  /** Coût horaire chargé d’un poste d’accueil, en USD, valeur de départ du calculateur (ordre de grandeur local). */
  hourlyCost: number;
  /** Devises locales affichées à titre indicatif sous les prix en USD (taux BCE du jour). */
  localCurrencies: string[];
  trial: { days: number; minutes: number };
  legal: MarketLegal;
  /** Numéro public du marché, décroché 24/7 par l’agent IA du pays (absent = pas de numéro affiché). */
  phone?: { e164: string; display: string; label: string; note: string };
  /** Assistant Autocalls du widget de vente pour ce pays (uuid). */
  widgetAssistantId: string;
  /** Forfaits de l’admin Autocalls facturés dans ce pays (à renseigner si les prix divergent). */
  autocallsPlanIds?: Partial<Record<PlanSlug, number>>;
}

// Grille commune actuelle, recopiée dans chaque marché pour pouvoir diverger plus tard.
const basePlans = (): Record<PlanSlug, PlanPricing> => ({
  decouverte: { price: 0, minutes: 30 },
  receptionniste: { price: 99, minutes: 350, extraMinute: 0.39, annualPrice: 990 },
  assistant: { price: 249, minutes: 1000, extraMinute: 0.36, annualPrice: 2490 },
  'centre-appels': { price: 499, minutes: 2300, extraMinute: 0.32, annualPrice: 4990 },
  'sur-mesure': { price: null, minutes: 2500 },
});
const baseRecharges = () => [39, 89, 159, 299, 725];
// Assistantes commerciales du widget, une par marché (Autocalls : 21203 FR, 21206 UK, 21207 AU, 21208 IT, 21209 PL, 21210 NL, 21306 HE).
const SALES_WIDGET = '2841fa2d-1fed-4fbc-b832-28b954d049a6';
const SHARED = { currency: 'USD' as const, hourlyCost: 20, phoneNumberFrom: 5.99, paygMinute: 0.39, trial: { days: 14, minutes: 30 }, autocallsPlanIds: { receptionniste: 1646, assistant: 1647, 'centre-appels': 1650 } };

export const MARKETS: Record<Locale, Market> = {
  fr: {
    ...SHARED, localCurrencies: ['EUR', 'CHF'], hourlyCost: 20, locale: 'fr', hreflang: 'fr', ogLocale: 'fr_FR', country: 'France et francophonie',
    brand: 'Permanence IA', tagline: 'Agents vocaux intelligents', numberLocale: 'fr-FR',
    legal: { governingLaw: 'droit de l’État du Wyoming (États-Unis)', court: 'Tribunal compétent du comté de Laramie (Wyoming, États-Unis)', dataAuthority: 'la Commission nationale de l’informatique et des libertés (CNIL)', privacyLaw: 'Règlement (UE) 2016/679 (RGPD) et loi Informatique et Libertés', copyrightLaw: 'Code de la propriété intellectuelle', mandatoryNote: '' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: SALES_WIDGET,
  },
  'en-gb': {
    ...SHARED, localCurrencies: ['GBP'], hourlyCost: 20, locale: 'en-gb', hreflang: 'en-GB', ogLocale: 'en_GB', country: 'United Kingdom',
    brand: 'PermanenceAI', tagline: 'AI Receptionist', numberLocale: 'en-GB',
    legal: { governingLaw: 'the laws of the State of Wyoming, United States', court: 'the state and federal courts located in Laramie County, Wyoming, United States', dataAuthority: 'the Information Commissioner’s Office (ICO)', privacyLaw: 'the UK GDPR and the Data Protection Act 2018', copyrightLaw: 'the Copyright, Designs and Patents Act 1988', mandatoryNote: '' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: '57ba145e-b9d7-47cb-8bd3-6053a861951b',
    phone: { e164: '+447367090106', display: '07367 090106', label: 'Call us, 24/7', note: 'Katie, our AI agent, answers sales and support questions — and it’s the best demo there is.' },
  },
  'en-au': {
    ...SHARED, localCurrencies: ['AUD'], hourlyCost: 24, locale: 'en-au', hreflang: 'en-AU', ogLocale: 'en_AU', country: 'Australia',
    brand: 'PermanenceAI', tagline: '24/7 AI Phone Receptionist', numberLocale: 'en-AU',
    legal: { governingLaw: 'the laws of the State of Wyoming, United States', court: 'the state and federal courts located in Laramie County, Wyoming, United States', dataAuthority: 'the Office of the Australian Information Commissioner (OAIC)', privacyLaw: 'the Privacy Act 1988 (Cth) and the Australian Privacy Principles', copyrightLaw: 'the Copyright Act 1968 (Cth)', mandatoryNote: 'Nothing in these terms excludes, restricts or modifies any right or remedy, or any guarantee, warranty or other term or condition, implied or imposed by the Australian Consumer Law that cannot lawfully be excluded or limited.' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: '59664acf-7aa5-4e6d-a2c8-d7f8fb558637',
  },
  it: {
    ...SHARED, localCurrencies: ['EUR'], hourlyCost: 18, locale: 'it', hreflang: 'it', ogLocale: 'it_IT', country: 'Italia',
    brand: 'PermanenceIA', tagline: 'Assistente telefonico AI', numberLocale: 'it-IT',
    legal: { governingLaw: 'legge dello Stato del Wyoming (Stati Uniti)', court: 'tribunale della contea di Laramie (Wyoming, Stati Uniti)', dataAuthority: 'il Garante per la protezione dei dati personali', privacyLaw: 'Regolamento (UE) 2016/679 (GDPR) e D.Lgs. 196/2003 (Codice privacy)', copyrightLaw: 'Legge 22 aprile 1941, n. 633 sul diritto d’autore', mandatoryNote: '' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: 'eb44bd48-491c-47c1-9c21-016f45678728',
  },
  pl: {
    ...SHARED, localCurrencies: ['PLN'], hourlyCost: 10, locale: 'pl', hreflang: 'pl', ogLocale: 'pl_PL', country: 'Polska',
    brand: 'PermanenceAI', tagline: 'Inteligentny asystent telefoniczny', numberLocale: 'pl-PL',
    legal: { governingLaw: 'prawu stanu Wyoming (Stany Zjednoczone)', court: 'sąd właściwy dla hrabstwa Laramie (Wyoming, Stany Zjednoczone)', dataAuthority: 'Prezes Urzędu Ochrony Danych Osobowych (UODO)', privacyLaw: 'Rozporządzenie (UE) 2016/679 (RODO) oraz ustawa o ochronie danych osobowych', copyrightLaw: 'ustawa z dnia 4 lutego 1994 r. o prawie autorskim i prawach pokrewnych', mandatoryNote: '' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: '83d46ff1-caac-4132-afa3-e03e3f1d4b0b',
  },
  nl: {
    ...SHARED, localCurrencies: ['EUR'], hourlyCost: 22, locale: 'nl', hreflang: 'nl', ogLocale: 'nl_NL', country: 'Nederland',
    brand: 'PermanenceAI', tagline: 'AI-telefonieassistent', numberLocale: 'nl-NL',
    legal: { governingLaw: 'het recht van de staat Wyoming (Verenigde Staten)', court: 'de bevoegde rechter in Laramie County (Wyoming, Verenigde Staten)', dataAuthority: 'de Autoriteit Persoonsgegevens', privacyLaw: 'de Algemene verordening gegevensbescherming (AVG)', copyrightLaw: 'de Auteurswet', mandatoryNote: '' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: '8fec85f2-1c9e-4af7-b48e-1925a1f34764',
  },
  he: {
    ...SHARED, localCurrencies: ['ILS'], hourlyCost: 15, locale: 'he', hreflang: 'he', ogLocale: 'he_IL', country: 'ישראל',
    brand: 'PermanenceAI', tagline: 'מענה טלפוני חכם 24/7', numberLocale: 'he-IL',
    legal: { governingLaw: 'דיני מדינת ויומינג, ארצות הברית', court: 'בתי המשפט המוסמכים במחוז לרמי, ויומינג, ארצות הברית', dataAuthority: 'הרשות להגנת הפרטיות', privacyLaw: 'חוק הגנת הפרטיות, התשמ״א-1981 ותקנות הגנת הפרטיות (אבטחת מידע), התשע״ז-2017', copyrightLaw: 'חוק זכות יוצרים, התשס״ח-2007', mandatoryNote: '' },
    plans: basePlans(), recharges: baseRecharges(), widgetAssistantId: 'd8bde5e6-bb6d-435c-8934-3c1131c964e9',
    // Ligne israélienne (Autocalls 11784), agent entrant 21314 (נועה).
    phone: { e164: '+97223767085', display: '02-376-7085', label: 'התקשרו אלינו, 24/7', note: 'נועה, סוכנת ה-AI שלנו, עונה בעברית – וזו גם ההדגמה הכי טובה.' },
  },
};

/** Formule internationale (versions anglaises, partages et titres par défaut). */
export const INTERNATIONAL_CLAIM = 'PermanenceAI — AI Receptionists that answer every call.';
