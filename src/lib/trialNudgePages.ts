// Pages sans pop-up « essai gratuit » (src/components/TrialNudge.tsx) : le visiteur y agit déjà (essai, contact,
// démo), y lit l’aide en tant que client (guides, bases de connaissances, lien « Documentation » de l’espace client),
// règle ses e-mails ou se désinscrit, lit une page légale, ou tombe sur une page d’erreur.
// Audit des parcours du 9 oct. 2026 (action 32) : comparaison par préfixe, car le chemin reçu est le modèle de la route
// (« /aide/guides/[slug] », « /kb/[doc] ») ; avant, seul le chemin exact était exclu et les guides affichaient le pop-up.

export const NUDGE_SKIP = [
  '/essai-gratuit', '/contact', '/demo', '/aide', '/kb', '/mon-compte', '/preferences-email',
  '/cgu', '/confidentialite', '/mentions-legales', '/cookies', '/accessibilite', '/404', '/500', '/_error',
];

/** Le pop-up est-il exclu de cette page ? `pathname` : chemin ou modèle de route (router.pathname), sans langue. */
export function nudgeSkipped(pathname: string) {
  const p = pathname.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return NUDGE_SKIP.some((s) => p === s || p.startsWith(`${s}/`));
}
