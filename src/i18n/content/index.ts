// Contenus par langue. Une langue pas encore traduite retombe sur le français.
import type { Lang } from '../locales';
import { fr } from './fr';

type Content = typeof fr;

export const CONTENT: Record<Lang, Content> = {
  fr,
  en: fr,
  it: fr,
  pl: fr,
  nl: fr,
};
