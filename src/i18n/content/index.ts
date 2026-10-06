// Contenus par langue (l’anglais sert au Royaume-Uni et à l’Australie).
import type { Lang } from '../locales';
import { en } from './en';
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
