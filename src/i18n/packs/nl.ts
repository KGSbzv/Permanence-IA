// Pack du néerlandais : seul contenu de langue chargé par le navigateur sur les pages /nl.
import { nl } from '../content/nl';
import { registerContent } from './registry';

registerContent('nl', nl);

/** Composant vide : rendu par next/dynamic pour que Next ajoute ce pack à la page (voir src/i18n/packs/fr.ts). */
export default function ContentPack() {
  return null;
}
