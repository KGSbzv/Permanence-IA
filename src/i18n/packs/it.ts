// Pack de l’italien : seul contenu de langue chargé par le navigateur sur les pages /it.
import { it } from '../content/it';
import { registerContent } from './registry';

registerContent('it', it);

/** Composant vide : rendu par next/dynamic pour que Next ajoute ce pack à la page (voir src/i18n/packs/fr.ts). */
export default function ContentPack() {
  return null;
}
