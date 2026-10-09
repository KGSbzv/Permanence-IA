// Pack du polonais : seul contenu de langue chargé par le navigateur sur les pages /pl.
import { pl } from '../content/pl';
import { registerContent } from './registry';

registerContent('pl', pl);

/** Composant vide : rendu par next/dynamic pour que Next ajoute ce pack à la page (voir src/i18n/packs/fr.ts). */
export default function ContentPack() {
  return null;
}
