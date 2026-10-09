// Pack de l’anglais (Royaume-Uni) : seul contenu de langue chargé par le navigateur sur les pages /en-gb.
import { en } from '../content/en';
import { registerContent } from './registry';

registerContent('en', en);

/** Composant vide : rendu par next/dynamic pour que Next ajoute ce pack à la page (voir src/i18n/packs/fr.ts). */
export default function ContentPack() {
  return null;
}
