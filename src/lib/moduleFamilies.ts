// Familles des modules (icônes des cartes, src/components/blocks.tsx), reconnues dans toutes les langues sans charger
// la liste française : chaque famille est repérée par un module représentatif, rangé dans la même famille partout.
// Audit du 9 oct., action 22 (site plus léger) : avant, la liste française des modules entrait dans les pages de toutes
// les langues, seulement pour retrouver la famille d’un module.

/** Module représentatif de chaque famille (slug identique dans toutes les langues). */
export const FAMILY_MODULES = {
  telephonie: 'receptionniste-ia',
  automatisation: 'support-client',
  crm: 'qualification-des-leads',
  messages: 'whatsapp-messages',
  agenda: 'prise-de-rendez-vous',
  pilotage: 'reporting',
} as const;
export type ModuleFamily = keyof typeof FAMILY_MODULES;

/** Famille d’un module, lue dans la liste de la langue affichée ; `undefined` si le module ou sa famille est inconnu. */
export function moduleFamily(modules: readonly { slug: string; family: string }[], slug: string): ModuleFamily | undefined {
  const family = modules.find((m) => m.slug === slug)?.family;
  if (!family) return undefined;
  return (Object.keys(FAMILY_MODULES) as ModuleFamily[]).find((k) => modules.find((m) => m.slug === FAMILY_MODULES[k])?.family === family);
}
