// Pack du français : seul contenu de langue chargé par le navigateur sur les pages françaises (src/i18n/index.tsx).
// Même typographie que côté serveur (espaces insécables), sinon le HTML du serveur et le navigateur différeraient.
import { fr } from '../content/fr';
import { withFrenchTypography } from '../typography';
import { registerContent } from './registry';

registerContent('fr', withFrenchTypography(fr));

/** Composant vide : rendu par next/dynamic pour que Next ajoute ce pack à la page (script et chargement avant hydratation). */
export default function ContentPack() {
  return null;
}
