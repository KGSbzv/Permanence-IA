// Pack de l’hébreu : seul contenu de langue chargé par le navigateur sur les pages /he.
import { he } from '../content/he';
import { registerContent } from './registry';

registerContent('he', he);

/** Composant vide : rendu par next/dynamic pour que Next ajoute ce pack à la page (voir src/i18n/packs/fr.ts). */
export default function ContentPack() {
  return null;
}
