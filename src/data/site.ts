// Constantes techniques communes à toutes les langues (URLs, routes). Les textes sont dans
// src/i18n/content/<langue>/ et la marque, les prix, le widget et le numéro WhatsApp dans src/i18n/markets.ts.
import { asLocale } from '@/i18n/locales';
import { MARKETS } from '@/i18n/markets';

export const SITE = {
  url: 'https://www.permanenceia.com',
  appUrl: 'https://app.permanenceia.com',
  email: 'contact@permanenceia.com',
  company: 'SINAY STRATEGIC LLC',
  /** Adresse postale de la société (pied des emails). */
  address: '1603 Capitol Ave Suite 413G-2408, Cheyenne, WY 82001, USA',
  /** Page Facebook de la marque (en anglais). */
  facebook: 'https://www.facebook.com/permanenceia',
  /** Messenger de la Page (assistante IA Autocalls 21297, toutes les langues). */
  messenger: 'https://m.me/permanenceia',
};

/**
 * Numéro WhatsApp Business de la langue du site : le français (expéditeur Autocalls 521) partout, l’israélien
 * (expéditeur 529, +972 3-382-7709) pour le site en hébreu seulement. Langue inconnue : français.
 */
export const whatsappFor = (locale: string) => MARKETS[asLocale(locale)].whatsapp;
/** Lien wa.me du numéro WhatsApp de la langue, sans message prérempli (SMS, textes). */
export const whatsappLink = (locale: string) => `https://wa.me/${whatsappFor(locale).e164.slice(1)}`;
/** Lien « cliquer pour discuter » WhatsApp avec un premier message prérempli dans la langue du visiteur. */
export const whatsappUrl = (text: string, locale: string) => `${whatsappLink(locale)}?text=${encodeURIComponent(text)}`;

// Inscription : la page /essai-gratuit explique l’essai puis envoie vers la création de compte sur l’app.
export const SIGNUP_URL = '/essai-gratuit';
export const REGISTER_URL = `${SITE.appUrl}/register`;
/** Paramètres UTM repris de la page vers la création de compte. */
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
/**
 * Lien de création de compte avec la langue du site (?lang=) et les UTM de la page affichée (`search` =
 * window.location.search, vide côté serveur) : la langue et la provenance suivent l’inscrit.
 */
export function registerUrl(locale: string, search = '') {
  const u = new URL(REGISTER_URL);
  u.searchParams.set('lang', locale);
  const q = new URLSearchParams(search);
  for (const k of UTM_KEYS) {
    const v = q.get(k);
    if (v) u.searchParams.set(k, v.slice(0, 100));
  }
  return u.toString();
}
export const LOGIN_URL = `${SITE.appUrl}/login`;
export const DEMO_URL = '/demo';
/** Page Mon compte du site (forfait, solde, carte et factures en lecture seule, connexion par code email). */
export const ACCOUNT_URL = '/mon-compte';
// Pages de l’espace client : Billing info (carte dans l’onglet Wallet, factures, résiliation), choix ou changement
// de forfait (démarre l’essai), achat de minutes et de crédits de messages (Add credits).
export const APP_BILLING_URL = `${SITE.appUrl}/billing`;
export const APP_PLANS_URL = `${SITE.appUrl}/plans`;
export const APP_CREDITS_URL = `${SITE.appUrl}/credits`;

// Widget Autocalls (assistante commerciale voix + chat) ; l’assistant dépend du marché.
export const WIDGET_SRC = `${SITE.appUrl}/embed.js`;

/**
 * Secteurs de santé humaine mis en pause (7 octobre 2026) : enregistrements et transcriptions d’appels de patients
 * = données de santé (HDS en France, art. 9 RGPD, amendement 13 en Israël). Pages accessibles avec un avertissement,
 * mais retirées des menus, de l’accueil, des démos et du plan du site, et non indexées.
 */
export const PAUSED_SECTORS = ['dentaire-cliniques', 'kines-paramedical', 'medecine-esthetique'];
export const isActiveSector = (s: { slug: string }) => !PAUSED_SECTORS.includes(s.slug);
