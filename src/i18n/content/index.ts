// Contenus par langue (l’anglais sert au Royaume-Uni et à l’Australie ; `enAu` en remplace les exemples propres à l’Australie).
import type { Lang } from '../locales';
import { en } from './en';
import { enAu } from './en/au';
import { fr } from './fr';
import { he } from './he';
import { it } from './it';
import { nl } from './nl';
import { pl } from './pl';

type Content = typeof fr;

export const CONTENT: Record<Lang, Content> = {
  fr,
  en,
  it,
  pl,
  nl,
  he,
};

/** Contenu anglais adapté à l’Australie (montants en A$, lieux et vocabulaire locaux), pour la locale en-au. */
export const CONTENT_EN_AU: Content = enAu;
