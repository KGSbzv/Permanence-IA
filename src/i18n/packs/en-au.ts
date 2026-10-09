// Pack de l’anglais d’Australie (variante en/au.ts : A$, lieux et vocabulaire locaux), pour les pages /en-au.
import { enAu } from '../content/en/au';
import { registerContent } from './registry';

registerContent('en-au', enAu);

/** Composant vide : rendu par next/dynamic pour que Next ajoute ce pack à la page (voir src/i18n/packs/fr.ts). */
export default function ContentPack() {
  return null;
}
