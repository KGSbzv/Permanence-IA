// Catégories des guides pratiques, dans l’ordre de la page d’aide. Gardées à part du contenu français
// (src/i18n/content/fr/guides.ts les réexporte) : la liste des guides (src/components/Guides.tsx) les lit sans
// charger les guides français dans les pages des autres langues (audit du 9 oct., action 22 : site plus léger).
export type GuideCategory = 'start' | 'assistant' | 'tools' | 'phone' | 'channels' | 'outbound' | 'results' | 'billing';

export const GUIDE_CATEGORIES: GuideCategory[] = ['start', 'assistant', 'tools', 'phone', 'channels', 'outbound', 'results', 'billing'];
